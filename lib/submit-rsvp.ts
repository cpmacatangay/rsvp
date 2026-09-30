import 'server-only';

import { eq } from 'drizzle-orm';

import { getDb } from '~/db';
import { households, rsvps } from '~/db/schema';
import { rankMatches, type CachedHousehold } from '~/lib/search-index';
import { clampCounts, type SubmitCounts } from '~/lib/rsvp';

/**
 * Submit orchestration service (ARCH §3.2): domain steps, db injected by
 * callers via getDb(); the server action stays thin (RULES §6.1/6.2).
 * Result reasons match lib/validation `actionReasons`.
 *
 * Perf model (U16): search ranks the in-memory household cache (zero SQL
 * per keystroke) and joins each finalist's recorded RSVP in ONE small query.
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

export type SearchHit = {
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
};

const TTL_MS = 60_000;

let cache: { rows: CachedHousehold[]; loadedAt: number } | null = null;

export function invalidateHouseholdCache() {
  cache = null;
}

async function loadRows(): Promise<CachedHousehold[]> {
  const db = getDb();
  return db
    .select({
      id: households.id,
      code: households.code,
      displayName: households.displayName,
      searchName: households.searchName,
      maxAdults: households.maxAdults,
      maxKids: households.maxKids,
    })
    .from(households);
}

async function cachedRows(): Promise<CachedHousehold[]> {
  const now = Date.now();
  if (cache && now - cache.loadedAt < TTL_MS) return cache.rows;
  const rows = await loadRows();
  cache = { rows, loadedAt: now };
  return rows;
}

/** Full names (couple decision, 2026-09-30: masking removed). */
export async function searchHouseholds(query: string): Promise<SearchHit[]> {
  const rows = rankMatches(await cachedRows(), query);
  if (rows.length === 0) return [];

  // live join: recorded responses change at any moment, so they are never cached
  const db = getDb();
  const prevRows = await db
    .select({
      householdId: rsvps.householdId,
      status: rsvps.status,
      adults: rsvps.adultsAttending,
      kids: rsvps.kidsAttending,
      dietary: rsvps.dietaryNotes,
      updatedAt: rsvps.updatedAt,
    })
    .from(rsvps);
  const prevByHouseholdId = new Map(prevRows.map((p) => [p.householdId, p]));

  return rows.map((row) => {
    const prev = prevByHouseholdId.get(row.id);
    return {
      code: row.code,
      label: row.displayName,
      maxAdults: row.maxAdults,
      maxKids: row.maxKids,
      previous:
        prev && prev.status
          ? {
              status: prev.status,
              adults: prev.adults ?? 0,
              kids: prev.kids ?? 0,
              dietary: prev.dietary,
              respondedAt: (prev.updatedAt ?? new Date()).toISOString(),
            }
          : null,
    } satisfies SearchHit;
  });
}
