import { describe, expect, it } from 'vitest';
import { countRoles, forwardTargetRole, parseAllowedOrigins, parseConnectRequest } from './rules';

const ORIGIN = 'https://alafazam.com';
const ALLOWED = [ORIGIN];
const SESSION = 'abcdefghij012345';
const ws = { upgrade: 'websocket', origin: ORIGIN };
const req = (path: string) => new URL(`https://relay.example${path}`);

describe('parseConnectRequest', () => {
  it('accepts a deck or phone joining a valid session', () => {
    expect(parseConnectRequest(req(`/session/${SESSION}?role=deck`), ws, ALLOWED)).toEqual({ ok: true, sessionId: SESSION, role: 'deck' });
    expect(parseConnectRequest(req(`/session/${SESSION}?role=phone`), { ...ws, upgrade: 'WebSocket' }, ALLOWED)).toMatchObject({ ok: true, role: 'phone' });
  });

  it.each([
    ['/', ws, 404],
    [`/session/${SESSION}/x?role=deck`, ws, 404],
    [`/session/${SESSION}?role=deck`, { ...ws, upgrade: null }, 426],
    [`/session/${SESSION}?role=deck`, { ...ws, origin: null }, 403],
    [`/session/${SESSION}?role=deck`, { ...ws, origin: 'https://evil.example' }, 403],
    ['/session/short?role=deck', ws, 400],
    [`/session/${SESSION}?role=admin`, ws, 400],
    [`/session/${SESSION}`, ws, 400],
  ])('refuses %s', (path, headers, status) => {
    expect(parseConnectRequest(req(path), headers, ALLOWED)).toMatchObject({ ok: false, status });
  });
});

describe('routing and counts', () => {
  it('forwards to the other side only', () => {
    expect(forwardTargetRole('deck')).toBe('phone');
    expect(forwardTargetRole('phone')).toBe('deck');
  });

  it('counts roles', () => {
    expect(countRoles(['deck', 'phone', 'phone'])).toEqual({ deck: 1, phone: 2 });
    expect(countRoles([])).toEqual({ deck: 0, phone: 0 });
  });

  it('parses the allowed-origins setting', () => {
    expect(parseAllowedOrigins(' https://a.com , https://b.com,, ')).toEqual(['https://a.com', 'https://b.com']);
  });
});
