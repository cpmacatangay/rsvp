import { describe, expect, it } from 'vitest';

import { compareAdminPassword, createSessionToken, verifySessionToken } from '~/lib/session';

const SECRET = 'test-secret-for-verification-only';
const now = () => 1_700_000_000_000;

describe('session tokens', () => {
  it('round-trips inside the ttl', () => {
    const token = createSessionToken(now() + 1000, SECRET);
    expect(verifySessionToken(token, SECRET, now)).toBe(true);
  });

  it('rejects expired tokens', () => {
    const token = createSessionToken(now() + 1000, SECRET);
    const later = () => now() + 2000;
    expect(verifySessionToken(token, SECRET, later)).toBe(false);
  });

  it('rejects tampered payloads and foreign secrets', () => {
    const token = createSessionToken(now() + 1000, SECRET);
    const payload = token.slice(0, token.indexOf('.'));
    const tampered = `${Number(payload) + 1}.${token.slice(token.indexOf('.') + 1)}`;
    expect(verifySessionToken(tampered, SECRET, now)).toBe(false);
    expect(verifySessionToken(token, 'other-secret', now)).toBe(false);
    expect(verifySessionToken(undefined, SECRET, now)).toBe(false);
    expect(verifySessionToken('garbage', SECRET, now)).toBe(false);
  });
});

describe('compareAdminPassword', () => {
  it('matches exactly and rejects partials + case swaps + length tricks', () => {
    expect(compareAdminPassword('Peña-Sage-9-Wedding', 'Peña-Sage-9-Wedding')).toBe(true);
    expect(compareAdminPassword('peña-sage-9-wedding', 'Peña-Sage-9-Wedding')).toBe(false);
    expect(compareAdminPassword('Peña-Sage-9-Weddin', 'Peña-Sage-9-Wedding')).toBe(false);
    expect(compareAdminPassword('', 'Peña-Sage-9-Wedding')).toBe(false);
    expect(compareAdminPassword('', '')).toBe(false);
  });
});
