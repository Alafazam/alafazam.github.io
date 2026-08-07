#!/usr/bin/env bash
#
# mac-network-audit.sh
#
#   Purpose : Single-shot audit of ALL network activity on a macOS laptop over a
#             recent time window. Built for invigilating candidate machines
#             during a proctored test.
#
#   Usage   : chmod +x mac-network-audit.sh
#             sudo ./mac-network-audit.sh --hours 5
#
#   Output  : Prints to console AND writes one plain-text artifact to the Desktop.
#
#   Notes   : Read-only. Nothing on the machine is modified except the report
#             file it writes, plus a scratch copy of the log window under
#             $TMPDIR that is deleted on exit.
#
#             `log show` works unelevated but redacts private data and may be
#             blocked entirely without Full Disk Access. Run under sudo from a
#             terminal that has Full Disk Access for a complete audit; the
#             script reports loudly when a source is unreadable.
#
# Compatible with the stock macOS bash 3.2 and with zsh.

# Deliberately NOT `set -e`: one failing section must never abort the rest of
# the audit. Failures are collected and surfaced in the verdict instead.
set -u

# ---------------------------------------------------------------------------
# Configuration -- no magic numbers below this block
# ---------------------------------------------------------------------------
readonly DEFAULT_HOURS_BACK=5
readonly MIN_HOURS_BACK=1
readonly MAX_HOURS_BACK=72

readonly MESSAGE_TRIM_LENGTH=200
readonly RULE_WIDTH=100

# Bytes per mebibyte, used for every traffic figure in the report.
readonly BYTES_PER_MB=1048576
# An interface that has moved more than this since boot is called out in the
# verdict as worth a look. It is a prompt to investigate, not a proof.
readonly HIGH_TRAFFIC_MB=500

# Unified-log subsystems and processes that carry network lifecycle events.
readonly LOG_PREDICATE='process == "configd" OR process == "airportd" OR process == "networkd" OR process == "symptomsd" OR process == "kernel" OR subsystem == "com.apple.network" OR subsystem == "com.apple.wifi"'

# Keyword sets used to slice the captured log window. Extended regex.
readonly RE_WIFI='SSID|BSSID|assoc|ASSOC|auth|AUTH|_associat|link (UP|DOWN)|Roam|roam|WiFi|Wi-Fi|airport'
readonly RE_LINKSTATE='LINK|link state|Interface .* (up|down)|nwi_|network reachability|Reachability|PrimaryInterface|IPv4 .*(added|removed)|IPv6 .*(added|removed)'
readonly RE_DHCP='DHCP|BOOTP|dhcp|lease|LEASE|RENEW|REBIND|ACK from|OFFER|bound to'
readonly RE_REACHABILITY='Reachability|reachability|nwi_state|Network is (up|down)|captive|Captive'
readonly RE_TETHER='RNDIS|Remote NDIS|Bluetooth PAN|BluetoothPAN|USB Ethernet|AppleUSBEthernet|iPhone|iPad|Android|tether|Tether|Personal Hotspot|Hotspot|CDCEthernet|NCM|usbnet'
# Hardware ports whose presence means a non-Wi-Fi path exists on the machine.
readonly RE_TETHER_PORT='iPhone|iPad|Bluetooth PAN|USB.*LAN|USB.*Ethernet|Thunderbolt Ethernet|Android'

# `log erase` is the only supported way to wipe the unified log. It leaves no
# marker of its own, so tampering is inferred from the oldest surviving entry:
# if the log starts well after the window did, history is missing.
readonly LOG_GAP_TOLERANCE_MINUTES=10

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
HOURS_BACK=$DEFAULT_HOURS_BACK
OUTPUT_DIRECTORY=""
# Console-only mode. Used by the copy-paste one-liner, where the point is to
# read the result on screen and leave nothing behind on the machine.
NO_REPORT_FILE=0

print_usage() {
  cat <<USAGE
Usage: $(basename "$0") [--hours N] [--output-directory DIR] [--no-report-file]

  --hours N              Lookback window in hours (${MIN_HOURS_BACK}-${MAX_HOURS_BACK}, default ${DEFAULT_HOURS_BACK}).
  --output-directory DIR Where to write the report (default: ~/Desktop).
  --no-report-file       Print to the console only; write no report file at all.
  --help                 Show this message.
USAGE
}

while [ $# -gt 0 ]; do
  case "$1" in
    --hours|-h)
      HOURS_BACK="${2:-}"
      shift 2 || { echo "ERROR: --hours needs a value." >&2; exit 2; }
      ;;
    --output-directory|-o)
      OUTPUT_DIRECTORY="${2:-}"
      shift 2 || { echo "ERROR: --output-directory needs a value." >&2; exit 2; }
      ;;
    --no-report-file)
      NO_REPORT_FILE=1
      shift
      ;;
    --help)
      print_usage; exit 0
      ;;
    *)
      echo "ERROR: unknown argument '$1'." >&2
      print_usage >&2
      exit 2
      ;;
  esac
done

case "$HOURS_BACK" in
  ''|*[!0-9]*)
    echo "ERROR: --hours must be a whole number, got '$HOURS_BACK'." >&2
    exit 2
    ;;
esac
if [ "$HOURS_BACK" -lt "$MIN_HOURS_BACK" ] || [ "$HOURS_BACK" -gt "$MAX_HOURS_BACK" ]; then
  echo "ERROR: --hours must be between ${MIN_HOURS_BACK} and ${MAX_HOURS_BACK}, got ${HOURS_BACK}." >&2
  exit 2
fi

HOSTNAME_SHORT="$(scutil --get ComputerName 2>/dev/null || hostname -s 2>/dev/null || echo 'unknown-host')"

REPORT_FILE=""
if [ "$NO_REPORT_FILE" -eq 0 ]; then
  # The Desktop is the default drop point so there is one artifact per candidate
  # in an obvious place. Fall back to the home directory if it does not exist.
  if [ -z "$OUTPUT_DIRECTORY" ]; then
    if [ -d "$HOME/Desktop" ]; then
      OUTPUT_DIRECTORY="$HOME/Desktop"
    else
      OUTPUT_DIRECTORY="$HOME"
    fi
  fi
  if [ ! -d "$OUTPUT_DIRECTORY" ] || [ ! -w "$OUTPUT_DIRECTORY" ]; then
    echo "ERROR: output directory '$OUTPUT_DIRECTORY' is missing or not writable." >&2
    exit 2
  fi
  STAMP="$(date '+%Y%m%d-%H%M%S')"
  # Spaces in a Mac's computer name are routine and make the filename awkward.
  HOSTNAME_SAFE="$(printf '%s' "$HOSTNAME_SHORT" | tr ' /' '__')"
  REPORT_FILE="${OUTPUT_DIRECTORY}/NetworkAudit-${HOSTNAME_SAFE}-${STAMP}.txt"
elif [ -n "$OUTPUT_DIRECTORY" ]; then
  echo "ERROR: --no-report-file and --output-directory contradict each other." >&2
  exit 2
fi

WINDOW_START="$(date -v-"${HOURS_BACK}"H '+%Y-%m-%d %H:%M:%S' 2>/dev/null)"
if [ -z "$WINDOW_START" ]; then
  # date -v is BSD-only; this script is macOS-only, so this is a real failure.
  echo "ERROR: could not compute the window start time. Is this macOS?" >&2
  exit 2
fi

# ---------------------------------------------------------------------------
# Scratch state
# ---------------------------------------------------------------------------
LOG_DUMP="$(mktemp "${TMPDIR:-/tmp}/mac-network-audit.XXXXXX")" || {
  echo "ERROR: could not create a temporary file." >&2
  exit 2
}
STDERR_SCRATCH="$(mktemp "${TMPDIR:-/tmp}/mac-network-audit-err.XXXXXX")" || {
  rm -f "$LOG_DUMP"
  echo "ERROR: could not create a temporary file." >&2
  exit 2
}
cleanup() { rm -f "$LOG_DUMP" "$STDERR_SCRATCH"; }
trap cleanup EXIT HUP INT TERM

# Newline-separated list of sections that could not be read.
FAILURES=""
FAILURE_COUNT=0

record_failure() {
  FAILURES="${FAILURES}  - $1
"
  FAILURE_COUNT=$((FAILURE_COUNT + 1))
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
rule() { printf '%*s\n' "$RULE_WIDTH" '' | tr ' ' '='; }

section() {
  printf '\n'
  rule
  printf '  %s\n' "$1"
  rule
}

# Collapses whitespace and truncates, so one runaway log line cannot make the
# report unreadable.
trim_lines() {
  awk -v maxlen="$MESSAGE_TRIM_LENGTH" '
    { gsub(/[ \t]+/, " "); sub(/^ /, "")
      print (length($0) > maxlen ? substr($0, 1, maxlen) "..." : $0) }'
}

indent() { sed 's/^/  /'; }

# Runs a command, printing its output indented. A non-zero exit or anything on
# stderr is reported loudly and recorded, but never aborts the audit.
#   $1 = human label used in the failure list
#   $2 = command string, evaluated by the shell
try_command() {
  label="$1"
  command_string="$2"
  : >"$STDERR_SCRATCH"
  output="$(eval "$command_string" 2>"$STDERR_SCRATCH")"
  status=$?
  errors="$(cat "$STDERR_SCRATCH" 2>/dev/null)"

  if [ $status -ne 0 ]; then
    printf '  !! UNREADABLE: %s (exit %s)\n' "$label" "$status"
    [ -n "$errors" ] && printf '%s\n' "$errors" | indent
    record_failure "${label} -> exit ${status}: $(printf '%s' "$errors" | tr '\n' ' ')"
    return 1
  fi

  if [ -z "$output" ]; then
    printf '  (no data reported by: %s)\n' "$label"
  else
    printf '%s\n' "$output" | indent
  fi
  # A clean exit with warnings on stderr is worth showing but is not a failure.
  if [ -n "$errors" ]; then
    printf '  (warnings from %s)\n' "$label"
    printf '%s\n' "$errors" | indent
  fi
  return 0
}

# Slices the cached log window by keyword. Distinguishes three states that must
# never be confused: source unreadable, source readable but window empty, hits.
#   $1 = section label, $2 = extended regex
UNIFIED_LOG_READABLE=0
show_log_slice() {
  label="$1"
  pattern="$2"
  if [ "$UNIFIED_LOG_READABLE" -ne 1 ]; then
    printf '  !! UNREADABLE: the unified log could not be captured, so "%s" cannot be assessed.\n' "$label"
    printf '  !! This is NOT the same as "nothing happened". Re-run with sudo and Full Disk Access.\n'
    return 1
  fi
  matches="$(grep -E "$pattern" "$LOG_DUMP" 2>/dev/null | trim_lines)"
  if [ -z "$matches" ]; then
    printf '  No %s entries in the last %s h (log was readable and genuinely empty).\n' "$label" "$HOURS_BACK"
    return 0
  fi
  printf '%s\n' "$matches" | indent
  return 0
}

count_log_slice() {
  if [ "$UNIFIED_LOG_READABLE" -ne 1 ]; then printf 'unknown (log unreadable)'; return; fi
  # grep -c exits 1 on a zero count, so the count is read from stdout, not $?.
  slice_count="$(grep -Ec "$1" "$LOG_DUMP" 2>/dev/null)"
  printf '%s' "${slice_count:-0}"
}

# ---------------------------------------------------------------------------
# Main audit -- everything is emitted on stdout and tee'd to the report.
# ---------------------------------------------------------------------------
run_audit() {

  is_root=no
  [ "$(id -u)" -eq 0 ] && is_root=yes

  section 'AUDIT HEADER'
  printf '  Machine        : %s\n' "$HOSTNAME_SHORT"
  printf '  LoggedOnUser   : %s\n' "$(id -un)"
  printf '  AuditRunAt     : %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
  printf '  WindowStart    : %s\n' "$WINDOW_START"
  printf '  WindowHours    : %s\n' "$HOURS_BACK"
  printf '  ElevatedShell  : %s\n' "$is_root"
  printf '  OSVersion      : %s\n' "$(sw_vers -productVersion 2>/dev/null || echo 'unknown')"
  printf '  LastBootTime   : %s\n' "$(sysctl -n kern.boottime 2>/dev/null || echo 'unknown')"
  if [ "$NO_REPORT_FILE" -eq 1 ]; then
    printf '  ReportFile     : none (console-only run, nothing written to disk)\n'
  else
    printf '  ReportFile     : %s\n' "$REPORT_FILE"
  fi

  if [ "$is_root" != yes ]; then
    printf '\n  !! WARNING: not running as root. `log show` will redact private data and\n'
    printf '  !! may be refused outright. Re-run with sudo for a complete audit.\n'
  fi

  # -- Capture the log window once, then slice it repeatedly ----------------
  section "CAPTURING UNIFIED LOG WINDOW (last ${HOURS_BACK} h)"
  # `2>&1 >file` order matters: stderr is bound to the capture pipe first, then
  # stdout is redirected into the dump. Reversing it would put log noise in the
  # dump and silently poison every slice below.
  log_capture_errors="$(log show --last "${HOURS_BACK}h" --style compact \
                          --predicate "$LOG_PREDICATE" 2>&1 >"$LOG_DUMP")"
  log_capture_status=$?
  if [ $log_capture_status -ne 0 ]; then
    UNIFIED_LOG_READABLE=0
    printf '  !! UNREADABLE: `log show` failed (exit %s).\n' "$log_capture_status"
    [ -n "$log_capture_errors" ] && printf '%s\n' "$log_capture_errors" | indent
    printf '  !! Every log-derived section below is INCONCLUSIVE, not clean.\n'
    record_failure "log show -> exit ${log_capture_status}: $(printf '%s' "$log_capture_errors" | tr '\n' ' ')"
  else
    UNIFIED_LOG_READABLE=1
    captured_lines="$(wc -l < "$LOG_DUMP" | tr -d ' ')"
    printf '  Captured %s log lines for the window.\n' "$captured_lines"
    if [ -n "$log_capture_errors" ]; then
      printf '  (warnings during capture)\n'
      printf '%s\n' "$log_capture_errors" | indent
    fi
  fi

  # -- 1. Live state --------------------------------------------------------
  section '1. CURRENT NETWORK STATE (what it is connected to right now)'
  printf '  scutil --nwi:\n'
  try_command 'scutil --nwi' 'scutil --nwi'
  printf '\n  Active interfaces (ifconfig):\n'
  try_command 'ifconfig' "ifconfig | grep -E '^[a-z0-9]+:|inet |status:'"
  printf '\n  Current Wi-Fi association (system_profiler SPAirPortDataType):\n'
  try_command 'system_profiler SPAirPortDataType' \
    "system_profiler SPAirPortDataType 2>/dev/null | sed -n '1,80p'"
  printf '\n  Service order (networksetup -listnetworkserviceorder):\n'
  try_command 'networksetup -listnetworkserviceorder' 'networksetup -listnetworkserviceorder'

  # -- 2. Traffic volume ----------------------------------------------------
  section '2. TRAFFIC VOLUME PER INTERFACE (cumulative since boot, not window-scoped)'
  try_command 'netstat -ib' "netstat -ib | awk -v mb=${BYTES_PER_MB} '
      NR==1 { for (i=1;i<=NF;i++) { if (\$i==\"Ibytes\") ib=i; if (\$i==\"Obytes\") ob=i }
              printf \"%-12s %14s %14s\\n\", \"Interface\", \"RX (MB)\", \"TX (MB)\"; next }
      \$3 ~ /^<Link/ && ib && ob { printf \"%-12s %14.2f %14.2f\\n\", \$1, \$ib/mb, \$ob/mb }'"
  printf '\n  Interfaces above the %s MB attention threshold:\n' "$HIGH_TRAFFIC_MB"
  try_command 'netstat -ib (threshold scan)' "netstat -ib | awk -v mb=${BYTES_PER_MB} -v hi=${HIGH_TRAFFIC_MB} '
      NR==1 { for (i=1;i<=NF;i++) { if (\$i==\"Ibytes\") ib=i; if (\$i==\"Obytes\") ob=i }; next }
      \$3 ~ /^<Link/ && ib && ob { t=(\$ib+\$ob)/mb; if (t>hi) printf \"%-12s %.2f MB total\\n\", \$1, t }'"

  # -- 3. Wi-Fi session timeline -------------------------------------------
  section "3. WI-FI SESSION TIMELINE (last ${HOURS_BACK} h)"
  show_log_slice 'Wi-Fi' "$RE_WIFI"

  # -- 4. Connect / disconnect on any medium --------------------------------
  section "4. ALL NETWORK CONNECT / DISCONNECT (wired, wireless, tethered)"
  show_log_slice 'link-state / interface' "$RE_LINKSTATE"

  # -- 5. DHCP / lease activity ---------------------------------------------
  section "5. DHCP AND LEASE ACTIVITY (hard evidence of joining a network)"
  show_log_slice 'DHCP / lease' "$RE_DHCP"

  # -- 6. Reachability ------------------------------------------------------
  section '6. INTERNET REACHABILITY DECISIONS'
  show_log_slice 'reachability' "$RE_REACHABILITY"

  # -- 7. Tethering / dongle hardware ---------------------------------------
  section '7. NETWORK HARDWARE ATTACHED DURING WINDOW (phone tether, dongle)'
  printf '  Log entries naming tethering or USB/Bluetooth network hardware:\n'
  show_log_slice 'tethering hardware' "$RE_TETHER"
  printf '\n  Hardware ports present now (networksetup -listallhardwareports):\n'
  try_command 'networksetup -listallhardwareports' \
    "networksetup -listallhardwareports | grep -E -A1 '${RE_TETHER_PORT}' || echo 'No tethering-capable hardware ports found.'"
  printf '\n  USB devices attached now (system_profiler SPUSBDataType):\n'
  try_command 'system_profiler SPUSBDataType' \
    "system_profiler SPUSBDataType 2>/dev/null | grep -E '${RE_TETHER}' || echo 'No tethering-capable USB devices found.'"

  # -- 8. Saved Wi-Fi networks ----------------------------------------------
  section '8. SAVED WI-FI NETWORKS ON THIS MACHINE'
  wifi_device="$(networksetup -listallhardwareports 2>/dev/null \
                 | awk '/Wi-Fi|AirPort/ { getline; print $2; exit }')"
  if [ -n "$wifi_device" ]; then
    try_command "networksetup -listpreferredwirelessnetworks ${wifi_device}" \
      "networksetup -listpreferredwirelessnetworks '${wifi_device}'"
  else
    printf '  No Wi-Fi hardware port found, so there are no saved networks to list.\n'
  fi

  # -- 9. Tamper check ------------------------------------------------------
  section '9. TAMPER CHECK (was the log history truncated?)'
  if [ "$UNIFIED_LOG_READABLE" -ne 1 ]; then
    printf '  !! UNREADABLE: cannot assess tampering because the log could not be captured.\n'
  else
    # Skip the `log show` column header and take the first real timestamped row.
    oldest_entry="$(grep -m1 -E '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}' \
                    "$LOG_DUMP" 2>/dev/null | awk '{ print $1, $2 }')"
    if [ -z "$oldest_entry" ]; then
      printf '  !! The captured window contains ZERO entries across every network subsystem.\n'
      printf '  !! On a machine that has been running for hours this is itself suspicious:\n'
      printf '  !! it is the signature of `log erase`, not of a quiet machine.\n'
      record_failure 'unified log window was completely empty (possible log erase)'
    else
      window_epoch="$(date -j -f '%Y-%m-%d %H:%M:%S' "$WINDOW_START" '+%s' 2>/dev/null || echo '')"
      oldest_epoch="$(date -j -f '%Y-%m-%d %H:%M:%S' "$(printf '%s' "$oldest_entry" | cut -c1-19)" '+%s' 2>/dev/null || echo '')"
      printf '  Window starts at        : %s\n' "$WINDOW_START"
      printf '  Oldest surviving entry  : %s\n' "$oldest_entry"
      if [ -n "$window_epoch" ] && [ -n "$oldest_epoch" ]; then
        gap_minutes=$(( (oldest_epoch - window_epoch) / 60 ))
        printf '  Gap                     : %s minute(s)\n' "$gap_minutes"
        if [ "$gap_minutes" -gt "$LOG_GAP_TOLERANCE_MINUTES" ]; then
          printf '  !! The log begins %s minutes after the window did. History is missing.\n' "$gap_minutes"
          printf '  !! Treat every section above as incomplete.\n'
        else
          printf '  Log history covers the whole window. No truncation detected.\n'
        fi
      else
        printf '  Could not compare timestamps; inspect the two values above by eye.\n'
      fi
    fi
  fi

  # -- Verdict --------------------------------------------------------------
  section 'VERDICT'
  printf '  WifiEvents            : %s\n' "$(count_log_slice "$RE_WIFI")"
  printf '  LinkStateEvents       : %s\n' "$(count_log_slice "$RE_LINKSTATE")"
  printf '  DhcpEvents            : %s\n' "$(count_log_slice "$RE_DHCP")"
  printf '  ReachabilityEvents    : %s\n' "$(count_log_slice "$RE_REACHABILITY")"
  printf '  TetherHardwareEvents  : %s\n' "$(count_log_slice "$RE_TETHER")"
  if [ "$UNIFIED_LOG_READABLE" -eq 1 ]; then
    printf '  DistinctSsidsSeen     : %s\n' \
      "$(grep -Eo 'SSID[^ ]* [A-Za-z0-9._-]+' "$LOG_DUMP" 2>/dev/null \
         | awk '{print $2}' | sort -u | paste -sd ', ' - | sed 's/^$/none/')"
  else
    printf '  DistinctSsidsSeen     : unknown (log unreadable)\n'
  fi
  printf '  SectionsThatFailed    : %s\n' "$FAILURE_COUNT"

  if [ "$FAILURE_COUNT" -gt 0 ]; then
    printf '\n  Sections that could not be read (investigate before drawing conclusions):\n'
    printf '%s' "$FAILURES"
    printf '\n  An unreadable section is NOT a clean section.\n'
  fi
}

if [ "$NO_REPORT_FILE" -eq 1 ]; then
  # No pipeline here, so run_audit executes in this shell and FAILURE_COUNT
  # survives to be read directly.
  run_audit 2>&1
  printf '\nConsole-only run: no report file was written.\n'
  [ "$FAILURE_COUNT" -eq 0 ] && exit 0
  exit 1
fi

# Everything is produced once and written to both destinations.
run_audit 2>&1 | tee "$REPORT_FILE"

printf '\nText report written to: %s\n' "$REPORT_FILE"

# The verdict counters live in the `tee` subshell, so re-derive the exit status
# from the report itself: non-zero means at least one section was unreadable.
if grep -q 'SectionsThatFailed    : 0' "$REPORT_FILE" 2>/dev/null; then
  exit 0
fi
exit 1
