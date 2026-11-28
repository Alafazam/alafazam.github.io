import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import Seo from '../components/Seo';
import { staticRoute } from '../seo/routes';
import { connectRelay, type RelayConnection } from '../remote/relay';
import {
  PROTOCOL_VERSION,
  parseDeckState,
  parsePresence,
  sessionIdFromHash,
  swipeDirection,
  type DeckState,
  type SwipeDirection,
} from '../remote/protocol';

// Horizontal finger travel, in pixels, that counts as a swipe on the phone.
const SWIPE_THRESHOLD_PX = 40;
// Short buzz confirming a swipe was sent (Android; ignored where unsupported).
const HAPTIC_PULSE_MS = 15;

type Status = 'no-session' | 'connecting' | 'waiting-for-deck' | 'connected' | 'disconnected';

const STATUS_TEXT: Record<Status, string> = {
  'no-session': 'Open this page by scanning the QR code on the deck (the phone button next to Full screen).',
  connecting: 'Connecting…',
  'waiting-for-deck': 'Waiting for the deck. Is it still open on the laptop?',
  connected: 'Connected',
  disconnected: 'Connection lost. Retrying…',
};

// Keeps the phone screen awake while presenting. Not supported everywhere; failure is harmless.
const useWakeLock = (active: boolean) => {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const acquire = () => {
      if (document.visibilityState !== 'visible') return;
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          lock = l;
        })
        .catch((e: unknown) => console.warn('[deck-remote] screen wake lock refused', e));
    };
    acquire();
    document.addEventListener('visibilitychange', acquire);
    return () => {
      document.removeEventListener('visibilitychange', acquire);
      lock?.release().catch(() => undefined);
    };
  }, [active]);
};

// The phone side of the deck remote: swipe left for the next slide, right for the previous.
const DeckRemote = () => {
  const [status, setStatus] = useState<Status>('connecting');
  const [deck, setDeck] = useState<DeckState | null>(null);
  // Last connection problem, shown on screen: a phone has no console to read during a talk.
  const [lastError, setLastError] = useState<string | null>(null);
  const relayRef = useRef<RelayConnection | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useWakeLock(status === 'connected');

  useEffect(() => {
    const sessionId = sessionIdFromHash(window.location.hash);
    if (!sessionId) {
      setStatus('no-session');
      return;
    }

    const onMessage = (data: unknown) => {
      try {
        const presence = parsePresence(data);
        if (presence) {
          setStatus(presence.decks > 0 ? 'connected' : 'waiting-for-deck');
          return;
        }
        setDeck(parseDeckState(data));
      } catch (e) {
        console.warn('[deck-remote] ignored message from deck', e);
      }
    };

    try {
      relayRef.current = connectRelay({
        sessionId,
        role: 'phone',
        onMessage,
        onStatus: (relayStatus, detail) => {
          if (relayStatus === 'open') setLastError(null);
          if (relayStatus === 'closed') {
            setStatus('disconnected');
            setLastError(detail ?? null);
          }
        },
      });
    } catch (e) {
      console.error('[deck-remote] could not start the remote', e);
      setLastError(e instanceof Error ? e.message : String(e));
      setStatus('disconnected');
    }

    return () => {
      relayRef.current?.close();
      relayRef.current = null;
    };
  }, []);

  const send = useCallback((direction: SwipeDirection) => {
    const sent = relayRef.current?.send({ v: PROTOCOL_VERSION, type: direction }) ?? false;
    if (!sent) {
      console.warn('[deck-remote] not connected; dropped', direction);
      return;
    }
    navigator.vibrate?.(HAPTIC_PULSE_MS);
  }, []);

  const onTouchStart = (e: ReactTouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const direction = swipeDirection(touch.clientX - start.x, touch.clientY - start.y, SWIPE_THRESHOLD_PX);
    if (direction) send(direction);
  };

  const connected = status === 'connected';

  return (
    <main className="deck-remote">
      <Seo {...staticRoute('/remote')} />
      <header className="deck-remote-head">
        <span className="deck-remote-dot" data-status={status} aria-hidden="true" />
        <span aria-live="polite">{STATUS_TEXT[status]}</span>
        {deck && <span className="deck-remote-count">{`${deck.current + 1} / ${deck.total}`}</span>}
      </header>
      {lastError && status !== 'connected' && <p className="deck-remote-error">{lastError}</p>}

      <section
        className="deck-remote-pad"
        aria-label="Swipe left for the next slide, right for the previous one"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {deck ? (
          <>
            <p className="deck-remote-deck">{deck.deckTitle}</p>
            <h1 className="deck-remote-title">{deck.slideTitle || `Slide ${deck.current + 1}`}</h1>
            {deck.notes && <p className="deck-remote-notes">{deck.notes}</p>}
          </>
        ) : (
          <h1 className="deck-remote-title">Deck remote</h1>
        )}
        <p className="deck-remote-hint">Swipe left for next · right for previous</p>
      </section>

      <footer className="deck-remote-buttons">
        <button type="button" className="btn-outline" disabled={!connected || deck?.current === 0} onClick={() => send('prev')}>
          Previous
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!connected || (deck !== null && deck.current >= deck.total - 1)}
          onClick={() => send('next')}
        >
          Next
        </button>
      </footer>
    </main>
  );
};

export default DeckRemote;
