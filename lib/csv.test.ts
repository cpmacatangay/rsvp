import { describe, expect, it } from 'vitest';

import { buildRsvpCsv } from '~/lib/csv';

describe('buildRsvpCsv', () => {
  it('emits UTF-8 BOM, header, rows with pending gaps as empty cells', () => {
    const csv = buildRsvpCsv([
      {
        household: 'Evelyn Camilo',
        status: 'accepted',
        adults: 2,
        kids: 3,
        dietary: 'no shellfish',
        capConfirmed: true,
        respondedAt: '2026-09-28T10:00:00.000Z',
      },
      {
        household: 'Maliah',
        status: 'pending',
        adults: null,
        kids: null,
        dietary: null,
        capConfirmed: false,
        respondedAt: null,
      },
    ]);

    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain(
      'Household,Status,Adults,Children,Dietary,Invitation caps,Responded at\r\n',
    );
    expect(csv).toContain(
      'Evelyn Camilo,accepted,2,3,no shellfish,confirmed,2026-09-28T10:00:00.000Z\r\n',
    );
    expect(csv).toContain('Maliah,pending,,,,unconfirmed,'); // last row: no trailing CRLF (join semantics)
  });

  it('escapes quotes, commas and newlines in cells (Excel-safe)', () => {
    const csv = buildRsvpCsv([
      {
        household: 'Calamiong, Clarisse',
        status: 'declined',
        adults: 0,
        kids: 0,
        dietary: 'says "not sure",\nwill call later',
        capConfirmed: true,
        respondedAt: null,
      },
    ]);

    expect(csv).toContain(
      '"Calamiong, Clarisse",declined,0,0,"says ""not sure"",\nwill call later",confirmed,',
    );
  });
});
