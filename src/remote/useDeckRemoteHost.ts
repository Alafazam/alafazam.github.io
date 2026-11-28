import { useCallback, useEffect, useRef, useState } from 'react';
import { routerBasename } from '../routerBasename';
import { connectRelay, type RelayConnection } from './relay';
import {
  PROTOCOL_VERSION,
  buildPairingUrl,
  createSessionId,
  parsePresence,
  parseRemoteCommand,
  type DeckState,
  type RemoteCommand,
} from './protocol';

/** Path of the phone page, relative to the router base. Must match the route in src/App.tsx. */
export const REMOTE_PATH = '/remote';

export type HostStatus = 'off' | 'starting' | 'waiting' | 'connected' | 'error';

export type DeckSnapshot = Omit<DeckState, 'v' | 'type'>;

interface DeckRemoteHost {
  status: HostStatus;
  pairingUrl: string | null;
  error: string | null;
  start: () => void;
  stop: () => void;
}

const remotePageUrl = (): string => {
  const base = routerBasename === '/' ? '' : routerBasename;
  return `${window.location.origin}${base}${REMOTE_PATH}`;
};

const randomBytes = (length: number) => crypto.getRandomValues(new Uint8Array(length));

/**
 * The deck's side of the phone remote. `start` joins the relay under a fresh random
 * session ID and returns a pairing URL for the QR code. Phones receive `snapshot` when
 * they join and whenever it changes; their commands are passed to `onCommand`.
 * Calling `start` while running is a no-op.
 */
export const useDeckRemoteHost = (
  snapshot: DeckSnapshot | null,
  onCommand: (command: RemoteCommand) => void
): DeckRemoteHost => {
  const [status, setStatus] = useState<HostStatus>('off');
  const [pairingUrl, setPairingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const relayRef = useRef<RelayConnection | null>(null);
  const snapshotRef = useRef(snapshot);
  const onCommandRef = useRef(onCommand);
  snapshotRef.current = snapshot;
  onCommandRef.current = onCommand;

  const sendSnapshot = useCallback(() => {
    const current = snapshotRef.current;
    if (!current || !relayRef.current) return;
    const message: DeckState = { v: PROTOCOL_VERSION, type: 'state', ...current };
    relayRef.current.send(message);
  }, []);

  const stop = useCallback(() => {
    if (!relayRef.current) return;
    relayRef.current.close();
    relayRef.current = null;
    setStatus('off');
    setPairingUrl(null);
    console.info('[deck-remote] host stopped');
  }, []);

  const start = useCallback(() => {
    if (relayRef.current) return;
    const sessionId = createSessionId(randomBytes);
    setStatus('starting');
    setError(null);

    const onMessage = (data: unknown) => {
      try {
        const presence = parsePresence(data);
        if (presence) {
          setStatus(presence.phones > 0 ? 'connected' : 'waiting');
          // A phone that just joined needs to know where the deck is.
          if (presence.phones > 0) sendSnapshot();
          return;
        }
        onCommandRef.current(parseRemoteCommand(data));
      } catch (e) {
        console.warn('[deck-remote] ignored message from phone', e);
      }
    };

    try {
      relayRef.current = connectRelay({
        sessionId,
        role: 'deck',
        onMessage,
        onStatus: (relayStatus, detail) => {
          if (relayStatus === 'open') {
            setError(null);
            setPairingUrl(buildPairingUrl(remotePageUrl(), sessionId));
            setStatus((s) => (s === 'connected' ? s : 'waiting'));
          } else if (relayStatus === 'closed') {
            // The relay connection reconnects on its own; show why it dropped meanwhile.
            setError(detail ?? 'Lost the relay');
            setStatus('error');
          }
        },
      });
    } catch (e) {
      console.error('[deck-remote] could not start the host', e);
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }, [sendSnapshot]);

  // Keep connected phones in step with the deck.
  useEffect(() => {
    sendSnapshot();
  }, [snapshot, sendSnapshot]);

  useEffect(() => stop, [stop]);

  return { status, pairingUrl, error, start, stop };
};
