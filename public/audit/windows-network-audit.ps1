#Requires -Version 5.1
<#
    Audit-ExamLaptopNetwork.ps1

    Purpose : Single-shot audit of ALL network activity on a Windows laptop
              over a recent time window. Built for invigilating candidate
              machines during a proctored test.

    Usage   : Right-click PowerShell -> Run as Administrator, then:
                  Set-ExecutionPolicy -Scope Process Bypass -Force
                  .\Audit-ExamLaptopNetwork.ps1 -HoursBack 5

    Output  : Prints to console AND writes one plain-text artifact to the
              Desktop, plus triggers the native Windows wireless report.
              Pass -NoReportFile to print to the console only and write
              nothing to disk.

    Notes   : Read-only. Nothing on the machine is modified except the two
              report files it writes.
#>

[CmdletBinding()]
param(
    [ValidateRange(1, 72)]
    [int] $HoursBack = 5,

    [string] $OutputDirectory = (Join-Path $env:USERPROFILE 'Desktop'),

    # Console-only mode. Used by the copy-paste one-liner, where the point is
    # to read the result on screen and leave nothing behind on the machine.
    [switch] $NoReportFile
)

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

    if (-not $isAdmin) {
        "!! WARNING: not running elevated. Some logs will be unreadable and"
        "!! the audit below may be incomplete. Re-run as Administrator."
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
        $wlan | Sort-Object TimeCreated | ForEach-Object {
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
    $prof = Get-AuditEvents -LogName $LOG_NETPROFILE -EventIds @($ID_NETPROFILE_UP, $ID_NETPROFILE_DOWN)
    if ($prof.Count -eq 0) { 'No network profile events in window.' }
    else {
        $prof | Sort-Object TimeCreated | ForEach-Object {
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
        $dhcp | Sort-Object TimeCreated | ForEach-Object {
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
        $ncsi | Sort-Object TimeCreated | ForEach-Object {
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
        $pnp | Sort-Object TimeCreated | ForEach-Object {
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
    $cleared = Get-AuditEvents -LogName $LOG_SYSTEM -EventIds @($ID_LOG_CLEARED)
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

if ($NoReportFile) {
    # Console-only: no artifact, and the native wireless report is skipped
    # because it would drop an HTML file under C:\ProgramData.
    Write-Host "`nConsole-only run: no report file was written." -ForegroundColor Green
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
