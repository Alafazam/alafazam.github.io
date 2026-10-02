#!/usr/bin/env bash
#
# linux-network-audit.sh
#
#   Purpose : Single-shot audit of ALL network activity on a Linux laptop over a
#             recent time window. Built for invigilating candidate machines
#             during a proctored test.
#
#   Usage   : chmod +x linux-network-audit.sh
#             sudo ./linux-network-audit.sh --hours 5
#
#   Output  : Prints to console AND writes one plain-text artifact to the Desktop.
#
#   Notes   : Read-only. Nothing on the machine is modified except the report
#             file it writes.
#
#             journalctl needs root (or membership of systemd-journal) to show
#             other users' and kernel messages. On hosts without systemd the
#             script falls back to /var/log/syslog and /var/log/messages.
#
# Requires bash. Avoids GNU-only constructs where a busybox host is plausible.

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

readonly BYTES_PER_MB=1048576
# An interface that has moved more than this since boot is called out in the
# verdict as worth a look. It is a prompt to investigate, not a proof.
readonly HIGH_TRAFFIC_MB=500

# systemd units that carry network lifecycle events, in priority order.
readonly UNIT_NETWORKMANAGER='NetworkManager'
readonly UNIT_WPA_SUPPLICANT='wpa_supplicant'
readonly UNIT_SYSTEMD_NETWORKD='systemd-networkd'
readonly UNIT_DHCLIENT='dhclient'

# Plain-text log files consulted when journalctl is unavailable.
readonly SYSLOG_PRIMARY='/var/log/syslog'
readonly SYSLOG_FALLBACK='/var/log/messages'

# Keyword sets used to slice the captured log window. Extended regex.
readonly RE_WIFI='wlan|wlp|SSID|ssid|associat|Associat|authenticat|deauth|WPA|wpa_supplicant|iwlwifi|disconnected|CTRL-EVENT'
readonly RE_LINKSTATE='link (up|down)|carrier|Carrier|state change|device state|NetworkManager.*connected|NetworkManager.*disconnected|Link UP|Link DOWN|entered (promiscuous|disabled) mode'
readonly RE_DHCP='DHCP|dhcp|dhclient|dhcpcd|DHCPACK|DHCPREQUEST|DHCPOFFER|DHCPDISCOVER|lease|LEASE|bound to|renewal'
readonly RE_REACHABILITY='connectivity|Connectivity|NetworkManager.*state.*(GLOBAL|SITE|PORTAL)|captive|Captive|nm-connectivity'
readonly RE_TETHER='rndis|RNDIS|cdc_ether|cdc_ncm|cdc_mbim|usbnet|ipheth|Bluetooth.*PAN|bnep|android|Android|iPhone|iPad|tether|Tether|usb0|enx[0-9a-f]{12}'

# Traces left behind when the journal is deliberately wiped.
readonly RE_LOG_CLEARED='vacuum|Vacuuming|journal.*(rotated|cleared|truncated)|systemd-journald.*(Permanent|Runtime) journal.*(deleted|removed)'
# If the surviving log starts this many minutes after the window did, history
# is missing rather than the machine simply being quiet.
readonly LOG_GAP_TOLERANCE_MINUTES=10

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
HOURS_BACK=$DEFAULT_HOURS_BACK
OUTPUT_DIRECTORY=""

print_usage() {
  cat <<USAGE
Usage: $(basename "$0") [--hours N] [--output-directory DIR]

  --hours N              Lookback window in hours (${MIN_HOURS_BACK}-${MAX_HOURS_BACK}, default ${DEFAULT_HOURS_BACK}).
  --output-directory DIR Where to write the report (default: ~/Desktop).
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

# When run under sudo, ~ is root's home; the report belongs on the candidate's
# Desktop, so resolve the invoking user's home first.
TARGET_USER="${SUDO_USER:-$(id -un)}"
TARGET_HOME="$(getent passwd "$TARGET_USER" 2>/dev/null | cut -d: -f6)"
[ -z "$TARGET_HOME" ] && TARGET_HOME="$HOME"

if [ -z "$OUTPUT_DIRECTORY" ]; then
  if [ -d "$TARGET_HOME/Desktop" ]; then
    OUTPUT_DIRECTORY="$TARGET_HOME/Desktop"
  else
    OUTPUT_DIRECTORY="$TARGET_HOME"
  fi
fi
if [ ! -d "$OUTPUT_DIRECTORY" ] || [ ! -w "$OUTPUT_DIRECTORY" ]; then
  echo "ERROR: output directory '$OUTPUT_DIRECTORY' is missing or not writable." >&2
  exit 2
fi

STAMP="$(date '+%Y%m%d-%H%M%S')"
HOSTNAME_SHORT="$(hostname -s 2>/dev/null || hostname 2>/dev/null || echo 'unknown-host')"
HOSTNAME_SAFE="$(printf '%s' "$HOSTNAME_SHORT" | tr ' /' '__')"
REPORT_FILE="${OUTPUT_DIRECTORY}/NetworkAudit-${HOSTNAME_SAFE}-${STAMP}.txt"

WINDOW_START="$(date -d "-${HOURS_BACK} hours" '+%Y-%m-%d %H:%M:%S' 2>/dev/null)"
if [ -z "$WINDOW_START" ]; then
  echo "ERROR: could not compute the window start time (need GNU date -d)." >&2
  exit 2
fi

# ---------------------------------------------------------------------------
# Scratch state
# ---------------------------------------------------------------------------
LOG_DUMP="$(mktemp "${TMPDIR:-/tmp}/linux-network-audit.XXXXXX")" || {
  echo "ERROR: could not create a temporary file." >&2
  exit 2
}
STDERR_SCRATCH="$(mktemp "${TMPDIR:-/tmp}/linux-network-audit-err.XXXXXX")" || {
  rm -f "$LOG_DUMP"
  echo "ERROR: could not create a temporary file." >&2
  exit 2
}
cleanup() { rm -f "$LOG_DUMP" "$STDERR_SCRATCH"; }
trap cleanup EXIT HUP INT TERM

FAILURES=""
FAILURE_COUNT=0
LOG_SOURCE='none'
LOG_READABLE=0

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

trim_lines() {
  awk -v maxlen="$MESSAGE_TRIM_LENGTH" '
    { gsub(/[ \t]+/, " "); sub(/^ /, "")
      print (length($0) > maxlen ? substr($0, 1, maxlen) "..." : $0) }'
}

indent() { sed 's/^/  /'; }

has_command() { command -v "$1" >/dev/null 2>&1; }

# Runs a command, printing its output indented. A non-zero exit is reported
# loudly and recorded, but never aborts the audit.
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
  if [ -n "$errors" ]; then
    printf '  (warnings from %s)\n' "$label"
    printf '%s\n' "$errors" | indent
  fi
  return 0
}

# Slices the cached log window by keyword. Distinguishes three states that must
# never be confused: source unreadable, source readable but window empty, hits.
show_log_slice() {
  label="$1"
  pattern="$2"
  if [ "$LOG_READABLE" -ne 1 ]; then
    printf '  !! UNREADABLE: no system log could be captured, so "%s" cannot be assessed.\n' "$label"
    printf '  !! This is NOT the same as "nothing happened". Re-run with sudo.\n'
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
  if [ "$LOG_READABLE" -ne 1 ]; then printf 'unknown (log unreadable)'; return; fi
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
  printf '  LoggedOnUser   : %s\n' "$TARGET_USER"
  printf '  AuditRunAt     : %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
  printf '  WindowStart    : %s\n' "$WINDOW_START"
  printf '  WindowHours    : %s\n' "$HOURS_BACK"
  printf '  ElevatedShell  : %s\n' "$is_root"
  printf '  Distribution   : %s\n' \
    "$(. /etc/os-release 2>/dev/null && printf '%s' "${PRETTY_NAME:-unknown}" || printf 'unknown')"
  printf '  Kernel         : %s\n' "$(uname -sr 2>/dev/null || echo 'unknown')"
  printf '  LastBootTime   : %s\n' "$(uptime -s 2>/dev/null || who -b 2>/dev/null || echo 'unknown')"
  printf '  ReportFile     : %s\n' "$REPORT_FILE"

  if [ "$is_root" != yes ]; then
    printf '\n  !! WARNING: not running as root. journalctl will hide kernel and other\n'
    printf '  !! users messages, so the audit below may be incomplete. Re-run with sudo.\n'
  fi

  # -- Capture the log window once, then slice it repeatedly ----------------
  section "CAPTURING SYSTEM LOG WINDOW (last ${HOURS_BACK} h)"
  if has_command journalctl; then
    LOG_SOURCE='journalctl'
    # -u filters are unioned; the kernel ring buffer is added separately below
    # so USB/tether arrivals are not lost.
    journal_errors="$(journalctl --since "$WINDOW_START" --no-pager \
                        -u "$UNIT_NETWORKMANAGER" -u "$UNIT_WPA_SUPPLICANT" \
                        -u "$UNIT_SYSTEMD_NETWORKD" -u "$UNIT_DHCLIENT" \
                        2>&1 >"$LOG_DUMP")"
    journal_status=$?
    if [ $journal_status -ne 0 ]; then
      LOG_READABLE=0
      printf '  !! UNREADABLE: journalctl failed (exit %s).\n' "$journal_status"
      [ -n "$journal_errors" ] && printf '%s\n' "$journal_errors" | indent
      record_failure "journalctl -> exit ${journal_status}: $(printf '%s' "$journal_errors" | tr '\n' ' ')"
    else
      LOG_READABLE=1
      # Kernel messages carry USB/tether device arrivals, which no unit does.
      journalctl --since "$WINDOW_START" --no-pager -k >>"$LOG_DUMP" 2>/dev/null
      printf '  Source: journalctl (units: %s, %s, %s, %s + kernel ring buffer)\n' \
        "$UNIT_NETWORKMANAGER" "$UNIT_WPA_SUPPLICANT" "$UNIT_SYSTEMD_NETWORKD" "$UNIT_DHCLIENT"
      printf '  Captured %s log lines for the window.\n' "$(wc -l < "$LOG_DUMP" | tr -d ' ')"
    fi
  fi

  # Non-systemd hosts, or a journalctl that refused to talk.
  if [ "$LOG_READABLE" -ne 1 ]; then
    for candidate in "$SYSLOG_PRIMARY" "$SYSLOG_FALLBACK"; do
      if [ -f "$candidate" ]; then
        if [ -r "$candidate" ]; then
          LOG_SOURCE="$candidate"
          LOG_READABLE=1
          cat "$candidate" >"$LOG_DUMP" 2>/dev/null
          printf '  Source: %s (plain-text fallback)\n' "$candidate"
          printf '  Captured %s log lines. NOTE: this file is not filtered to the\n' \
            "$(wc -l < "$LOG_DUMP" | tr -d ' ')"
          printf '  window, so entries older than %s h may appear below.\n' "$HOURS_BACK"
          break
        else
          printf '  !! UNREADABLE: %s exists but is not readable by this user.\n' "$candidate"
          record_failure "${candidate} exists but is not readable (re-run with sudo)"
        fi
      fi
    done
  fi

  if [ "$LOG_READABLE" -ne 1 ]; then
    printf '  !! No usable system log found (no journalctl, no %s, no %s).\n' \
      "$SYSLOG_PRIMARY" "$SYSLOG_FALLBACK"
    printf '  !! Every log-derived section below is INCONCLUSIVE, not clean.\n'
    record_failure 'no readable system log source on this host'
  fi

  # -- 1. Live state --------------------------------------------------------
  section '1. CURRENT NETWORK STATE (what it is connected to right now)'
  if has_command nmcli; then
    printf '  nmcli device status:\n'
    try_command 'nmcli device status' 'nmcli -c no device status'
    printf '\n  nmcli active connections:\n'
    try_command 'nmcli connection show --active' 'nmcli -c no connection show --active'
  else
    printf '  nmcli is not installed on this host; NetworkManager state unavailable.\n'
    record_failure 'nmcli not installed (current NetworkManager state unavailable)'
  fi
  if has_command ip; then
    printf '\n  Interfaces and addresses (ip addr):\n'
    try_command 'ip addr' "ip -o addr show | awk '{ print \$2, \$3, \$4 }'"
    printf '\n  Default routes (ip route):\n'
    try_command 'ip route' 'ip route show default'
  else
    printf '\n  iproute2 (`ip`) is not installed on this host.\n'
    record_failure 'iproute2 not installed (interface and route state unavailable)'
  fi

  # -- 2. Traffic volume ----------------------------------------------------
  section '2. TRAFFIC VOLUME PER INTERFACE (cumulative since boot, not window-scoped)'
  printf '  Summary:\n'
  try_command '/proc/net/dev' "awk -v mb=${BYTES_PER_MB} '
      NR<=2 { next }
      { gsub(/:/, \"\", \$1)
        if (header++ == 0) printf \"%-14s %14s %14s\\n\", \"Interface\", \"RX (MB)\", \"TX (MB)\"
        printf \"%-14s %14.2f %14.2f\\n\", \$1, \$2/mb, \$10/mb }' /proc/net/dev"
  printf '\n  Interfaces above the %s MB attention threshold:\n' "$HIGH_TRAFFIC_MB"
  try_command '/proc/net/dev (threshold scan)' "awk -v mb=${BYTES_PER_MB} -v hi=${HIGH_TRAFFIC_MB} '
      NR<=2 { next }
      { gsub(/:/, \"\", \$1); t=(\$2+\$10)/mb
        if (t > hi && \$1 != \"lo\") printf \"%-14s %.2f MB total\\n\", \$1, t }' /proc/net/dev"
  if has_command ip; then
    printf '\n  Full counters (ip -s link):\n'
    try_command 'ip -s link' 'ip -s link'
  fi

  # -- 3. Wi-Fi session timeline -------------------------------------------
  section "3. WI-FI SESSION TIMELINE (last ${HOURS_BACK} h)"
  show_log_slice 'Wi-Fi' "$RE_WIFI"

  # -- 4. Connect / disconnect on any medium --------------------------------
  section "4. ALL NETWORK CONNECT / DISCONNECT (wired, wireless, tethered)"
  show_log_slice 'link-state / device-state' "$RE_LINKSTATE"

  # -- 5. DHCP / lease activity ---------------------------------------------
  section "5. DHCP AND LEASE ACTIVITY (hard evidence of joining a network)"
  show_log_slice 'DHCP / lease' "$RE_DHCP"

  # -- 6. Reachability ------------------------------------------------------
  section '6. INTERNET REACHABILITY DECISIONS'
  show_log_slice 'connectivity' "$RE_REACHABILITY"

  # -- 7. Tethering / dongle hardware ---------------------------------------
  section '7. NETWORK HARDWARE ATTACHED DURING WINDOW (phone tether, dongle)'
  printf '  Log entries naming tethering or USB/Bluetooth network hardware:\n'
  show_log_slice 'tethering hardware' "$RE_TETHER"
  printf '\n  USB devices attached now:\n'
  if has_command lsusb; then
    try_command 'lsusb' "lsusb | grep -E '${RE_TETHER}' || echo 'No tethering-capable USB devices found.'"
  else
    printf '  lsusb is not installed; skipping the live USB inventory.\n'
  fi
  printf '\n  Non-primary network interfaces present now (usb0, enx*, bnep*):\n'
  if has_command ip; then
    try_command 'ip link (tether interfaces)' \
      "ip -o link show | awk -F': ' '{ print \$2 }' | grep -E '^(usb|enx|bnep|rndis)' || echo 'None present.'"
  else
    # /sys/class/net is always present on Linux, so the check still runs.
    try_command '/sys/class/net (tether interfaces)' \
      "ls /sys/class/net | grep -E '^(usb|enx|bnep|rndis)' || echo 'None present.'"
  fi

  # -- 8. Saved Wi-Fi networks ----------------------------------------------
  section '8. SAVED WI-FI NETWORKS ON THIS MACHINE'
  if has_command nmcli; then
    try_command 'nmcli connection show (wifi)' \
      "nmcli -c no -t -f NAME,TYPE,TIMESTAMP-REAL connection show | grep -i wireless || echo 'No saved Wi-Fi connections.'"
  else
    printf '  nmcli is not installed; saved-network list unavailable.\n'
  fi

  # -- 9. Tamper check ------------------------------------------------------
  section '9. TAMPER CHECK (were system logs cleared?)'
  if [ "$LOG_READABLE" -ne 1 ]; then
    printf '  !! UNREADABLE: cannot assess tampering because no log could be captured.\n'
  else
    printf '  Explicit log-clearing traces:\n'
    show_log_slice 'log-clearing' "$RE_LOG_CLEARED"

    if [ "$LOG_SOURCE" = 'journalctl' ]; then
      printf '\n  Journal coverage:\n'
      oldest_entry="$(journalctl --no-pager -o short-iso -n 1 --reverse --since '@0' 2>/dev/null | head -n 1)"
      journal_start="$(journalctl --no-pager --list-boots 2>/dev/null | head -n 1)"
      printf '    Window starts at       : %s\n' "$WINDOW_START"
      printf '    Oldest journal entry   : %s\n' "${oldest_entry:-unknown}"
      printf '    Boot list (first row)  : %s\n' "${journal_start:-unknown}"

      window_epoch="$(date -d "$WINDOW_START" '+%s' 2>/dev/null || echo '')"
      first_in_window="$(grep -m1 -E '^[A-Z][a-z]{2} [ 0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}|^[0-9]{4}-[0-9]{2}-[0-9]{2}' \
                         "$LOG_DUMP" 2>/dev/null)"
      if [ -z "$first_in_window" ]; then
        printf '    !! The captured window contains ZERO network log entries.\n'
        printf '    !! On a machine running for hours this is itself suspicious: it is the\n'
        printf '    !! signature of a wiped journal, not of a quiet machine.\n'
        record_failure 'log window was completely empty (possible journal wipe)'
      else
        first_epoch="$(date -d "$(printf '%s' "$first_in_window" | cut -d' ' -f1-3)" '+%s' 2>/dev/null || echo '')"
        if [ -n "$window_epoch" ] && [ -n "$first_epoch" ]; then
          gap_minutes=$(( (first_epoch - window_epoch) / 60 ))
          printf '    Gap to first entry     : %s minute(s)\n' "$gap_minutes"
          if [ "$gap_minutes" -gt "$LOG_GAP_TOLERANCE_MINUTES" ]; then
            printf '    !! The log begins %s minutes after the window did. History is missing.\n' "$gap_minutes"
            printf '    !! Treat every section above as incomplete.\n'
          else
            printf '    Log history covers the whole window. No truncation detected.\n'
          fi
        else
          printf '    Could not compare timestamps; inspect the values above by eye.\n'
        fi
      fi
    else
      printf '\n  Log file metadata (%s):\n' "$LOG_SOURCE"
      try_command 'stat on log file' "stat -c '    size=%s bytes  modified=%y  changed=%z' '$LOG_SOURCE'"
      printf '    A syslog file that is unexpectedly small or whose modified time is far\n'
      printf '    in the past for a running machine indicates truncation.\n'
    fi
  fi

  # -- Verdict --------------------------------------------------------------
  section 'VERDICT'
  printf '  LogSource             : %s\n' "$LOG_SOURCE"
  printf '  WifiEvents            : %s\n' "$(count_log_slice "$RE_WIFI")"
  printf '  LinkStateEvents       : %s\n' "$(count_log_slice "$RE_LINKSTATE")"
  printf '  DhcpEvents            : %s\n' "$(count_log_slice "$RE_DHCP")"
  printf '  ConnectivityEvents    : %s\n' "$(count_log_slice "$RE_REACHABILITY")"
  printf '  TetherHardwareEvents  : %s\n' "$(count_log_slice "$RE_TETHER")"
  printf '  LogClearingTraces     : %s\n' "$(count_log_slice "$RE_LOG_CLEARED")"
  if [ "$LOG_READABLE" -eq 1 ]; then
    printf '  DistinctSsidsSeen     : %s\n' \
      "$(grep -Eo "SSID[=' ]+[A-Za-z0-9._-]+" "$LOG_DUMP" 2>/dev/null \
         | sed -E "s/^SSID[=' ]+//" | sort -u | paste -sd ', ' - | sed 's/^$/none/')"
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

# Everything is produced once and written to both destinations.
run_audit 2>&1 | tee "$REPORT_FILE"

printf '\nText report written to: %s\n' "$REPORT_FILE"

# The verdict counters live in the `tee` subshell, so re-derive the exit status
# from the report itself: non-zero means at least one section was unreadable.
if grep -q 'SectionsThatFailed    : 0' "$REPORT_FILE" 2>/dev/null; then
  exit 0
fi
exit 1
