import type { DataConnection, Peer } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { routerBasename } from '../routerBasename';
import { createPeer } from './peer';
import {
  PROTOCOL_VERSION,
  buildPairingUrl,
  createSessionId,
  parseRemoteCommand,
  peerIdForSession,
  type DeckState,
  type RemoteCommand,
} from './protocol';

/** Path of the phone page, relative to the router base. Must match the route in src/App.tsx. */
export const REMOTE_PATH = '/remote';

// Wait before rejoining the signalling server after losing it, so an outage isn't a tight loop.
const SIGNALING_RETRY_DELAY_MS = 3000;

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
 * The deck's side of the phone remote. `start` registers this deck with the signalling
 * server under a fresh random session ID and returns a pairing URL for the QR code.
 * Phones that connect receive `snapshot` on connect and whenever it changes, and their
 * commands are passed to `onCommand`. Calling `start` while running is a no-op.
 */
export const useDeckRemoteHost = (
  snapshot: DeckSnapshot | null,
  onCommand: (command: RemoteCommand) => void
): DeckRemoteHost => {
  const [status, setStatus] = useState<HostStatus>('off');
  const [pairingUrl, setPairingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef(new Set<DataConnection>());
  const snapshotRef = useRef(snapshot);
  const onCommandRef = useRef(onCommand);
  snapshotRef.current = snapshot;
  onCommandRef.current = onCommand;

  const sendSnapshot = useCallback((connection: DataConnection) => {
    const current = snapshotRef.current;
    if (!current || !connection.open) return;
    const message: DeckState = { v: PROTOCOL_VERSION, type: 'state', ...current };
    connection.send(message);
  }, []);

  const refreshStatus = useCallback(() => {
    if (!peerRef.current) return;
    setStatus(connectionsRef.current.size > 0 ? 'connected' : 'waiting');
  }, []);

  const stop = useCallback(() => {
    const peer = peerRef.current;
    if (!peer) return;
    peerRef.current = null;
    connectionsRef.current.clear();
    peer.destroy();
    setStatus('off');
    setPairingUrl(null);
    console.info('[deck-remote] host stopped');
  }, []);

  const start = useCallback(() => {
    if (peerRef.current) return;
    const sessionId = createSessionId(randomBytes);
    setStatus('starting');
    setError(null);

    createPeer(peerIdForSession(sessionId))
      .then((peer) => {
        peerRef.current = peer;
        let registered = false;

        peer.on('open', () => {
          registered = true;
          setPairingUrl(buildPairingUrl(remotePageUrl(), sessionId));
          refreshStatus();
          console.info('[deck-remote] host registered, waiting for a phone');
        });

        peer.on('connection', (connection) => {
          connection.on('open', () => {
            connectionsRef.current.add(connection);
            sendSnapshot(connection);
            refreshStatus();
            console.info('[deck-remote] phone connected', connection.peer);
          });
          connection.on('data', (data) => {
            try {
              onCommandRef.current(parseRemoteCommand(data));
            } catch (e) {
              console.warn('[deck-remote] ignored message from phone', e);
            }
          });
          connection.on('close', () => {
            connectionsRef.current.delete(connection);
            refreshStatus();
            console.info('[deck-remote] phone disconnected', connection.peer);
          });
        });

        // Losing the signalling socket does not drop open phone connections; rejoin so
        // a phone that reconnects (after its screen locks, say) can find the deck again.
        peer.on('disconnected', () => {
          if (peerRef.current !== peer || !registered) return;
          console.warn(`[deck-remote] lost the signalling server, rejoining in ${SIGNALING_RETRY_DELAY_MS} ms`);
          window.setTimeout(() => {
            if (peerRef.current === peer && peer.disconnected && !peer.destroyed) peer.reconnect();
          }, SIGNALING_RETRY_DELAY_MS);
        });

        // Before registering, any error means the remote can't start: tear down and let
        // the presenter retry. After it, errors are logged; open phone links keep working.
        peer.on('error', (e) => {
          console.error('[deck-remote] host error', e.type, e);
          if (registered || peerRef.current !== peer) return;
          peerRef.current = null;
          peer.destroy();
          setError(e.message || e.type);
          setStatus('error');
        });
      })
      .catch((e: unknown) => {
        console.error('[deck-remote] could not start the host', e);
        setError(e instanceof Error ? e.message : String(e));
        setStatus('error');
      });
  }, [refreshStatus, sendSnapshot]);

  // Keep every connected phone in step with the deck.
  useEffect(() => {
    connectionsRef.current.forEach(sendSnapshot);
  }, [snapshot, sendSnapshot]);

  useEffect(() => stop, [stop]);

  return { status, pairingUrl, error, start, stop };
};
