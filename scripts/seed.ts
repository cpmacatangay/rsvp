import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

/**
 * Idempotent seed loader — SCHEMA.md §8.
 * - Reads data/guest-list.csv (columns: displayName,maxAdults,maxKids,capConfirmed)
 * - searchName = lowercase(displayName) for the type-ahead lookup
 * - code = 12-char URL-safe random (node:crypto), stable across re-seeds
 *   because the upsert conflicts on searchName and NEVER rewrites `code`
 * - Flag column `capConfirmed=false` marks the 11 households the couple did
 *   not supply counts for (seeded 1/0, shown "cap unconfirmed" in /admin)
 *
 * Run: `pnpm seed`        (writes; requires DATABASE_URL)
 *      `pnpm seed -- --dry` (prints the report without touching the DB)
 */

type House = {
  displayName: string;
  searchName: string;
  maxAdults: number;
  maxKids: number;
  capConfirmed: boolean;
};

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'; // no lookalikes

function parseCsv(csv: string): House[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0]!.split(',').map((s) => s.trim());
  if (header.join(',').toLowerCase() !== 'displayname,maxadults,maxkids,capconfirmed') {
    throw new Error(`Unexpected CSV header: ${header.join(',')}`);
  }
  const houses: House[] = [];
  for (const line of lines.slice(1)) {
    // display names contain no commas; parse strictly from the left
    const [displayName, maxAdultsRaw, maxKidsRaw, capRaw] = line.split(',').map((s) => s.trim());
    const maxAdults = Number(maxAdultsRaw);
    const maxKids = Number(maxKidsRaw);
    if (!displayName || !Number.isInteger(maxAdults) || !Number.isInteger(maxKids)) {
      throw new Error(`Bad row: ${line}`);
    }
    houses.push({
      displayName: displayName!,
      searchName: displayName!.toLowerCase(),
      maxAdults,
      maxKids,
      capConfirmed: capRaw!.toLowerCase() !== 'false',
    });
  }
  return houses;
}

function validate(houses: House[]): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const h of houses) {
    if (seen.has(h.searchName)) issues.push(`duplicate searchName: ${h.searchName}`);
    seen.add(h.searchName);
    if (h.maxAdults < 1 || h.maxAdults > 10)
      issues.push(`${h.searchName}: maxAdults ${h.maxAdults} out of range`);
    if (h.maxKids < 0 || h.maxKids > 10)
      issues.push(`${h.searchName}: maxKids ${h.maxKids} out of range`);
  }
  return issues;
}

function makeCode(): string {
  const bytes = randomBytes(12);
  let code = '';
  for (const b of bytes) code += CODE_ALPHABET[b % CODE_ALPHABET.length]!;
  return code;
}

function report(houses: House[], issues: string[]): string {
  const adults = houses.reduce((sum, h) => sum + h.maxAdults, 0);
  const kids = houses.reduce((sum, h) => sum + h.maxKids, 0);
  const unconfirmed = houses.filter((h) => !h.capConfirmed).map((h) => h.displayName);
  const lines = [
    `households: ${houses.length}`,
    `invited capacity: ${adults} adults + ${kids} children = ${adults + kids}`,
    `cap-unconfirmed (${unconfirmed.length}): ${unconfirmed.join(', ')}`,
    `issues: ${issues.length === 0 ? 'none' : issues.join('; ')}`,
  ];
  return lines.join('\n');
}

async function upsert(houses: House[]) {
  const { getDb } = await import('~/db');
  const { households } = await import('~/db/schema');
  const db = getDb();
  // idempotent: conflict on searchName, keep the existing `code`
  for (const h of houses) {
    await db
      .insert(households)
      .values({ ...h, code: makeCode() })
      .onConflictDoUpdate({
        target: households.searchName,
        set: {
          displayName: h.displayName,
          maxAdults: h.maxAdults,
          maxKids: h.maxKids,
          capConfirmed: h.capConfirmed,
        },
      });
  }
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const csv = readFileSync(join(root, 'data', 'guest-list.csv'), 'utf8');
const houses = parseCsv(csv);
const issues = validate(houses);

console.log(report(houses, issues));
if (issues.length > 0) {
  console.error('refusing to seed: fix the CSV issue(s) above');
  process.exit(1);
}
if (dry) {
  console.log('dry run: no database touched');
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set — copy .env.example to .env first');
  process.exit(1);
}
await upsert(houses);
console.log(`seeded/upserted ${houses.length} households`);
