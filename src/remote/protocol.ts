// Messages between a slide deck (the laptop) and the phone remote, plus the pure helpers
// both sides and the relay Worker (relay/) share. No I/O here: the WebSocket connection
// lives in src/remote/relay.ts.

/** Bump when a message shape changes; both sides reject messages from another version. */
export const PROTOCOL_VERSION = 1;

/** Characters of a session ID: lower-case letters and digits, safe in a URL hash and a URL path. */
export const SESSION_ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
export const SESSION_ID_LENGTH = 16;

const SESSION_ID_PATTERN = new RegExp(`^[${SESSION_ID_ALPHABET}]{${SESSION_ID_LENGTH}}$`);

/** Phone → deck. */
export type RemoteCommand =
  | { v: typeof PROTOCOL_VERSION; type: 'next' }
  | { v: typeof PROTOCOL_VERSION; type: 'prev' }
  | { v: typeof PROTOCOL_VERSION; type: 'goto'; index: number };

/** Deck → phone, sent on connect and after every slide change. */
export interface DeckState {
  v: typeof PROTOCOL_VERSION;
  type: 'state';
  deckTitle: string;
  current: number;
  total: number;
  slideTitle: string;
  notes: string;
}

/** Keepalive frames: clients send PING, the relay answers PONG. Plain strings, not JSON. */
export const RELAY_PING = 'ping';
export const RELAY_PONG = 'pong';

/** Who is on each end of a session: the laptop showing the deck, or the phone driving it. */
export const ROLES = ['deck', 'phone'] as const;
export type Role = (typeof ROLES)[number];

/** Relay → everyone in a session, whenever someone joins or leaves. */
export interface Presence {
  v: typeof PROTOCOL_VERSION;
  type: 'presence';
  decks: number;
  phones: number;
}

export type SwipeDirection = 'next' | 'prev';

/** Builds a session ID from random bytes. `randomBytes` is injected so tests can fix it. */
export const createSessionId = (randomBytes: (length: number) => Uint8Array): string => {
  const bytes = randomBytes(SESSION_ID_LENGTH);
  if (bytes.length !== SESSION_ID_LENGTH) {
    throw new Error(`Expected ${SESSION_ID_LENGTH} random bytes, got ${bytes.length}`);
  }
  return Array.from(bytes, (b) => SESSION_ID_ALPHABET[b % SESSION_ID_ALPHABET.length]).join('');
};

export const isValidSessionId = (value: string): boolean => SESSION_ID_PATTERN.test(value);

/** The phone page URL the deck puts in its QR code. `remoteUrl` is the absolute URL of /remote. */
export const buildPairingUrl = (remoteUrl: string, sessionId: string): string => {
  if (!isValidSessionId(sessionId)) throw new Error(`Invalid remote session ID: "${sessionId}"`);
  return `${remoteUrl}#${sessionId}`;
};

/** Reads the session ID from the phone page's URL hash; null when it is missing or malformed. */
export const sessionIdFromHash = (hash: string): string | null => {
  const value = hash.replace(/^#/, '').trim().toLowerCase();
  return isValidSessionId(value) ? value : null;
};

/**
 * A finger moving left (negative dx) pulls the next slide in, like turning a page.
 * Returns null for movements shorter than the threshold or mostly vertical ones.
 */
export const swipeDirection = (dx: number, dy: number, thresholdPx: number): SwipeDirection | null => {
  if (Math.abs(dx) < thresholdPx || Math.abs(dx) <= Math.abs(dy)) return null;
  return dx < 0 ? 'next' : 'prev';
};

/** The slide index a command moves to, clamped to the deck. */
export const applyCommand = (command: RemoteCommand, current: number, total: number): number => {
  if (total < 1) throw new Error('Cannot apply a remote command to an empty deck');
  const last = total - 1;
  const clamp = (n: number) => Math.min(Math.max(n, 0), last);
  switch (command.type) {
    case 'next':
      return clamp(current + 1);
    case 'prev':
      return clamp(current - 1);
    case 'goto':
      return clamp(command.index);
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIndex = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0;

/** Reads the relay's presence message; null for any other message (they are handled elsewhere). */
export const parsePresence = (data: unknown): Presence | null => {
  if (!isRecord(data) || data.type !== 'presence') return null;
  if (data.v !== PROTOCOL_VERSION || !isIndex(data.decks) || !isIndex(data.phones)) {
    throw new Error(`Unrecognised presence message: ${JSON.stringify(data)}`);
  }
  return { v: PROTOCOL_VERSION, type: 'presence', decks: data.decks, phones: data.phones };
};

/** Validates a message received from the phone. Throws on anything it does not recognise. */
export const parseRemoteCommand = (data: unknown): RemoteCommand => {
  if (!isRecord(data) || data.v !== PROTOCOL_VERSION) throw new Error(`Unrecognised remote command: ${JSON.stringify(data)}`);
  if (data.type === 'next' || data.type === 'prev') return { v: PROTOCOL_VERSION, type: data.type };
  if (data.type === 'goto' && isIndex(data.index)) return { v: PROTOCOL_VERSION, type: 'goto', index: data.index };
  throw new Error(`Unrecognised remote command: ${JSON.stringify(data)}`);
};

/** Validates a message received from the deck. Throws on anything it does not recognise. */
export const parseDeckState = (data: unknown): DeckState => {
  const valid =
    isRecord(data) &&
    data.v === PROTOCOL_VERSION &&
    data.type === 'state' &&
    typeof data.deckTitle === 'string' &&
    isIndex(data.current) &&
    isIndex(data.total) &&
    data.current < data.total &&
    typeof data.slideTitle === 'string' &&
    typeof data.notes === 'string';
  if (!valid) throw new Error(`Unrecognised deck state: ${JSON.stringify(data)}`);
  return data as unknown as DeckState;
};
