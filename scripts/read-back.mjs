// ship-readback: verify the production RSVP landed in the DB, exactly as the UI confirmed
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select h.display_name, r.status, r.adults_attending, r.kids_attending, r.dietary_notes
  from rsvps r join households h on h.id = r.household_id
`;
for (const row of rows) console.log(JSON.stringify(row));
