/**
 * Admin CSV export (US10). Pure row-to-CSV builder + a gather function kept
 * separate so the string logic is unit-testable (PRD §7 testing note).
 * Excel-friendly: UTF-8 BOM + CRLF rows.
 */

export type RsvpCsvRow = {
  household: string;
  status: 'accepted' | 'declined' | 'pending';
  adults: number | null;
  kids: number | null;
  dietary: string | null;
  capConfirmed: boolean;
  respondedAt: string | null;
};

const CSV_HEADER = 'Household,Status,Adults,Children,Dietary,Invitation caps,Responded at\r\n';

function escapeCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function cell(value: string | number | boolean | null): string {
  if (value === null) return '';
  return escapeCell(String(value));
}

export function buildRsvpCsv(rows: RsvpCsvRow[]): string {
  const lines = rows.map((r) =>
    [
      r.household,
      r.status,
      r.adults,
      r.kids,
      r.dietary,
      r.capConfirmed ? 'confirmed' : 'unconfirmed',
      r.respondedAt,
    ]
      .map(cell)
      .join(','),
  );
  return `\uFEFF${CSV_HEADER}${lines.join('\r\n')}`;
}
