import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit reads DATABASE_URL from .env (dot-env/config) for generate/migrate.
 * `casing: "snake_case"` maps camelCase schema keys to snake_case columns in
 * both the generated SQL and the client (db/index.ts).
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL ?? 'postgres://not-set-when-generating' },
});
