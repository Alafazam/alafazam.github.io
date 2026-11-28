// Deck relay: passes messages between a slide deck (laptop) and its phone remote.
// One Durable Object per session ID; both sides connect over WebSocket. Nothing is stored.
// Rules (validation, routing) live in ./rules.ts; this file is the Cloudflare edge.
import { DurableObject } from 'cloudflare:workers';
import { PROTOCOL_VERSION, RELAY_PING, RELAY_PONG, type Role } from '../../src/remote/protocol';
import { countRoles, forwardTargetRole, parseAllowedOrigins, parseConnectRequest } from './rules';

// Decks + phones allowed in one session (one laptop, a phone, and spare reconnects).
const MAX_SOCKETS_PER_SESSION = 6;
// Largest message passed on, in characters. Deck state with long speaker notes fits easily.
const MAX_MESSAGE_CHARS = 16_384;

interface Env {
  DECK_SESSION: DurableObjectNamespace<DeckSession>;
  /** Comma-separated origins allowed to connect, e.g. "https://alafazam.com". */
  ALLOWED_ORIGINS: string;
}

export class DeckSession extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // Cloudflare answers keepalives itself, without waking the object.
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair(RELAY_PING, RELAY_PONG));
  }

  async fetch(request: Request): Promise<Response> {
    const role = new URL(request.url).searchParams.get('role') as Role;
    if (this.ctx.getWebSockets().length >= MAX_SOCKETS_PER_SESSION) {
      console.warn('session full, refusing', role);
      return new Response('Session full', { status: 429 });
    }
    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server, [role]);
    console.info('joined', role);
    this.broadcastPresence();
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): void {
    if (typeof message !== 'string' || message.length > MAX_MESSAGE_CHARS) {
      console.warn('dropped a binary or oversized message');
      return;
    }
    const sender = this.roleOf(ws);
    for (const target of this.ctx.getWebSockets(forwardTargetRole(sender))) this.trySend(target, message);
  }

  webSocketClose(ws: WebSocket, code: number, reason: string): void {
    console.info('left', this.roleOf(ws), code, reason);
    this.broadcastPresence(ws);
  }

  webSocketError(ws: WebSocket, error: unknown): void {
    console.error('socket error', this.roleOf(ws), error);
    this.broadcastPresence(ws);
  }

  private roleOf(ws: WebSocket): Role {
    const [role] = this.ctx.getTags(ws);
    if (role !== 'deck' && role !== 'phone') throw new Error(`Socket has no role tag: ${role}`);
    return role;
  }

  /** Tells everyone how many decks and phones are connected. `leaving` is excluded from the count. */
  private broadcastPresence(leaving?: WebSocket): void {
    const sockets = this.ctx.getWebSockets().filter((s) => s !== leaving);
    const counts = countRoles(sockets.map((s) => this.roleOf(s)));
    const message = JSON.stringify({ v: PROTOCOL_VERSION, type: 'presence', decks: counts.deck, phones: counts.phone });
    for (const socket of sockets) this.trySend(socket, message);
  }

  private trySend(ws: WebSocket, message: string): void {
    try {
      ws.send(message);
    } catch (e) {
      console.warn('send failed; the socket is closing', e);
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const result = parseConnectRequest(
      url,
      { upgrade: request.headers.get('Upgrade'), origin: request.headers.get('Origin') },
      parseAllowedOrigins(env.ALLOWED_ORIGINS)
    );
    if (!result.ok) {
      console.warn('refused', result.status, result.reason, request.headers.get('Origin'));
      return new Response(result.reason, { status: result.status });
    }
    const stub = env.DECK_SESSION.get(env.DECK_SESSION.idFromName(result.sessionId));
    return stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;
