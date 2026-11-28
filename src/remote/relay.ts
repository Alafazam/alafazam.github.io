import { RELAY_PING, RELAY_PONG, type Role } from './protocol';

// The WebSocket edge: the only module that talks to the deck relay Worker (relay/).
// Both the deck and the phone use it. It reconnects on its own until closed, because
// phones drop sockets whenever the screen locks or the network changes.

// Wait before reconnecting after a socket closes.
const RECONNECT_DELAY_MS = 2000;
// Keepalive: the Worker answers PING with PONG. A socket with no PONG for PONG_TIMEOUT_MS
// is treated as dead (mobile networks can drop a connection without closing it).
const PING_INTERVAL_MS = 15_000;
const PONG_TIMEOUT_MS = 40_000;

export type RelayStatus = 'connecting' | 'open' | 'closed';

interface RelayOptions {
  sessionId: string;
  role: Role;
  onMessage: (data: unknown) => void;
  /** `detail` explains a close: the close code and reason, for showing on screen. */
  onStatus: (status: RelayStatus, detail?: string) => void;
}

export interface RelayConnection {
  /** Sends a message; returns false when the socket is not open (the message is dropped). */
  send: (message: object) => boolean;
  /** Closes for good. Safe to call more than once. */
  close: () => void;
}

/** The relay's base URL, set at build time. Throws when it is missing so the failure is obvious. */
export const relayBaseUrl = (): string => {
  const url = import.meta.env.VITE_RELAY_URL;
  if (!url) throw new Error('The deck remote is not configured: VITE_RELAY_URL is not set (see docs/deck-remote.md).');
  return url.replace(/\/+$/, '');
};

const socketUrl = (base: string, sessionId: string, role: Role): string =>
  `${base.replace(/^http/, 'ws')}/session/${sessionId}?role=${role}`;

export const connectRelay = ({ sessionId, role, onMessage, onStatus }: RelayOptions): RelayConnection => {
  const url = socketUrl(relayBaseUrl(), sessionId, role);
  let socket: WebSocket | null = null;
  let closedForGood = false;
  let reconnectTimer: number | undefined;
  let pingTimer: number | undefined;
  let lastPong = 0;

  const detach = () => {
    window.clearInterval(pingTimer);
    if (!socket) return;
    socket.onopen = socket.onmessage = socket.onclose = socket.onerror = null;
    socket.close();
    socket = null;
  };

  const scheduleReconnect = (detail: string) => {
    detach();
    if (closedForGood) return;
    onStatus('closed', detail);
    window.clearTimeout(reconnectTimer);
    reconnectTimer = window.setTimeout(open, RECONNECT_DELAY_MS);
  };

  function open() {
    if (closedForGood) return;
    detach();
    onStatus('connecting');
    console.info('[deck-remote] connecting to relay', role);
    const ws = new WebSocket(url);
    socket = ws;

    ws.onopen = () => {
      lastPong = Date.now();
      onStatus('open');
      console.info('[deck-remote] relay open', role);
      pingTimer = window.setInterval(() => {
        if (Date.now() - lastPong > PONG_TIMEOUT_MS) {
          console.warn('[deck-remote] relay stopped answering, reconnecting');
          scheduleReconnect('no answer from the relay');
          return;
        }
        ws.send(RELAY_PING);
      }, PING_INTERVAL_MS);
    };
    ws.onmessage = (event) => {
      if (event.data === RELAY_PONG) {
        lastPong = Date.now();
        return;
      }
      try {
        onMessage(JSON.parse(String(event.data)));
      } catch (e) {
        console.warn('[deck-remote] ignored a message that is not JSON', e);
      }
    };
    ws.onclose = (event) => {
      console.warn('[deck-remote] relay closed', event.code, event.reason);
      scheduleReconnect(`relay closed (${event.code}${event.reason ? `: ${event.reason}` : ''})`);
    };
    // An error is always followed by a close event, which does the reconnecting.
    ws.onerror = () => console.error('[deck-remote] relay socket error');
  }

  // A phone coming back from a locked screen should reconnect straight away.
  const onVisible = () => {
    if (document.visibilityState === 'visible' && socket?.readyState !== WebSocket.OPEN) open();
  };
  document.addEventListener('visibilitychange', onVisible);

  open();

  return {
    send: (message) => {
      if (socket?.readyState !== WebSocket.OPEN) return false;
      socket.send(JSON.stringify(message));
      return true;
    },
    close: () => {
      if (closedForGood) return;
      closedForGood = true;
      window.clearTimeout(reconnectTimer);
      document.removeEventListener('visibilitychange', onVisible);
      detach();
      console.info('[deck-remote] relay closed for good', role);
    },
  };
};
