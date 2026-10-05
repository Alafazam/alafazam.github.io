#Requires -Version 5.1
<#
    Audit-ExamLaptopNetwork.ps1

    Purpose : Single-shot audit of ALL network activity on a Windows laptop
              over a recent time window. Built for invigilating candidate
              machines during a proctored test.

    Usage   : Right-click PowerShell -> Run as Administrator, then:
                  Set-ExecutionPolicy -Scope Process Bypass -Force
                  .\Audit-ExamLaptopNetwork.ps1                # last 5 h: was the internet used?
                  .\Audit-ExamLaptopNetwork.ps1 -Full          # plus the detailed audit
                  .\Audit-ExamLaptopNetwork.ps1 -SaveReport    # also save to the Desktop

    Output  : By default, only whether the internet was used in the window,
              how many times, and from when to when. -Full adds the detailed
              audit. Prints to the console. With -SaveReport (or -OutputDirectory)
              it also writes one plain-text artifact, to the Desktop by
              default, and triggers the native Windows wireless report.

    Notes   : Read-only. Nothing on the machine is modified except the two
              report files written under -SaveReport.
#>

[CmdletBinding()]
param(
    [ValidateRange(1, 72)]
    [int] $HoursBack = 5,

    # Passing this implies -SaveReport.
    [string] $OutputDirectory = (Join-Path $env:USERPROFILE 'Desktop'),

    # Console-only is the default, so the copy-paste one-liner needs no
    # arguments and leaves nothing behind on the machine. A file is opt-in.
    [switch] $SaveReport,

    # Also print the detailed audit (network state, traffic, DHCP, tethering,
    # tamper check). Without it, only the internet-usage answer is printed.
    [switch] $Full,

    # Predates console-only being the default. Still accepted so existing
    # commands keep working, and checked against an explicit request to save.
    [switch] $NoReportFile
)

$writeReport = $SaveReport -or $PSBoundParameters.ContainsKey('OutputDirectory')
if ($NoReportFile -and $writeReport) {
    Write-Error '-NoReportFile contradicts -SaveReport / -OutputDirectory.'
    exit 2
}

# ---------------------------------------------------------------------------
# Configuration -- no magic numbers below this block
# ---------------------------------------------------------------------------
$LOG_WLAN            = 'Microsoft-Windows-WLAN-AutoConfig/Operational'
$LOG_NETPROFILE      = 'Microsoft-Windows-NetworkProfile/Operational'
$LOG_DHCP            = 'Microsoft-Windows-Dhcp-Client/Operational'
$LOG_NCSI            = 'Microsoft-Windows-NCSI/Operational'
$LOG_PNP             = 'Microsoft-Windows-Kernel-PnP/Configuration'
$LOG_SYSTEM          = 'System'

$ID_LOG_CLEARED      = 104            # System log: an event log was cleared
$ID_NETPROFILE_UP    = 10000          # network connected
$ID_NETPROFILE_DOWN  = 10001          # network disconnected

$WLAN_EVENT_MEANING  = @{
    8001  = 'WLAN CONNECTED'
    8002  = 'WLAN CONNECT FAILED'
    8003  = 'WLAN DISCONNECTED'
    11000 = 'Association started'
    11001 = 'Association succeeded'
    11004 = 'Association rejected'
    11005 = 'Association completed'
    11006 = 'Association failed'
    12011 = 'Authentication started'
    12012 = 'Authentication succeeded'
    12013 = 'Authentication failed'
}

$MESSAGE_TRIM_LENGTH = 160
# A busy laptop logs hundreds of events in a few hours, so each section of
# the detailed (-Full) audit shows only its most recent events.
$MAX_EVENTS_PER_SECTION = 15
# How session times are printed in the usage answer, e.g. "05 Oct 10:15".
$SESSION_TIME_FORMAT    = 'dd MMM HH:mm'
# A drop that comes back within this many seconds (a Wi-Fi roam, a DHCP
# renew) is the same session, not a new one.
$SESSION_FLAP_SECONDS   = 60
# Names Windows shows while it is still identifying a network.
$PLACEHOLDER_NETWORK_NAMES = @('Identifying...', 'Unidentified network')
$TABLE_WIDTH         = 220
$TETHER_KEYWORDS     = 'RNDIS|Remote NDIS|Bluetooth PAN|USB Ethernet|Mobile Broadband|iPhone|Android|tether'

$since     = (Get-Date).AddHours(-$HoursBack)
$stamp     = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportTxt = Join-Path $OutputDirectory "NetworkAudit-$env:COMPUTERNAME-$stamp.txt"
$failures  = New-Object System.Collections.Generic.List[string]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Write-Section {
    param([string] $Title)
    "`n" + ('=' * 100)
    "  $Title"
    ('=' * 100)
}

function Trim-Message {
    param([string] $Text)
    if (-not $Text) { return '' }
    $flat = ($Text -replace "`r`n", ' ') -replace '\s+', ' '
    if ($flat.Length -le $MESSAGE_TRIM_LENGTH) { return $flat }
    return $flat.Substring(0, $MESSAGE_TRIM_LENGTH) + '...'
}

# Oldest-first events, keeping only the most recent $Max.
function Select-RecentEvents {
    param([object[]] $Events, [int] $Max)
    $sorted = @($Events | Sort-Object TimeCreated)
    if ($sorted.Count -le $Max) { return $sorted }
    return @($sorted | Select-Object -Last $Max)
}

# Printed on its own line above a capped table. Piping it into Format-Table
# instead would render the string as a one-column "Length" table.
function Get-TruncationNote {
    param([int] $Total, [int] $Max)
    if ($Total -gt $Max) {
        "  (showing the last $Max of $Total events)"
    }
}

function Format-Span {
    param([TimeSpan] $Span)
    $minutes = [int][math]::Floor($Span.TotalMinutes)
    if ($minutes -lt 60) { return "$minutes min" }
    return '{0} h {1} min' -f [math]::Floor($minutes / 60), ($minutes % 60)
}

function Get-NetworkName {
    param($NetworkEvent)
    if ($NetworkEvent.Message -match 'Name:\s*(.+?)(\r|\n|$)') {
        $name = $matches[1].Trim()
        if ($PLACEHOLDER_NETWORK_NAMES -notcontains $name) { return $name }
    }
    return ''
}

# The whole default output: was the machine online in the window, how many
# times, and from when to when. NetworkProfile 10000 / 10001 events are paired
# into sessions. An unreadable log is reported, never read as NO.
function Write-UsageSummary {
    param([object[]] $Events, [bool] $Readable, [bool] $OnlineNow, [int] $ClearedCount)

    if (-not $Readable) {
        '  Internet used : UNKNOWN (the network event log could not be read)'
        '  !! Re-run PowerShell as Administrator.'
        return
    }

    $sinceLabel = $since.ToString($SESSION_TIME_FORMAT)
    $sessions   = New-Object System.Collections.Generic.List[string]
    $openStart  = $null
    $openName   = ''
    $pendingOff = $null
    $isFirst    = $true
    # RecordId breaks time ties in the log's own order. (Sort-Object -Stable
    # would too, but it does not exist in Windows PowerShell 5.1.)
    foreach ($networkEvent in @($Events | Sort-Object TimeCreated, RecordId)) {
        $at   = $networkEvent.TimeCreated
        $name = Get-NetworkName $networkEvent
        if ($networkEvent.Id -eq $ID_NETPROFILE_UP) {
            if ($pendingOff -and ($at - $pendingOff).TotalSeconds -le $SESSION_FLAP_SECONDS) {
                $pendingOff = $null
            }
            elseif ($pendingOff) {
                $sessions.Add(('{0}  ->  {1}   ({2})   {3}' -f $openStart.ToString($SESSION_TIME_FORMAT),
                    $pendingOff.ToString($SESSION_TIME_FORMAT), (Format-Span ($pendingOff - $openStart)), $openName).TrimEnd())
                $openStart  = $null
                $pendingOff = $null
            }
            if (-not $openStart) { $openStart = $at; $openName = '' }
            # One connect logs several events while Windows identifies the network.
            if ($name) { $openName = $name }
        }
        elseif ($openStart) {
            if (-not $pendingOff) { $pendingOff = $at }
        }
        elseif ($isFirst) {
            $sessions.Add(('before {0}  ->  {1}   (already online when the window started)   {2}' -f $sinceLabel,
                $at.ToString($SESSION_TIME_FORMAT), $name).TrimEnd())
        }
        $isFirst = $false
    }
    if ($pendingOff) {
        $sessions.Add(('{0}  ->  {1}   ({2})   {3}' -f $openStart.ToString($SESSION_TIME_FORMAT),
            $pendingOff.ToString($SESSION_TIME_FORMAT), (Format-Span ($pendingOff - $openStart)), $openName).TrimEnd())
    }
    elseif ($openStart -and $OnlineNow) {
        $sessions.Add(('{0}  ->  still online   ({1} so far)   {2}' -f $openStart.ToString($SESSION_TIME_FORMAT),
            (Format-Span ((Get-Date) - $openStart)), $openName).TrimEnd())
    }
    elseif ($openStart) {
        $sessions.Add(('{0}  ->  end not logged   {1}' -f $openStart.ToString($SESSION_TIME_FORMAT), $openName).TrimEnd())
    }
    if ($sessions.Count -eq 0 -and $OnlineNow) {
        $sessions.Add("before $sinceLabel  ->  still online   (online for the whole window)")
    }

    if ($sessions.Count -eq 0) {
        "  Internet used : NO   (no connection in the last $HoursBack h)"
    }
    else {
        $plural = if ($sessions.Count -gt 1) { 's' } else { '' }
        "  Internet used : YES  ($($sessions.Count) time$plural)"
        for ($i = 0; $i -lt $sessions.Count; $i++) { '    {0}. {1}' -f ($i + 1), $sessions[$i] }
    }
    if ($ClearedCount -gt 0) {
        "  !! An event log was cleared $ClearedCount time(s) in this window, so NO cannot be trusted."
    }
}

# Reads one event log. A missing or disabled log is reported, never silently
# swallowed, but it does not abort the remaining sections.
function Get-AuditEvents {
    param(
        [string] $LogName,
        [int[]]  $EventIds
    )
    $filter = @{ LogName = $LogName; StartTime = $since }
    if ($EventIds) { $filter['Id'] = $EventIds }

    try {
        return @(Get-WinEvent -FilterHashtable $filter -ErrorAction Stop)
    }
    catch [System.Exception] {
        if ($_.Exception.Message -match 'No events were found') { return @() }
        $failures.Add("Could not read '$LogName' -> $($_.Exception.Message)")
        return @()
    }
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
$transcript = & {

    $isAdmin = ([Security.Principal.WindowsPrincipal]`
                [Security.Principal.WindowsIdentity]::GetCurrent()`
               ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

    # Read once, used by the usage answer and the detailed audit alike.
    $failuresBefore = $failures.Count
    $prof           = Get-AuditEvents -LogName $LOG_NETPROFILE -EventIds @($ID_NETPROFILE_UP, $ID_NETPROFILE_DOWN)
    $profReadable   = $failures.Count -eq $failuresBefore
    $cleared        = Get-AuditEvents -LogName $LOG_SYSTEM -EventIds @($ID_LOG_CLEARED)
    $onlineNow      = @(Get-NetConnectionProfile -ErrorAction SilentlyContinue | Where-Object {
                          $_.IPv4Connectivity -eq 'Internet' -or $_.IPv6Connectivity -eq 'Internet'
                      }).Count -gt 0

    if ($Full) {
    Write-Section 'AUDIT HEADER'
    [pscustomobject]@{
        Machine       = $env:COMPUTERNAME
        LoggedOnUser  = "$env:USERDOMAIN\$env:USERNAME"
        AuditRunAt    = (Get-Date).ToString('u')
        WindowStart   = $since.ToString('u')
        WindowHours   = $HoursBack
        ElevatedShell = $isAdmin
        LastBootTime  = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime.ToString('u')
    } | Format-List | Out-String -Width $TABLE_WIDTH
    }

    if (-not $isAdmin) {
        "!! WARNING: not running elevated. Some logs will be unreadable and"
        "!! the audit below may be incomplete. Re-run as Administrator."
    }

    # -- Usage answer: the whole default output ---------------------------
    Write-Section "INTERNET USAGE: $env:COMPUTERNAME, last $HoursBack h (since $($since.ToString($SESSION_TIME_FORMAT)))"
    Write-UsageSummary -Events $prof -Readable $profReadable -OnlineNow $onlineNow -ClearedCount $cleared.Count
    if (-not $Full) {
        ''
        '  For the detailed audit, re-run with -Full.'
        return
    }

    # -- 1. Live state ------------------------------------------------------
    Write-Section '1. CURRENT NETWORK STATE (what it is connected to right now)'
    try {
        Get-NetConnectionProfile |
            Select-Object Name, InterfaceAlias, NetworkCategory, IPv4Connectivity, IPv6Connectivity |
            Format-Table -AutoSize | Out-String -Width $TABLE_WIDTH
    } catch { $failures.Add("Get-NetConnectionProfile -> $($_.Exception.Message)") }

    'netsh wlan show interfaces:'
    (netsh wlan show interfaces) 2>&1 | Out-String

    # -- 2. Volume of traffic ----------------------------------------------
    Write-Section '2. TRAFFIC VOLUME PER ADAPTER (cumulative since adapter came up)'
    try {
        Get-NetAdapter | Where-Object Status -eq 'Up' | ForEach-Object {
            $s = Get-NetAdapterStatistics -Name $_.Name -ErrorAction SilentlyContinue
            [pscustomobject]@{
                Adapter      = $_.Name
                Type         = $_.MediaType
                LinkSpeed    = $_.LinkSpeed
                ReceivedMB   = if ($s) { [math]::Round($s.ReceivedBytes / 1MB, 2) } else { 'n/a' }
                SentMB       = if ($s) { [math]::Round($s.SentBytes     / 1MB, 2) } else { 'n/a' }
            }
        } | Format-Table -AutoSize | Out-String -Width $TABLE_WIDTH
    } catch { $failures.Add("Adapter statistics -> $($_.Exception.Message)") }

    # -- 3. Wi-Fi session timeline -----------------------------------------
    Write-Section "3. WI-FI SESSION TIMELINE (last $HoursBack h)"
    $wlan = Get-AuditEvents -LogName $LOG_WLAN
    if ($wlan.Count -eq 0) {
        'No wireless events in window.'
    } else {
        Get-TruncationNote $wlan.Count $MAX_EVENTS_PER_SECTION
        Select-RecentEvents $wlan $MAX_EVENTS_PER_SECTION | ForEach-Object {
            [pscustomobject]@{
                Time    = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Id      = $_.Id
                Meaning = if ($WLAN_EVENT_MEANING.ContainsKey($_.Id)) { $WLAN_EVENT_MEANING[$_.Id] } else { 'other' }
                Detail  = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 4. Any network, including cable and tethering ---------------------
    Write-Section "4. ALL NETWORK CONNECT / DISCONNECT (wired, wireless, tethered)"
    if ($prof.Count -eq 0) { 'No network profile events in window.' }
    else {
        Get-TruncationNote $prof.Count $MAX_EVENTS_PER_SECTION
        Select-RecentEvents $prof $MAX_EVENTS_PER_SECTION | ForEach-Object {
            [pscustomobject]@{
                Time   = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Event  = if ($_.Id -eq $ID_NETPROFILE_UP) { 'CONNECTED' } else { 'DISCONNECTED' }
                Detail = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 5. DHCP: proof a network was actually joined -----------------------
    Write-Section "5. DHCP ACTIVITY (hard evidence of joining a network)"
    $dhcp = Get-AuditEvents -LogName $LOG_DHCP
    if ($dhcp.Count -eq 0) { 'No DHCP events in window.' }
    else {
        Get-TruncationNote $dhcp.Count $MAX_EVENTS_PER_SECTION
        Select-RecentEvents $dhcp $MAX_EVENTS_PER_SECTION | ForEach-Object {
            [pscustomobject]@{
                Time   = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Id     = $_.Id
                Detail = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 6. Did real internet exist ----------------------------------------
    Write-Section "6. INTERNET REACHABILITY DECISIONS (NCSI)"
    $ncsi = Get-AuditEvents -LogName $LOG_NCSI
    if ($ncsi.Count -eq 0) { 'No NCSI events in window (log is often disabled by default).' }
    else {
        Get-TruncationNote $ncsi.Count $MAX_EVENTS_PER_SECTION
        Select-RecentEvents $ncsi $MAX_EVENTS_PER_SECTION | ForEach-Object {
            [pscustomobject]@{
                Time   = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Id     = $_.Id
                Detail = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 7. Tethering / dongle hardware ------------------------------------
    Write-Section "7. NETWORK HARDWARE PLUGGED IN DURING WINDOW (phone tether, dongle)"
    $pnp = Get-AuditEvents -LogName $LOG_PNP |
           Where-Object { $_.Message -match $TETHER_KEYWORDS }
    if ($pnp.Count -eq 0) { 'No tethering or network-dongle device arrivals detected.' }
    else {
        Get-TruncationNote $pnp.Count $MAX_EVENTS_PER_SECTION
        Select-RecentEvents $pnp $MAX_EVENTS_PER_SECTION | ForEach-Object {
            [pscustomobject]@{
                Time   = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Detail = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 8. Known Wi-Fi profiles -------------------------------------------
    Write-Section '8. SAVED WI-FI PROFILES ON THIS MACHINE'
    (netsh wlan show profiles) 2>&1 | Out-String

    # -- 9. Tamper check ----------------------------------------------------
    Write-Section '9. TAMPER CHECK (event logs cleared?)'
    if ($cleared.Count -eq 0) { 'No log-clear events in window.' }
    else {
        '!! Event log clearing detected. Treat the sections above as unreliable.'
        $cleared | Sort-Object TimeCreated | ForEach-Object {
            [pscustomobject]@{
                Time   = $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss')
                Detail = Trim-Message $_.Message
            }
        } | Format-Table -Wrap | Out-String -Width $TABLE_WIDTH
    }

    # -- 10. Verdict --------------------------------------------------------
    Write-Section 'VERDICT'
    $ssids = @($wlan | Where-Object Id -eq 8001 | ForEach-Object {
                  if ($_.Message -match 'SSID:\s*(.+?)(\r|\n|$)') { $matches[1].Trim() }
              } | Sort-Object -Unique)

    [pscustomobject]@{
        WlanConnectEvents      = @($wlan | Where-Object Id -eq 8001).Count
        WlanDisconnectEvents   = @($wlan | Where-Object Id -eq 8003).Count
        DistinctSsidsConnected = if ($ssids.Count) { $ssids -join ', ' } else { 'none' }
        NetworkConnectEvents   = @($prof | Where-Object Id -eq $ID_NETPROFILE_UP).Count
        NetworkDisconnectEvents = @($prof | Where-Object Id -eq $ID_NETPROFILE_DOWN).Count
        DhcpEvents             = $dhcp.Count
        TetherDeviceArrivals   = $pnp.Count
        LogsClearedInWindow    = $cleared.Count
        SectionsThatFailed     = $failures.Count
    } | Format-List | Out-String -Width $TABLE_WIDTH

    if ($failures.Count -gt 0) {
        'Sections that could not be read (investigate before drawing conclusions):'
        $failures | ForEach-Object { "  - $_" }
    }

} | Out-String

# ---------------------------------------------------------------------------
# Emit
# ---------------------------------------------------------------------------
Write-Host $transcript

if (-not $writeReport) {
    # Console-only: no artifact, and the native wireless report is skipped
    # because it would drop an HTML file under C:\ProgramData.
    if ($Full) {
        Write-Host "`nConsole-only run: no report file was written. Add -SaveReport to save one." -ForegroundColor Green
    }
}
else {
    Set-Content -Path $reportTxt -Value $transcript -Encoding UTF8

    Write-Host "`nText report written to: $reportTxt" -ForegroundColor Green

    # Native Windows wireless report: last 3 days of sessions as HTML.
    try {
        $null = netsh wlan show wlanreport 2>&1
        Write-Host 'Wireless HTML report: C:\ProgramData\Microsoft\Windows\WlanReport\wlan-report-latest.html' -ForegroundColor Green
    } catch {
        Write-Host "Could not generate wlanreport -> $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

if ($failures.Count -gt 0) { exit 1 } else { exit 0 }
