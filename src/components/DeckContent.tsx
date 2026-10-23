import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';

interface DeckContentProps {
  title: string;
  html: string;
}

interface DeckPart {
  id: string;
  tab: string;
}

// Horizontal finger travel, in pixels, that counts as a swipe to the next or previous slide.
const SWIPE_THRESHOLD_PX = 50;

const slideIndexFromHash = (total: number): number => {
  const n = parseInt(window.location.hash.slice(1), 10);
  return Number.isNaN(n) || n < 1 || n > total ? 0 : n - 1;
};

// Renders a `layout: deck` post as a slide deck: one <section class="slide"> per slide,
// moved through with Previous/Next, arrow keys, swipes or the part tabs. The slide number
// is kept in the URL hash (#3) so a link can point at a specific slide.
const DeckContent = ({ title, html }: DeckContentProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [slides, setSlides] = useState<HTMLElement[]>([]);
  const [parts, setParts] = useState<DeckPart[]>([]);
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  // Collect the slides once the HTML is in the DOM.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) throw new Error('Deck stage element is missing');

    const found = Array.from(stage.querySelectorAll<HTMLElement>('.slide'));
    if (found.length === 0) throw new Error('Deck post contains no <section class="slide"> elements');

    const partList = found
      .filter((s) => s.classList.contains('divider'))
      .map((s) => ({ id: s.dataset.part ?? '', tab: s.dataset.tab ?? '' }));

    setSlides(found);
    setParts(partList);
    setCurrent(slideIndexFromHash(found.length));
  }, [html]);

  // Show the current slide and mirror its number in the URL hash.
  useEffect(() => {
    if (total === 0) return;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    slides[current].scrollTop = 0;
    const hash = `#${current + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(window.history.state, '', hash);
  }, [slides, current, total]);

  const step = useCallback(
    (delta: number) => setCurrent((c) => Math.min(Math.max(c + delta, 0), total - 1)),
    [total]
  );

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const request = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen();
    request.catch((error: unknown) => console.warn('Deck full screen toggle was refused', error));
  }, []);

  useEffect(() => {
    if (total === 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const { target } = e;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'Home') {
        setCurrent(0);
      } else if (e.key === 'End') {
        setCurrent(total - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    const onHashChange = () => setCurrent(slideIndexFromHash(total));

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [total, step, toggleFullscreen]);

  const onTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) step(dx < 0 ? 1 : -1);
  };

  const currentPart = slides[current]?.dataset.part;
  const goToPart = (partId: string) => {
    const index = slides.findIndex((s) => s.dataset.part === partId);
    if (index !== -1) setCurrent(index);
  };

  return (
    <div className="deck" ref={rootRef}>
      <div className="deck-topbar">
        <h1 className="deck-brand">{title}</h1>
        <nav className="deck-tabs" aria-label="Parts">
          {parts.map((part) => (
            <button
              key={part.id}
              type="button"
              aria-current={part.id === currentPart ? 'true' : 'false'}
              onClick={() => goToPart(part.id)}
            >
              <span className="tn">{part.id}</span>
              <span className="tl">{part.tab}</span>
            </button>
          ))}
        </nav>
        <span className="deck-counter" aria-live="polite">
          {total > 0 && `${current + 1} / ${total}`}
        </span>
      </div>

      <div className="deck-viewport">
        <div
          className="stage"
          ref={stageRef}
          data-ready={total > 0 ? '' : undefined}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <div className="deck-bottombar">
        <button type="button" className="btn-outline" aria-label="Previous slide" disabled={current === 0} onClick={() => step(-1)}>
          Previous
        </button>
        <button
          type="button"
          className="btn-primary"
          aria-label="Next slide"
          disabled={current >= total - 1}
          onClick={() => step(1)}
        >
          Next
        </button>
        <div className="deck-progress" aria-hidden="true">
          <div style={{ width: total > 0 ? `${((current + 1) / total) * 100}%` : '0%' }} />
        </div>
        <span className="deck-hint">Arrow keys to move, F for full screen</span>
        <button type="button" className="btn-outline" onClick={toggleFullscreen}>
          Full screen
        </button>
      </div>
    </div>
  );
};

export default DeckContent;
