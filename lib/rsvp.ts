/**
 * RSVP domain rules — pure functions only (RULES §4.5).
 * Caps come from the household row; the server action applies these against
 * the zod-parsed payload inside one transaction-safe flow (ARCH §5).
 */

export type HouseholdCaps = {
  maxAdults: number;
  maxKids: number;
};

export type SubmitCounts = {
  adults: number;
  kids: number;
};

export type ClampResult =
  { ok: true; counts: SubmitCounts } | { ok: false; reason: 'too_many_guests'; message: string };

/**
 * Clamp guest counts to the household's actual caps.
 * accepted ⇒ at least 1 attending; declined ⇒ hardcoded zero (PRD §6.3).
 */
export function clampCounts(
  caps: HouseholdCaps,
  status: 'accepted' | 'declined',
  counts: SubmitCounts,
): ClampResult {
  if (status === 'declined') {
    return { ok: true, counts: { adults: 0, kids: 0 } };
  }

  const adults = Math.min(Math.max(0, Math.trunc(counts.adults)), caps.maxAdults);
  const kids = Math.min(Math.max(0, Math.trunc(counts.kids)), caps.maxKids);

  if (adults + kids < 1) {
    return {
      ok: false,
      reason: 'too_many_guests',
      message: 'Please add at least one guest before sending.',
    };
  }

  const overLimit = counts.adults > caps.maxAdults || counts.kids > caps.maxKids;
  if (overLimit) {
    const kidWord = caps.maxKids === 1 ? 'child' : 'children';
    return {
      ok: false,
      reason: 'too_many_guests',
      message: `Your invitation covers up to ${caps.maxAdults} adult${caps.maxAdults === 1 ? '' : 's'}${
        caps.maxKids > 0 ? ` and ${caps.maxKids} ${kidWord}` : ''
      }.`,
    };
  }

  return { ok: true, counts: { adults, kids } };
}
