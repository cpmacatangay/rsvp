import { beforeAll, afterAll, describe, expect, it } from 'vitest';

import { deadlineDateToMs, deadlineState } from '~/lib/deadline';

const PH_END = '2027-03-14'; // arbitrary test date

describe('deadlineDateToMs', () => {
  it('is end-of-day 23:59:59.999 +08:00 (UTC 15:59:59.999)', () => {
    expect(deadlineDateToMs('2027-03-14')).toBe(Date.UTC(2027, 2, 14, 15, 59, 59, 999));
  });

  it('rejects malformed dates (NaN, never throws)', () => {
    expect(Number.isNaN(deadlineDateToMs('2027-13-01'))).toBe(true);
    expect(Number.isNaN(deadlineDateToMs('junk'))).toBe(true);
  });

  it('pins the Asia/Manila boundary regardless of the host timezone', () => {
    // same instant, checked as the Philippines' clock reading
    const ph = new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(deadlineDateToMs(PH_END)));
    expect(ph.startsWith('11:59:59 PM') || ph.startsWith('23:59:59')).toBe(true);
  });
});

describe('deadlineState', () => {
  const cutoff = deadlineDateToMs('2027-06-01');

  beforeAll(() => {
    process.env.RSVP_DEADLINE_DATE = '2027-06-01';
  });

  afterAll(() => {
    delete process.env.RSVP_DEADLINE_DATE;
  });

  it('is open strictly before the Asia/Manila midnight edge', () => {
    const before = deadlineState(() => cutoff - 1);
    expect(before.state).toBe('open');
  });

  it('flips to closed one millisecond past the edge', () => {
    const after = deadlineState(() => cutoff + 1);
    expect(after.state).toBe('closed');
  });

  it('reports pending-config when RSVP_DEADLINE_DATE is unset (explicit TBD)', () => {
    const restore = process.env.RSVP_DEADLINE_DATE;
    delete process.env.RSVP_DEADLINE_DATE;
    try {
      expect(deadlineState().state).toBe('pending-config');
    } finally {
      if (restore !== undefined) process.env.RSVP_DEADLINE_DATE = restore;
    }
  });
});
