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

// Before/after sliders in posts: <div data-compare> holds two stacked images and an <input type="range">;
// dragging sets --pos, which clips the "before" image (see .ps-compare in src/index.css).
const useCompareSliders = (root: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const sliders = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-compare]') ?? []);
    const cleanups = sliders.map((slider) => {
      const range = slider.querySelector<HTMLInputElement>('input[type="range"]');
      if (!range) throw new Error('[data-compare] needs an <input type="range">');
      const update = () => slider.style.setProperty('--pos', `${range.value}%`);
      range.addEventListener('input', update);
      update();
      return () => range.removeEventListener('input', update);
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [root]);
};

// Copy buttons in posts: <button data-copy="id"> copies the text of the element with that id. When the
// clipboard is refused, the text is selected instead so it can be copied by hand.
const COPY_RESET_MS = 2000;

const useCopyButtons = (root: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button[data-copy]') ?? []);
    const cleanups = buttons.map((button) => {
      const label = button.textContent;
      const onClick = () => {
        const target = document.getElementById(button.dataset.copy ?? '');
        if (!target) throw new Error(`data-copy target #${button.dataset.copy} is missing`);
        const selectText = () => {
          const range = document.createRange();
          range.selectNodeContents(target);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
          button.textContent = 'Selected';
        };
        if (!navigator.clipboard) {
          selectText();
          return;
        }
        navigator.clipboard
          .writeText(target.textContent ?? '')
          .then(() => { button.textContent = 'Copied'; }, selectText);
        window.setTimeout(() => { button.textContent = label; }, COPY_RESET_MS);
      };
      button.addEventListener('click', onClick);
      return () => button.removeEventListener('click', onClick);
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [root]);
};

// Renders pre-compiled Markdown HTML with Tailwind Typography styling.
const MarkdownContent = ({ html }: MarkdownContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEmbedBridge(ref);
  useCompareSliders(ref);
  useCopyButtons(ref);
  return (
    <div
      ref={ref}
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:scroll-mt-16 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border prose-img:border-border prose-blockquote:border-l-border prose-code:font-medium"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownContent;
