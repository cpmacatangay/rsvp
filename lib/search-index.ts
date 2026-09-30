/**
 * Household search index (couple review 2026-09-30: "search as fast as possible").
 * The households table is tiny (63 rows) and changes only at seed time, so
 * per-keystroke SQL is pointless: rank in RAM.
 *
 * Ranking theorem of the day (unit-tested): exact prefix > word-prefix >
 * contains, then shorter names first, then alphabetical.
 */

export type CachedHousehold = {
  id: string;
  code: string;
  displayName: string;
  searchName: string;
  maxAdults: number;
  maxKids: number;
};

export function rankMatches(
  rows: CachedHousehold[],
  query: string,
  limit = 8,
): CachedHousehold[] {
  const q = query.toLowerCase();
  const scored = rows
    .filter((row) => row.searchName.includes(q))
    .map((row) => {
      let score = 2;
      if (row.searchName.startsWith(q)) score = 0;
      else if (row.searchName.includes(` ${q}`)) score = 1; // word boundary
      return { row, score };
    });
  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.row.searchName.length !== b.row.searchName.length) {
      return a.row.searchName.length - b.row.searchName.length;
    }
    return a.row.searchName.localeCompare(b.row.searchName);
  });
  return scored.slice(0, limit).map((entry) => entry.row);
}
