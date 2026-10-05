import { useEffect, useState, useCallback } from 'react';
import Seo from '../components/Seo';
import { staticRoute } from '../seo/routes';
import {
  Copy,
  Check,
  Monitor,
  Apple,
  Laptop,
  ShieldAlert,
  Info,
  type LucideIcon,
} from 'lucide-react';

// Internal proctoring utility. Reachable only by direct URL: it is deliberately
// absent from SiteNav, from public/sitemap.xml, and carries noindex/nofollow.

type OsId = 'windows' | 'macos' | 'linux';

// Absolute origin, not a relative path: the one-liners are typed into a shell
// on the candidate's machine, so they need the real public URL.
const SITE_ORIGIN = 'https://alafazam.com';

const DEFAULT_LOOKBACK_HOURS = 5;

interface OsGuide {
  id: OsId;
  name: string;
  icon: LucideIcon;
  /** Substrings matched against navigator.userAgent, in priority order. */
  userAgentHints: string[];
  privilegeNote: string;
  oneLiner: string;
}

// The scripts default to a 5 h lookback and console-only output, so the
// one-liners need no arguments and leave nothing on the machine.
const OS_GUIDES: OsGuide[] = [
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    userAgentHints: ['Windows', 'Win32', 'Win64'],
    privilegeNote:
      'Run in PowerShell as Administrator (right-click PowerShell → "Run as Administrator"), or several event logs will be unreadable.',
    oneLiner: `powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((irm ${SITE_ORIGIN}/audit/windows-network-audit.ps1)))"`,
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: Apple,
    userAgentHints: ['Macintosh', 'Mac OS X'],
    privilegeNote:
      'Run in Terminal. It asks for the admin password. Terminal also needs Full Disk Access (System Settings → Privacy & Security → Full Disk Access) or the log sections report as unreadable.',
    oneLiner: `curl -fsSL ${SITE_ORIGIN}/audit/mac-network-audit.sh | sudo bash`,
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Laptop,
    // Checked last: "Linux" also appears in Android user agents, and "X11"
    // appears in some Chrome OS strings.
    userAgentHints: ['Linux', 'X11'],
    privilegeNote:
      'Run in a terminal. It asks for the sudo password — without it journalctl hides the kernel messages where tethering and DHCP evidence lives.',
    oneLiner: `curl -fsSL ${SITE_ORIGIN}/audit/linux-network-audit.sh | sudo bash`,
  },
];

const WHAT_IS_COLLECTED = [
  'A quick answer at the top: one line per internet ON / OFF event, with its time, so you can read the result at a glance.',
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
  'Nothing is uploaded or saved anywhere — the report only prints on this screen.',
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
  /** Used for the button's accessible name, e.g. "the macOS command". */
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
      {/* Wrapped, not scrolled: the whole command stays visible on a phone.
          min-w-0 lets the pre shrink below its content width. */}
      <pre className="flex-1 min-w-0 whitespace-pre-wrap break-all px-3 py-2.5 text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-100">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `Copied ${contextLabel}` : `Copy ${contextLabel}`}
        title={copied ? 'Copied' : 'Copy'}
        className="shrink-0 self-start m-1.5 inline-flex items-center justify-center rounded-md p-2 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-700 dark:text-green-400" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
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
      <div className="flex flex-wrap items-center gap-3">
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

      <div className="mt-3">
        <CommandBlock
          command={guide.oneLiner}
          contextLabel={`the ${guide.name} command`}
          onAnnounce={onAnnounce}
        />
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
        <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
        <span>{guide.privilegeNote}</span>
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
        <Seo {...staticRoute('/campusHiring')} />

        {/* Copy confirmations are announced here for screen reader users. */}
        <div aria-live="polite" role="status" className="sr-only">
          {announcement}
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Campus Hiring — Network Audit</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Copy one read-only command into a terminal to report this machine&rsquo;s network
            activity over the last {DEFAULT_LOOKBACK_HOURS} hours. It prints to the screen and
            saves nothing.
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
      </div>
    </div>
  );
};

export default CampusHiring;
