'use server';

import { headers } from 'next/headers';

import { deadlineState } from '~/lib/deadline';
import { createRateLimiter } from '~/lib/rate-limit';
import { rsvpSubmitSchema, type ActionErrorReason } from '~/lib/validation';
import { findHousehold, recordRsvp } from '~/lib/submit-rsvp';

/**
 * Thin server action (RULES §6.1): parse → guard → probe → record → shape.
 * Serves BOTH the JS flow (type-ahead sends the opaque household code) and
 * the no-JS fallback (guest types the name; server matches exactly).
 * A plain <form action={...}> keeps it progressive (ARCH §5).
 */

export type RsvpFormState = {
  ok: boolean;
  reason?: ActionErrorReason;
  message?: string;
  data?: {
    displayName: string;
    status: 'accepted' | 'declined';
    adults: number;
    kids: number;
    dietary: string | null;
  };
};

const submitLimiter = createRateLimiter(5, 5 * 60_000);

async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  return `submit:${ip}`;
}

function str(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : '';
}

export async function submitRsvp(
  _prev: RsvpFormState | null,
  formData: FormData,
): Promise<RsvpFormState> {
  // honeypot first (PRD §6.3: silently discard bots with a success decoy)
  if (str(formData.get('website')).length > 0) {
    return {
      ok: true,
      data: { displayName: 'Guest', status: 'accepted', adults: 1, kids: 0, dietary: null },
    };
  }

  if (!submitLimiter.check(await clientKey())) {
    return {
      ok: false,
      reason: 'rate_limited',
      message: 'Too many attempts. Please try again in a few minutes.',
    };
  }

  if (deadlineState().state === 'closed') {
    return {
      ok: false,
      reason: 'closed',
      message: 'RSVPs are closed. If something changed, just send us a message directly.',
    };
  }

  // JS flow sends `code`; no-JS sends `lookupName` — exactly one, enforced by schema
  const raw = {
    code: str(formData.get('code')) || undefined,
    lookupName: str(formData.get('lookupName')) || undefined,
    website: str(formData.get('website')),
    status: str(formData.get('status')),
    adults: Number(formData.get('adults') ?? NaN),
    kids: Number(formData.get('kids') ?? NaN),
    dietary: str(formData.get('dietary')) || undefined,
  };

  const parsed = rsvpSubmitSchema.safeParse(raw);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      reason: 'validation_failed',
      message: first?.message ?? 'Please check your answers and try again.',
    };
  }

  try {
    const identifier = parsed.data.code
      ? { code: parsed.data.code }
      : { name: parsed.data.lookupName! };

    const household = await findHousehold(identifier);
    if (!household) {
      return {
        ok: false,
        reason: 'not_found',
        message: "We couldn't find that invitation. Please check the spelling of your name.",
      };
    }

    const result = await recordRsvp({
      household,
      status: parsed.data.status,
      counts: { adults: parsed.data.adults, kids: parsed.data.kids },
      dietary: parsed.data.dietary,
      now: new Date(),
    });

    if (!result.ok) {
      return { ok: false, reason: result.reason, message: result.message };
    }

    return {
      ok: true,
      data: {
        displayName: result.data.displayName,
        status: result.data.status,
        adults: result.data.counts.adults,
        kids: result.data.counts.kids,
        dietary: result.data.dietary,
      },
    };
  } catch {
    return {
      ok: false,
      reason: 'unavailable',
      message: 'Something went wrong on our side. Please try again in a moment.',
    };
  }
}
