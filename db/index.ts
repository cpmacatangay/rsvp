import 'server-only';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema';

/**
 * Server-only database access (ARCHITECTURE.md §10: no DB client ever ships to
 * the browser; `server-only` makes an accidental client import a build error).
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set — see .env.example');
  }
  return drizzle(neon(url), { schema, casing: 'snake_case' });
}
