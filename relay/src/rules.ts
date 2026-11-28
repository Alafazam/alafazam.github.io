// Pure rules for the deck relay: which requests to accept and where messages go.
// No Cloudflare APIs here, so the site's Vitest suite can test them directly.
import { ROLES, isValidSessionId, type Role } from '../../src/remote/protocol';

/** Path shape: /session/<session ID>?role=deck|phone */
const SESSION_PATH = /^\/session\/([^/]+)$/;

export type ConnectRequest =
  | { ok: true; sessionId: string; role: Role }
  | { ok: false; status: number; reason: string };

/** Parses the allowed-origins setting: comma-separated, whitespace ignored. */
export const parseAllowedOrigins = (setting: string): string[] =>
  setting
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Validates a WebSocket connect request. The browser always sends Origin on WebSocket requests. */
export const parseConnectRequest = (
  url: URL,
  headers: { upgrade: string | null; origin: string | null },
  allowedOrigins: string[]
): ConnectRequest => {
  const match = SESSION_PATH.exec(url.pathname);
  if (!match) return { ok: false, status: 404, reason: 'Not found' };
  if (headers.upgrade?.toLowerCase() !== 'websocket') return { ok: false, status: 426, reason: 'Expected a WebSocket upgrade' };
  if (!headers.origin || !allowedOrigins.includes(headers.origin)) return { ok: false, status: 403, reason: 'Origin not allowed' };

  const sessionId = match[1];
  if (!isValidSessionId(sessionId)) return { ok: false, status: 400, reason: 'Invalid session ID' };
  const role = url.searchParams.get('role');
  if (!ROLES.includes(role as Role)) return { ok: false, status: 400, reason: 'Role must be deck or phone' };
  return { ok: true, sessionId, role: role as Role };
};

/** Messages go to the other side only: deck → phones, phone → decks. */
export const forwardTargetRole = (sender: Role): Role => (sender === 'deck' ? 'phone' : 'deck');

/** How many decks and phones are in a session, given each open socket's role. */
export const countRoles = (roles: Role[]): Record<Role, number> => ({
  deck: roles.filter((r) => r === 'deck').length,
  phone: roles.filter((r) => r === 'phone').length,
});
