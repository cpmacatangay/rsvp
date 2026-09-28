import { type NextRequest, NextResponse } from 'next/server';

import { createRateLimiter } from '~/lib/rate-limit';
import { rsvpLookupSchema } from '~/lib/validation';
import { searchHouseholds } from '~/lib/submit-rsvp';

/**
 * Masked type-ahead lookup (PRD §6.2): per-IP rate limit + zod guard + 8
 * masked results max. Never returns the full list or unmasked names.
 */
const lookupLimiter = createRateLimiter(10, 60_000);

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!lookupLimiter.check(`lookup:${ip}`)) {
    return NextResponse.json(
      { ok: false, reason: 'rate_limited', message: 'Too many lookups. Take a breath and try again shortly.' },
      { status: 429 },
    );
  }

  const parsed = rsvpLookupSchema.safeParse({ q: request.nextUrl.searchParams.get('q') ?? '' });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, reason: 'validation_failed', message: first?.message ?? 'Please type at least 2 characters.' },
      { status: 400 },
    );
  }

  try {
    const results = await searchHouseholds(parsed.data.q);
    return NextResponse.json({ ok: true, results });
  } catch {
    return NextResponse.json(
      { ok: false, reason: 'unavailable', message: 'Search is unavailable right now. Please try again.' },
      { status: 503 },
    );
  }
}
