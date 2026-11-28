import { describe, expect, it } from 'vitest';
import {
  PROTOCOL_VERSION,
  SESSION_ID_LENGTH,
  applyCommand,
  buildPairingUrl,
  createSessionId,
  isValidSessionId,
  parseDeckState,
  parseRemoteCommand,
  parsePresence,
  sessionIdFromHash,
  swipeDirection,
} from './protocol';

const fixedBytes = (value: number) => (length: number) => new Uint8Array(length).fill(value);
const SAMPLE_ID = 'abcdefghij012345';
const THRESHOLD = 50;

describe('session IDs', () => {
  it('builds a valid ID of the configured length', () => {
    const id = createSessionId((n) => crypto.getRandomValues(new Uint8Array(n)));
    expect(id).toHaveLength(SESSION_ID_LENGTH);
    expect(isValidSessionId(id)).toBe(true);
  });

  it('maps bytes onto the alphabet deterministically', () => {
    expect(createSessionId(fixedBytes(0))).toBe('a'.repeat(SESSION_ID_LENGTH));
    expect(createSessionId(fixedBytes(36))).toBe('a'.repeat(SESSION_ID_LENGTH));
    expect(createSessionId(fixedBytes(35))).toBe('9'.repeat(SESSION_ID_LENGTH));
  });

  it('fails loudly when the byte source returns the wrong length', () => {
    expect(() => createSessionId(() => new Uint8Array(3))).toThrow(/random bytes/);
  });

  it('rejects malformed IDs', () => {
    expect(isValidSessionId('')).toBe(false);
    expect(isValidSessionId('ABCDEFGHIJ012345')).toBe(false);
    expect(isValidSessionId('abc')).toBe(false);
    expect(isValidSessionId(`${SAMPLE_ID}x`)).toBe(false);
    expect(isValidSessionId('abcdefghij01234-')).toBe(false);
  });

  it('refuses to build a pairing URL for an invalid session', () => {
    expect(() => buildPairingUrl('https://example.com/remote', 'nope')).toThrow(/Invalid remote session ID/);
  });

  it('round-trips through the pairing URL hash', () => {
    const url = buildPairingUrl('https://example.com/remote', SAMPLE_ID);
    expect(url).toBe(`https://example.com/remote#${SAMPLE_ID}`);
    expect(sessionIdFromHash(new URL(url).hash)).toBe(SAMPLE_ID);
  });

  it('reads the hash case-insensitively and rejects junk', () => {
    expect(sessionIdFromHash(`#${SAMPLE_ID.toUpperCase()}`)).toBe(SAMPLE_ID);
    expect(sessionIdFromHash('')).toBeNull();
    expect(sessionIdFromHash('#3')).toBeNull();
  });
});

describe('swipeDirection', () => {
  it('treats a leftward swipe as next and a rightward one as previous', () => {
    expect(swipeDirection(-120, 5, THRESHOLD)).toBe('next');
    expect(swipeDirection(120, -5, THRESHOLD)).toBe('prev');
  });

  it('ignores short or mostly vertical movements', () => {
    expect(swipeDirection(-THRESHOLD + 1, 0, THRESHOLD)).toBeNull();
    expect(swipeDirection(-80, 120, THRESHOLD)).toBeNull();
    expect(swipeDirection(80, 80, THRESHOLD)).toBeNull();
  });
});

describe('applyCommand', () => {
  const TOTAL = 10;

  it('steps and clamps at both ends', () => {
    expect(applyCommand({ v: PROTOCOL_VERSION, type: 'next' }, 3, TOTAL)).toBe(4);
    expect(applyCommand({ v: PROTOCOL_VERSION, type: 'next' }, TOTAL - 1, TOTAL)).toBe(TOTAL - 1);
    expect(applyCommand({ v: PROTOCOL_VERSION, type: 'prev' }, 0, TOTAL)).toBe(0);
  });

  it('jumps with goto and is idempotent', () => {
    const goto = { v: PROTOCOL_VERSION, type: 'goto', index: 7 } as const;
    expect(applyCommand(goto, 2, TOTAL)).toBe(7);
    expect(applyCommand(goto, applyCommand(goto, 2, TOTAL), TOTAL)).toBe(7);
    expect(applyCommand({ ...goto, index: 99 }, 2, TOTAL)).toBe(TOTAL - 1);
  });

  it('fails loudly on an empty deck', () => {
    expect(() => applyCommand({ v: PROTOCOL_VERSION, type: 'next' }, 0, 0)).toThrow(/empty deck/);
  });
});

describe('message parsing', () => {
  it('accepts valid commands', () => {
    expect(parseRemoteCommand({ v: PROTOCOL_VERSION, type: 'next' })).toEqual({ v: PROTOCOL_VERSION, type: 'next' });
    expect(parseRemoteCommand({ v: PROTOCOL_VERSION, type: 'goto', index: 2, extra: 1 })).toEqual({
      v: PROTOCOL_VERSION,
      type: 'goto',
      index: 2,
    });
  });

  it.each([
    null,
    'next',
    { type: 'next' },
    { v: PROTOCOL_VERSION + 1, type: 'next' },
    { v: PROTOCOL_VERSION, type: 'jump' },
    { v: PROTOCOL_VERSION, type: 'goto', index: -1 },
    { v: PROTOCOL_VERSION, type: 'goto', index: 1.5 },
  ])('rejects command %j', (data) => {
    expect(() => parseRemoteCommand(data)).toThrow(/Unrecognised remote command/);
  });

  const state = {
    v: PROTOCOL_VERSION,
    type: 'state',
    deckTitle: 'Deck',
    current: 0,
    total: 3,
    slideTitle: 'Intro',
    notes: '',
  };

  it('accepts a valid deck state', () => {
    expect(parseDeckState(state)).toEqual(state);
  });

  it.each([
    { ...state, v: 0 },
    { ...state, current: 3 },
    { ...state, notes: undefined },
    { ...state, type: 'next' },
  ])('rejects deck state %j', (data) => {
    expect(() => parseDeckState(data)).toThrow(/Unrecognised deck state/);
  });
});

describe('parsePresence', () => {
  it('reads presence and ignores other messages', () => {
    expect(parsePresence({ v: PROTOCOL_VERSION, type: 'presence', decks: 1, phones: 2 })).toEqual({
      v: PROTOCOL_VERSION,
      type: 'presence',
      decks: 1,
      phones: 2,
    });
    expect(parsePresence({ v: PROTOCOL_VERSION, type: 'next' })).toBeNull();
    expect(parsePresence('pong')).toBeNull();
  });

  it('fails loudly on a malformed presence message', () => {
    expect(() => parsePresence({ v: PROTOCOL_VERSION, type: 'presence', decks: -1, phones: 0 })).toThrow(/presence/);
  });
});
