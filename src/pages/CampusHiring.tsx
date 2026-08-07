import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import {
  Download,
  Copy,
  Check,
  Terminal,
  Monitor,
  Apple,
  Laptop,
  ShieldAlert,
  FileText,
  Info,
  type LucideIcon,
} from 'lucide-react';

// Internal proctoring utility. Reachable only by direct URL: it is deliberately
// absent from SiteNav, from public/sitemap.xml, and carries noindex/nofollow.

type OsId = 'windows' | 'macos' | 'linux';

// Absolute origin, not a relative path: the "fastest path" one-liners are typed
// into a shell on the candidate's machine, so they need the real public URL.
const SITE_ORIGIN = 'https://alafazam.com';

// Vite serves everything in public/ from BASE_URL, which is "/" in production
// and "/preview/" for staging builds. Download links must respect it.
const ASSET_BASE = `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/audit`;

const DEFAULT_LOOKBACK_HOURS = 5;

interface RunStep {
  label: string;
  command: string;
}

interface OsGuide {
  id: OsId;
  name: string;
  icon: LucideIcon;
  fileName: string;
  /** Substrings matched against navigator.userAgent, in priority order. */
  userAgentHints: string[];
  privilegeNote: string;
  steps: RunStep[];
  oneLiner: string;
  reportLocation: string;
}

const OS_GUIDES: OsGuide[] = [
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    fileName: 'windows-network-audit.ps1',
    userAgentHints: ['Windows', 'Win32', 'Win64'],
    privilegeNote:
      'Needs an elevated PowerShell — right-click PowerShell and choose "Run as Administrator", or several event logs will be unreadable.',
    steps: [
      {
        label: 'Go to the folder the file downloaded into',
        command: 'cd $env:USERPROFILE\\Downloads',
      },
      {
        // Windows marks downloaded files with a zone identifier that blocks
        // execution. This is the Windows analogue of chmod +x.
        label: 'Allow the downloaded script to run in this session only',
        command:
          'Set-ExecutionPolicy -Scope Process Bypass -Force; Unblock-File .\\windows-network-audit.ps1',
      },
      {
        label: 'Run the audit',
        command: `.\\windows-network-audit.ps1 -HoursBack ${DEFAULT_LOOKBACK_HOURS}`,
      },
    ],
    oneLiner: `powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((irm ${SITE_ORIGIN}/audit/windows-network-audit.ps1))) -HoursBack ${DEFAULT_LOOKBACK_HOURS}"`,
    reportLocation: 'Desktop \\ NetworkAudit-<COMPUTERNAME>-<timestamp>.txt',
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: Apple,
    fileName: 'mac-network-audit.sh',
    userAgentHints: ['Macintosh', 'Mac OS X'],
    privilegeNote:
      'Run it with sudo. `log show` also needs Full Disk Access for Terminal (System Settings → Privacy & Security → Full Disk Access) or the log sections report as unreadable.',
    steps: [
      {
        label: 'Go to the folder the file downloaded into',
        command: 'cd ~/Downloads',
      },
      {
        // The executable bit never survives an HTTP download.
        label: 'Restore the executable bit, which downloading strips',
        command: 'chmod +x mac-network-audit.sh',
      },
      {
        label: 'Run the audit',
        command: `sudo ./mac-network-audit.sh --hours ${DEFAULT_LOOKBACK_HOURS}`,
      },
    ],
    oneLiner: `curl -fsSL ${SITE_ORIGIN}/audit/mac-network-audit.sh | sudo bash -s -- --hours ${DEFAULT_LOOKBACK_HOURS}`,
    reportLocation: '~/Desktop/NetworkAudit-<hostname>-<timestamp>.txt',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Laptop,
    fileName: 'linux-network-audit.sh',
    // Checked last: "Linux" also appears in Android user agents, and "X11"
    // appears in some Chrome OS strings.
    userAgentHints: ['Linux', 'X11'],
    privilegeNote:
      'Run it with sudo — journalctl hides kernel and other users’ messages otherwise, which is where tethering and DHCP evidence lives.',
    steps: [
      {
        label: 'Go to the folder the file downloaded into',
        command: 'cd ~/Downloads',
      },
      {
        label: 'Restore the executable bit, which downloading strips',
        command: 'chmod +x linux-network-audit.sh',
      },
      {
        label: 'Run the audit',
        command: `sudo ./linux-network-audit.sh --hours ${DEFAULT_LOOKBACK_HOURS}`,
      },
    ],
    oneLiner: `curl -fsSL ${SITE_ORIGIN}/audit/linux-network-audit.sh | sudo bash -s -- --hours ${DEFAULT_LOOKBACK_HOURS}`,
    reportLocation: '~/Desktop/NetworkAudit-<hostname>-<timestamp>.txt',
  },
];

const WHAT_IS_COLLECTED = [
  'Every network connect and disconnect in the window, wired, wireless or tethered.',
  'DHCP and lease activity, which is hard evidence that a network was actually joined.',
  'Wi-Fi association timeline and the names (SSIDs) of networks connected to.',
  'Total bytes sent and received per network interface, counted since the machine booted.',
  'Tethering or dongle hardware attached during the window — phone USB, Bluetooth PAN, RNDIS adapters.',
  'Whether the system logs were cleared or truncated, which would make the rest unreliable.',
  'Saved Wi-Fi network names already stored on the machine.',
];

const WHAT_IS_NOT_COLLECTED = [
  'No page content, URLs, search history or browser data.',
  'No keystrokes, screenshots, screen recording or webcam access.',
  'No files, documents or personal data are read or copied.',
  'No message, email or chat content.',
  'Nothing is uploaded anywhere — the report is written only to this machine’s Desktop.',
];

/**
 * Copies text using the async Clipboard API, falling back to a hidden textarea
 * and execCommand. The modern API is unavailable on insecure origins and in
 * some locked-down enterprise browsers, which is exactly the kind of machine
 * this page runs on.
 */
async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Keep it off-screen but still focusable, which execCommand requires.
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** How long the "Copied" state stays visible before reverting, in ms. */
const COPY_FEEDBACK_MS = 2000;

interface CommandBlockProps {
  command: string;
  /** Used for the button's accessible name, e.g. "step 2 on macOS". */
  contextLabel: string;
  onAnnounce: (message: string) => void;
}

const CommandBlock = ({ command, contextLabel, onAnnounce }: CommandBlockProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(command);
    setCopied(ok);
    onAnnounce(ok ? `Copied ${contextLabel} to clipboard` : `Could not copy ${contextLabel}. Select the text and copy manually.`);
  }, [command, contextLabel, onAnnounce]);

  return (
    <div className="flex items-stretch gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      {/* min-w-0 lets the pre shrink below its content width so overflow-x-auto
          scrolls the code instead of widening the page on mobile. */}
      <pre className="flex-1 min-w-0 overflow-x-auto px-3 py-2.5 text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-100">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `Copied ${contextLabel}` : `Copy ${contextLabel}`}
        className="shrink-0 self-start m-1.5 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-700 dark:text-green-400" aria-hidden="true" />
            <span className="text-green-700 dark:text-green-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
};

interface OsCardProps {
  guide: OsGuide;
  isDetected: boolean;
  onAnnounce: (message: string) => void;
}

const OsCard = ({ guide, isDetected, onAnnounce }: OsCardProps) => {
  const Icon = guide.icon;

  return (
    <section
      aria-labelledby={`os-${guide.id}-heading`}
      className={`rounded-xl border p-5 sm:p-6 transition-colors ${
        isDetected
          ? 'border-blue-400 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60'
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <span className="shrink-0 grid place-items-center h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id={`os-${guide.id}-heading`} className="text-lg font-semibold">
          {guide.name}
        </h2>
        {isDetected && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Detected on this machine
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        <code className="text-xs bg-gray-100 dark:bg-gray-900 rounded px-1.5 py-0.5 break-all">
          {guide.fileName}
        </code>
      </p>

      <a
        href={`${ASSET_BASE}/${guide.fileName}`}
        download={guide.fileName}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download script
      </a>

      <p className="mt-3 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
        <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
        <span>{guide.privilegeNote}</span>
      </p>

      <ol className="mt-5 space-y-3">
        {guide.steps.map((step, index) => (
          <li key={step.command}>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                aria-hidden="true"
                className="grid place-items-center h-5 w-5 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 text-[11px] font-semibold text-gray-700 dark:text-gray-200"
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            <CommandBlock
              command={step.command}
              contextLabel={`step ${index + 1} for ${guide.name}`}
              onAnnounce={onAnnounce}
            />
          </li>
        ))}
      </ol>

      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-1">
          <Terminal className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          Fastest path — one command, no download
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          This fetches and executes a remote script, which is only acceptable here because the
          domain is mine and the source is the file linked above.
        </p>
        <CommandBlock
          command={guide.oneLiner}
          contextLabel={`the one-line ${guide.name} command`}
          onAnnounce={onAnnounce}
        />
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
        <FileText className="h-4 w-4 mt-0.5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <span>
          Report is written to{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-900 rounded px-1.5 py-0.5 break-all">
            {guide.reportLocation}
          </code>
        </span>
      </p>
    </section>
  );
};

/** Reads the OS from the user agent. Returns null when nothing matches. */
function detectOs(userAgent: string): OsId | null {
  // Mobile platforms borrow desktop tokens ("Linux" on Android, "Mac OS X" on
  // iOS), and none of them can run these scripts, so they match nothing.
  if (/Android|iPhone|iPad|iPod/i.test(userAgent)) return null;

  for (const guide of OS_GUIDES) {
    if (guide.userAgentHints.some((hint) => userAgent.includes(hint))) {
      return guide.id;
    }
  }
  return null;
}

const CampusHiring = () => {
  // Detection runs after mount, never during render: this page is prerendered
  // by react-snap, and reading navigator at render time would bake the build
  // machine's OS into the HTML and cause a hydration mismatch.
  const [detectedOs, setDetectedOs] = useState<OsId | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setDetectedOs(detectOs(navigator.userAgent));
  }, []);

  // index.html ships a static `index, follow` robots tag that react-helmet
  // cannot replace, because helmet only manages tags it created. Left alone,
  // this page prerenders with two contradicting robots tags. Crawlers are
  // supposed to honour the most restrictive one, but "supposed to" is not a
  // guarantee worth relying on for an internal utility, so the static tag is
  // rewritten to agree, and restored when navigating away.
  useEffect(() => {
    const staticRobots = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="robots"]:not([data-react-helmet])'
    );
    const previous = Array.from(staticRobots, (tag) => [tag, tag.content] as const);
    previous.forEach(([tag]) => {
      tag.content = 'noindex, nofollow';
    });
    return () => {
      previous.forEach(([tag, content]) => {
        tag.content = content;
      });
    };
  }, []);

  const handleAnnounce = useCallback((message: string) => {
    // Reset first so repeat copies of the same command are re-announced.
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(message), 100);
  }, []);

  // Detection only reorders the cards. All three stay rendered and usable.
  const orderedGuides = detectedOs
    ? [
        ...OS_GUIDES.filter((g) => g.id === detectedOs),
        ...OS_GUIDES.filter((g) => g.id !== detectedOs),
      ]
    : OS_GUIDES;

  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <Helmet>
          <title>Campus Hiring — Proctoring Network Audit</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Copy confirmations are announced here for screen reader users. */}
        <div aria-live="polite" role="status" className="sr-only">
          {announcement}
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Campus Hiring — Network Audit</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Download and run one read-only script to report this machine&rsquo;s network activity
            over the last {DEFAULT_LOOKBACK_HOURS} hours.
          </p>
        </header>

        {detectedOs === null && (
          <p className="mb-6 flex items-start gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 text-sm text-gray-600 dark:text-gray-300">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span>Operating system not recognised — pick the matching card below.</span>
          </p>
        )}

        <div className="space-y-6">
          {orderedGuides.map((guide) => (
            <OsCard
              key={guide.id}
              guide={guide}
              isDetected={guide.id === detectedOs}
              onAnnounce={handleAnnounce}
            />
          ))}
        </div>

        <section
          aria-labelledby="scope-heading"
          className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5 sm:p-6"
        >
          <h2 id="scope-heading" className="text-lg font-semibold mb-1">
            What this reports
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Show this section to the candidate before running the script.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Collected</h3>
              <ul className="space-y-1.5">
                {WHAT_IS_COLLECTED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Not collected
              </h3>
              <ul className="space-y-1.5">
                {WHAT_IS_NOT_COLLECTED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="output-heading" className="mt-8">
          <h2 id="output-heading" className="text-lg font-semibold mb-3">
            Where the report lands
          </h2>
          <ul className="space-y-2">
            {OS_GUIDES.map((guide) => (
              <li
                key={guide.id}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm"
              >
                <span className="font-medium w-20 shrink-0">{guide.name}</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 break-all">
                  {guide.reportLocation}
                </code>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            One file per run, timestamped, so each candidate leaves exactly one artifact. The
            scripts also print the same report to the console.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CampusHiring;
