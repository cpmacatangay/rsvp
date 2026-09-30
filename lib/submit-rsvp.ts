import 'server-only';

import { ilike, sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

import { getDb } from '~/db';
import { households, rsvps } from '~/db/schema';
import { clampCounts, type SubmitCounts } from '~/lib/rsvp';
import { maskName } from '~/lib/mask';

/**
 * Submit orchestration service (ARCH §3.2): domain steps, db injected by
 * callers via getDb(); the server action stays thin (RULES §6.1/6.2).
 * Result reasons match lib/validation `actionReasons`.
 */

export type HouseholdSummary = {
  id: string;
  code: string;
  displayName: string;
  maxAdults: number;
  maxKids: number;
};

export type SubmitOutcome =
  | {
      ok: true;
      data: {
        displayName: string;
        status: 'accepted' | 'declined';
        counts: SubmitCounts;
        dietary: string | null;
      };
    }
  | { ok: false; reason: 'not_found' | 'closed' | 'validation_failed'; message: string };

export type RecordOutcome = SubmitOutcome;

type SubmitInput = {
  household: HouseholdSummary;
  status: 'accepted' | 'declined';
  counts: SubmitCounts;
  dietary?: string | null;
  now: Date;
};

export async function findHousehold(input: { code?: string; name?: string }): Promise<
  HouseholdSummary | null
> {
  const db = getDb();
  if (input.code) {
    const rows = await db
      .select({
        id: households.id,
        code: households.code,
        displayName: households.displayName,
        maxAdults: households.maxAdults,
        maxKids: households.maxKids,
      })
      .from(households)
      .where(eq(households.code, input.code))
      .limit(1);
    return rows[0] ?? null;
  }
  if (input.name) {
    const searchName = input.name.trim().toLowerCase();
    const rows = await db
      .select({
        id: households.id,
        code: households.code,
        displayName: households.displayName,
        maxAdults: households.maxAdults,
        maxKids: households.maxKids,
      })
      .from(households)
      .where(eq(households.searchName, searchName))
      .limit(1);
    return rows[0] ?? null;
  }
  return null;
}

/**
 * Records (upsert) the response for a PROVEN household. Pure domain + db.
 * Overwrite semantics: every response field + `updatedAt` replace the old row;
 * `submittedAt` survives via insert-default (SCHEMA §3.2 latest-wins).
 */
export async function recordRsvp(input: SubmitInput, dbPick = getDb): Promise<RecordOutcome> {
  const counts = clampCounts(input.household, input.status, input.counts);
  if (!counts.ok) {
    return { ok: false, reason: 'validation_failed', message: counts.message };
  }

  const db = dbPick();
  const dietary = input.dietary?.trim() ? input.dietary.trim().slice(0, 280) : null;

  await db
    .insert(rsvps)
    .values({
      householdId: input.household.id,
      status: input.status,
      adultsAttending: counts.counts.adults,
      kidsAttending: counts.counts.kids,
      dietaryNotes: dietary,
      submittedAt: input.now,
      updatedAt: input.now,
    })
    .onConflictDoUpdate({
      target: rsvps.householdId,
      set: {
        status: input.status,
        adultsAttending: counts.counts.adults,
        kidsAttending: counts.counts.kids,
        dietaryNotes: dietary,
        updatedAt: input.now,
      },
    });

  return {
    ok: true,
    data: {
      displayName: input.household.displayName,
      status: input.status,
      counts: counts.counts,
      dietary,
    },
  };
}

/** Masked type-ahead candidates (PRD §6.2: never the full guest list). */
export async function searchHouseholds(query: string): Promise<
  Array<{
    code: string;
    label: string;
    maxAdults: number;
    maxKids: number;
    previous: {
      status: 'accepted' | 'declined';
      adults: number;
      kids: number;
      dietary: string | null;
      respondedAt: string;
    } | null;
  }>
> {
  const db = getDb();
  const escaped = query.replace(/[%_\\]/g, '\\$&');
  const rows = await db
    .select({
      code: households.code,
      displayName: households.displayName,
      maxAdults: households.maxAdults,
      maxKids: households.maxKids,
      prevStatus: rsvps.status,
      prevAdults: rsvps.adultsAttending,
      prevKids: rsvps.kidsAttending,
      prevDietary: rsvps.dietaryNotes,
      prevRespondedAt: rsvps.updatedAt,
    })
    .from(households)
    .leftJoin(rsvps, eq(rsvps.householdId, households.id))
    .where(ilike(households.searchName, sql`'%' || ${escaped} || '%'`))
    .orderBy(sql`length(${households.searchName}) asc, ${households.searchName} asc`)
    .limit(8);
  return rows.map((row) => ({
    code: row.code,
    label: maskName(row.displayName),
    maxAdults: row.maxAdults,
    maxKids: row.maxKids,
    previous:
      row.prevStatus !== null && row.prevStatus !== undefined
        ? {
            status: row.prevStatus,
            adults: row.prevAdults ?? 0,
            kids: row.prevKids ?? 0,
            dietary: row.prevDietary,
            respondedAt: (row.prevRespondedAt ?? new Date()).toISOString(),
          }
        : null,
  }));
}
