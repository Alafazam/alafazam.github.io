import type { DataConnection, Peer } from 'peerjs';
import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import Seo from '../components/Seo';
import { staticRoute } from '../seo/routes';
import { createPeer } from '../remote/peer';
import {
  PROTOCOL_VERSION,
  parseDeckState,
  peerIdForSession,
  sessionIdFromHash,
  swipeDirection,
  type DeckState,
  type SwipeDirection,
} from '../remote/protocol';

// Horizontal finger travel, in pixels, that counts as a swipe on the phone.
const SWIPE_THRESHOLD_PX = 40;
// Short buzz confirming a swipe was sent (Android; ignored where unsupported).
const HAPTIC_PULSE_MS = 15;
// Wait before trying to reach the deck again after the connection drops.
const RECONNECT_DELAY_MS = 2000;

type Status = 'no-session' | 'connecting' | 'connected' | 'disconnected';

const STATUS_TEXT: Record<Status, string> = {
  'no-session': 'Open this page by scanning the QR code on the deck (the phone button next to Full screen).',
  connecting: 'Connecting to the deck…',
  connected: 'Connected',
  disconnected: 'Lost the deck. Retrying…',
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
  const connectionRef = useRef<DataConnection | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useWakeLock(status === 'connected');

  useEffect(() => {
    const sessionId = sessionIdFromHash(window.location.hash);
    if (!sessionId) {
      setStatus('no-session');
      return;
    }
    const deckPeerId = peerIdForSession(sessionId);
    let peer: Peer | null = null;
    let retryTimer: number | undefined;
    let closed = false;

    const scheduleRetry = () => {
      if (closed) return;
      setStatus('disconnected');
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
    };

    // Phones drop the signalling socket when the screen locks; reconnect when needed.
    function connect() {
      if (closed || !peer) return;
      if (peer.disconnected) peer.reconnect();
      const connection = peer.connect(deckPeerId, { reliable: true });
      connectionRef.current = connection;
      connection.on('open', () => {
        setStatus('connected');
        console.info('[deck-remote] connected to deck');
      });
      connection.on('data', (data) => {
        try {
          setDeck(parseDeckState(data));
        } catch (e) {
          console.warn('[deck-remote] ignored message from deck', e);
        }
      });
      connection.on('close', () => {
        if (connectionRef.current !== connection) return;
        connectionRef.current = null;
        console.info('[deck-remote] deck connection closed');
        scheduleRetry();
      });
      connection.on('error', (e) => console.error('[deck-remote] connection error', e));
    }

    createPeer()
      .then((p) => {
        if (closed) {
          p.destroy();
          return;
        }
        peer = p;
        p.on('open', connect);
        p.on('error', (e) => {
          console.error('[deck-remote] remote error', e.type, e);
          scheduleRetry();
        });
      })
      .catch((e: unknown) => {
        console.error('[deck-remote] could not start the remote', e);
        setStatus('disconnected');
      });

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !connectionRef.current?.open) scheduleRetry();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      closed = true;
      window.clearTimeout(retryTimer);
      document.removeEventListener('visibilitychange', onVisible);
      connectionRef.current = null;
      peer?.destroy();
    };
  }, []);

  const send = useCallback((direction: SwipeDirection) => {
    const connection = connectionRef.current;
    if (!connection?.open) {
      console.warn('[deck-remote] not connected; dropped', direction);
      return;
    }
    connection.send({ v: PROTOCOL_VERSION, type: direction });
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
