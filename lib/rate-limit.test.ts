import { describe, expect, it } from 'vitest';

import { createRateLimiter } from '~/lib/rate-limit';

describe('createRateLimiter', () => {
  it('allows exactly the limit within the window, then blocks', () => {
    const limiter = createRateLimiter(3, 1_000, () => 0);
    expect(limiter.check('ip-a')).toBe(true);
    expect(limiter.check('ip-a')).toBe(true);
    expect(limiter.check('ip-a')).toBe(true);
    expect(limiter.check('ip-a')).toBe(false);
    expect(limiter.check('ip-a')).toBe(false);
  });

  it('independent keys get independent budgets', () => {
    const limiter = createRateLimiter(1, 1_000, () => 0);
    expect(limiter.check('ip-a')).toBe(true);
    expect(limiter.check('ip-a')).toBe(false);
    expect(limiter.check('ip-b')).toBe(true);
  });

  it('window expiry resets the budget', () => {
    let now = 0;
    const limiter = createRateLimiter(1, 1_000, () => now);
    expect(limiter.check('ip-a')).toBe(true);
    expect(limiter.check('ip-a')).toBe(false);
    now = 999; // still inside the original window
    expect(limiter.check('ip-a')).toBe(false);
    now = 1000; // new window
    expect(limiter.check('ip-a')).toBe(true);
  });

  it('bounded memory guard survives a key flood', () => {
    const limiter = createRateLimiter(1, 1_000);
    for (let i = 0; i < 11_000; i += 1) limiter.check(`ip-${i}`);
    expect(limiter.check('ip-final')).toBe(true);
  });
});
