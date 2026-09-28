import { describe, expect, it } from 'vitest';

import { clampCounts } from '~/lib/rsvp';

const caps = { maxAdults: 2, maxKids: 1 };

describe('clampCounts', () => {
  it('declined is always zero guests', () => {
    expect(clampCounts(caps, 'declined', { adults: 5, kids: 5 })).toEqual({
      ok: true,
      counts: { adults: 0, kids: 0 },
    });
  });

  it('accepts valid guest counts', () => {
    expect(clampCounts(caps, 'accepted', { adults: 2, kids: 1 })).toEqual({
      ok: true,
      counts: { adults: 2, kids: 1 },
    });
  });

  it('rejects exceeding the household caps with the true allowance in the message', () => {
    expect(clampCounts(caps, 'accepted', { adults: 3, kids: 1 })).toEqual({
      ok: false,
      reason: 'too_many_guests',
      message: 'Your invitation covers up to 2 adults and 1 child.',
    });
  });

  it('rejects zero guests on accept', () => {
    expect(clampCounts(caps, 'accepted', { adults: 0, kids: 0 })).toEqual({
      ok: false,
      reason: 'too_many_guests',
      message: 'Please add at least one guest before sending.',
    });
  });

  it('truncates nonsensical floats instead of crashing', () => {
    expect(clampCounts(caps, 'accepted', { adults: 1.7, kids: 0 })).toEqual({
      ok: true,
      counts: { adults: 1, kids: 0 },
    });
  });

  it('wording omits the children clause when maxKids is 0', () => {
    expect(
      clampCounts({ maxAdults: 2, maxKids: 0 }, 'accepted', { adults: 9, kids: 0 }),
    ).toMatchObject({
      ok: false,
      message: 'Your invitation covers up to 2 adults.',
    });
  });
});
