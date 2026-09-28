/**
 * Masking rules (PRD §6.2: type-ahead returns matches mask-first).
 * Format from CONTENT.md §2 notes + DESIGN: keep display tokens verbatim
 * ("Tito Rodel" never becomes "Rodel"), idempotent, no regex footgun on
 * punctème glyphs (Peña, etc.).
 */

export function maskName(displayName: string): string {
  const tokens = displayName
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return '';
  if (tokens.length === 1) return tokens[0]!;

  const first = tokens[0]!;
  const last = tokens[tokens.length - 1]!;
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}
