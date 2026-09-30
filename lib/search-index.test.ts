import { describe, expect, it } from 'vitest';

import { rankMatches, type CachedHousehold } from '~/lib/search-index';

const household = (
  id: string,
  displayName: string,
  maxAdults = 1,
  maxKids = 0,
): CachedHousehold => ({
  id,
  code: `code-${id}`,
  displayName,
  searchName: displayName.toLowerCase(),
  maxAdults,
  maxKids,
});

const LIST = [
  household('1', 'Evelyn Camilo', 2, 3),
  household('2', 'Evan Reyes'),
  household('3', 'Clarisse Calamiong', 2, 0),
  household('4', 'Tito Rodel'),
  household('5', 'Nanang Bing'),
];

describe('rankMatches', () => {
  it('exact prefixes rank before word-prefixes and contains', () => {
    const hits = rankMatches(LIST, 'ev');
    expect(hits.map((h) => h.displayName)).toEqual(['Evan Reyes', 'Evelyn Camilo']);
  });

  it('word-boundary matches come before deep contains', () => {
    // "ca" opens both "Calamiong" and "Camilo" at word boundaries; the tie
    // falls to the shorter name (documented ranking rule)
    const hits = rankMatches(LIST, 'ca');
    expect(hits[0]!.displayName).toBe('Evelyn Camilo');
    expect(hits[1]!.displayName).toBe('Clarisse Calamiong');
  });

  it('mid-word contains is found but ranked last among matches', () => {
    const hits = rankMatches(LIST, 'odel');
    expect(hits).toHaveLength(1);
    expect(hits[0]!.displayName).toBe('Tito Rodel');
  });

  it('shorter names win ties, then alphabetical', () => {
    const hits = rankMatches(LIST, 'nan');
    expect(hits.map((h) => h.displayName)).toEqual(['Nanang Bing']);
  });

  it('limits to 8 results', () => {
    const many = Array.from({ length: 20 }, (_, i) => household(`x${i}`, `Guest ${i}`));
    expect(rankMatches(many, 'guest')).toHaveLength(8);
  });

  it('returns empty for non-matches', () => {
    expect(rankMatches(LIST, 'zzz')).toEqual([]);
  });
});
