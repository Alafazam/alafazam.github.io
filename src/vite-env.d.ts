/// <reference types="vite/client" />

// Optional self-hosted PeerServer for the phone remote (src/remote/peer.ts).
interface ImportMetaEnv {
  readonly VITE_PEER_HOST?: string;
  readonly VITE_PEER_PORT?: string;
  readonly VITE_PEER_PATH?: string;
  readonly VITE_PEER_SECURE?: string;
}
