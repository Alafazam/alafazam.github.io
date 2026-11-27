import type { Peer, PeerOptions } from 'peerjs';

// The PeerJS edge: the only module that creates WebRTC peers. PeerJS is loaded on demand,
// so the deck and the rest of the site don't ship it until the remote is started.
//
// By default PeerJS signals through its free public server (0.peerjs.com). Only the
// handshake goes through it; slide commands travel peer to peer. To use your own
// PeerServer, set these at build time (see docs/deck-remote.md):
//   VITE_PEER_HOST, VITE_PEER_PORT, VITE_PEER_PATH, VITE_PEER_SECURE ("true" / "false")

const signalingOptions = (): PeerOptions => {
  const env = import.meta.env;
  const host = env.VITE_PEER_HOST;
  if (!host) return {};

  const port = Number(env.VITE_PEER_PORT);
  if (!Number.isInteger(port) || port <= 0) throw new Error(`VITE_PEER_PORT must be a port number, got "${env.VITE_PEER_PORT}"`);
  return {
    host,
    port,
    path: env.VITE_PEER_PATH ?? '/',
    secure: env.VITE_PEER_SECURE === 'true',
  };
};

/** Creates a peer. Pass an ID for the deck (so the phone can find it); omit it on the phone. */
export const createPeer = async (id?: string): Promise<Peer> => {
  const { Peer: PeerClass } = await import('peerjs');
  const options = signalingOptions();
  console.info('[deck-remote] creating peer', { id: id ?? '(random)', host: options.host ?? 'PeerJS cloud' });
  return id ? new PeerClass(id, options) : new PeerClass(options);
};
