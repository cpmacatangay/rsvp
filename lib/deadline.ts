/**
 * Deadline state — computed at request time from end-of-day Asia/Manila.
 * Philippines has no daylight saving, so +08:00 is constant fact; the cutoff
 * is pure UTC math (no library). PRD §6.4: page render and action guard MUST
 * agree — both go through this module. Pure functions; injected time dep keeps
 * tests deterministic (RULES §4.5, DIP in §2.5).
 */

export type DeadlineState =
  | { state: 'open'; closesAtMs: number }
  | { state: 'closed'; closesAtMs: number }
  | { state: 'pending-config' }; // RSVP_DEADLINE_DATE not set yet (explicit TBD, CONTENT.md)

/** "YYYY-MM-DD" at 23:59:59.999 +08:00, expressed as a UTC epoch ms number.
 * Malformed or impossible dates (month 13, Feb 30) → NaN, never a throw. */
export function deadlineDateToMs(dateIso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!m) return Number.NaN;
  const [, y, mo, d] = m;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  if (month < 1 || month > 12) return Number.NaN;
  // 15:59:59.999Z == 23:59:59.999 in +08:00
  const probe = new Date(Date.UTC(year, month - 1, day, 15, 59, 59, 999));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return Number.NaN;
  }
  return probe.getTime();
}

export type TimeProvider = () => number;

/**
 * The read of RSVP_DEADLINE_DATE lives here and ONLY here (RULES §6.6).
 * Set in .env / Vercel env as "YYYY-MM-DD"; absent = { state: 'pending-config' }.
 */
function readDeadlineEnv(): string | null {
  const trimmed = process.env.RSVP_DEADLINE_DATE?.trim();
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return trimmed;
}

/**
 * The one state function everything uses (page render, action guard, admin).
 * Missing config is a graceful "pending" state, never a crash (lib/config).
 */
export function deadlineState(now: TimeProvider = Date.now): DeadlineState {
  const dateIso = readDeadlineEnv();
  if (dateIso === null) return { state: 'pending-config' };
  const closesAtMs = deadlineDateToMs(dateIso);
  return now() > closesAtMs ? { state: 'closed', closesAtMs } : { state: 'open', closesAtMs };
}
