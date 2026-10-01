import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

import { getDb } from '~/db';

/**
 * Health endpoint (ARCH §11.4) — plain liveness + DB connectivity for the
 * post-deploy smoke step. No PII, no secrets in the response.
 */
export async function GET() {
  const started = Date.now();
  try {
    await getDb().select({ one: sql`1` }).from(sql`(select 1) as t`);
    return NextResponse.json({ ok: true, db: 'reachable', checkedIn: `${Date.now() - started}ms` });
  } catch {
    return NextResponse.json({ ok: false, db: 'unreachable' }, { status: 503 });
  }
}
