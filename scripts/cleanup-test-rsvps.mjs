// one-off cleanup (couple approved, 2026-10-01): wipe all test RSVP rows;
// households stay. Neon's PITR window is the safety net.
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const before = await sql`select count(*)::int as n from rsvps`;
await sql`delete from rsvps`;
const after = await sql`select count(*)::int as n from rsvps`;
const households = await sql`select count(*)::int as n from households`;
console.log(`rsvps before: ${before[0].n} -> after: ${after[0].n}; households intact: ${households[0].n}`);
