// ops sanity check: counts, spot rows, code hygiene. `node --env-file=.env scripts/db-check.mjs`
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const totals =
  await sql`select count(*)::int as households, sum(max_adults)::int as adults, sum(max_kids)::int as kids, sum(max_kids) + sum(max_adults)::int as capacity from households`;
console.log('totals:', JSON.stringify(totals[0]));

const spot =
  await sql`select display_name, max_adults, max_kids, cap_confirmed from households where search_name in ('evelyn camilo', 'tito bernard', 'tito rodel', 'melody') order by display_name`;
for (const row of spot) console.log('spot:', JSON.stringify(row));

const codes = await sql`select code from households order by code`;
console.log(
  'codes-sha-sample:',
  codes.length,
  'rows; first-3:',
  codes
    .slice(0, 3)
    .map((c) => c.code)
    .join(','),
);
const bad = await sql`select count(*)::int as n from households where length(code) <> 12`;
console.log('bad-codes:', bad[0].n);
