import { useEffect, useRef } from 'react';

interface MarkdownContentProps {
  html: string;
}

// Same-origin embeds in posts (e.g. <iframe data-autoheight src="/tools/...">) report their height and
// ask for the site theme via postMessage; this keeps them sized to their content and in light/dark sync.
const useEmbedBridge = (root: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const frames = () =>
      Array.from(root.current?.querySelectorAll<HTMLIFrameElement>('iframe[data-autoheight]') ?? []);
    const theme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    const sendTheme = (win: Window | null) => win?.postMessage({ theme: theme() }, window.location.origin);

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || typeof e.data !== 'object' || !e.data) return;
      const frame = frames().find((f) => f.contentWindow === e.source);
      if (!frame) return;
      if (typeof e.data.embedHeight === 'number') {
        const border = frame.offsetHeight - frame.clientHeight; // the frame's own border eats into its height
        frame.style.height = `${Math.min(Math.max(e.data.embedHeight + border, 80), 2000)}px`;
      }
      if (e.data.embedReady) sendTheme(frame.contentWindow);
    };
    window.addEventListener('message', onMessage);

    // Follow the site's theme toggle (a `dark` class on <html>)
    const observer = new MutationObserver(() => frames().forEach((f) => sendTheme(f.contentWindow)));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('message', onMessage);
      observer.disconnect();
    };
  }, [root]);
};

// Renders pre-compiled Markdown HTML with Tailwind Typography styling.
const MarkdownContent = ({ html }: MarkdownContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEmbedBridge(ref);
  return (
    <div
      ref={ref}
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:scroll-mt-16 prose-a:text-primary prose-a:no-underline prose-a:hover:underline prose-img:rounded-lg prose-img:border prose-img:border-border prose-blockquote:border-l-border prose-code:font-medium"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownContent;
