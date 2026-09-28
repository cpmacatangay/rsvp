# Data Schema — rsvp
**Project:** rsvp · **Database:** Neon Postgres (serverless) · **ODM/ORM:** Drizzle ORM · **Version:** 0.1 · **Status:** Draft · **Updated:** 2026-09-28

---

## 1. Schema Overview

| Entity | Purpose | Avg Size | Retention |
|---|---|---|---|
| `households` | Preloaded guest list: who is invited, what their party may bring | ~120 B | Permanent (delete only on couple request) |
| `rsvps` | Latest submitted response per household (upsert target) | ~100 B | Permanent until post-wedding cleanup |

Expected volume: 100–300 households. Nothing else is stored.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    HOUSEHOLD ||--o| RSVP : "answers with 0..1"
    HOUSEHOLD {
        uuid PRIMARY KEY
        string code "unique, opaque public id"
        string searchName "unique, lowercase display name"
        string displayName "as shown to guests"
        int maxAdults "default 1"
        int maxKids "default 0"
        timestamp createdAt
    }
    RSVP {
        uuid PRIMARY KEY
        uuid rsvps FK "unique, ref: Household"
        string status "accepted | declined"
        int adultsAttending "0..maxAdults enforced app-side"
        int kidsAttending "0..maxKids enforced app-side"
        string dietaryNotes "optional, <= 280 chars"
        timestamp submittedAt "first submission"
        timestamp updatedAt "latest submission"
    }
```

### Denormalization Notes
None. `searchName` is a derived lowercase copy of `displayName` kept only to
make the type-ahead lookup a plain indexed query; it is regenerated in the
same write as `displayName`, never edited independently.

---

## 3. Per-Entity Schemas

### 3.1 `households`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `id` | uuid | auto | `gen_random_uuid()` | PK | Primary key |
| `code` | text | yes | generated at seed | unique, length 12, URL-safe alphabet | Opaque public id used in payloads/links; hides DB ids from guesses |
| `searchName` | text | yes | — | unique, lowercase, ≤ 80 | Lowercased household label used for lookup matching |
| `displayName` | text | yes | — | ≤ 80 | Label shown after selection, e.g. "Paul, Christian" |
| `maxAdults` | int | yes | 1 | 1..10 | Invited adults in the party |
| `maxKids` | int | yes | 0 | 0..10 | Invited children in the party |
| `createdAt` | timestamptz | auto | now() | — | |

**Schema definition (Drizzle):**
```ts
export const households = pgTable("households", {
  id: uuid().primaryKey().defaultRandom(),
  code: varchar({ length: 12 }).notNull().unique(),
  searchName: varchar({ length: 80 }).notNull().unique(),
  displayName: varchar({ length: 80 }).notNull(),
  maxAdults: integer().notNull().default(1),
  maxKids: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
```

### 3.2 `rsvps`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `id` | uuid | auto | auto | PK | Primary key |
| `householdId` | uuid | yes | — | FK → `households.id`, **unique, on delete cascade** | One response per household |
| `status` | text | yes | — | enum `accepted \| declined` (check) | The answer |
| `adultsAttending` | int | yes | — | 0..10, ≥ 1 when accepted (app-enforced) | Adults coming |
| `kidsAttending` | int | yes | 0 | 0..10 (app-enforced) | Children coming |
| `dietaryNotes` | text | no | null | ≤ 280 chars | Free text; contains health-adjacent data |
| `submittedAt` | timestamptz | auto | now() | — | First ever submission |
| `updatedAt` | timestamptz | auto | now() | — | Latest submission |

**Schema definition (Drizzle):**
```ts
export const rsvps = pgTable("rsvps", {
  id: uuid().primaryKey().defaultRandom(),
  householdId: uuid().notNull().references(() => households.id, { onDelete: "cascade" }).unique(),
  status: text({ enum: ["accepted", "declined"] }).notNull(),
  adultsAttending: integer().notNull().default(0),
  kidsAttending: integer().notNull().default(0),
  dietaryNotes: varchar({ length: 280 }),
  submittedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
```

**App-enforced vs. DB-enforced:** bounds that depend on the household's caps
(`adultsAttending ≤ maxAdults`, kids likewise, ≥ 1 attending if accepted,
0 if declined) cannot be expressed as row-local check constraints, so the
server action enforces them with zod against the household row *in the same
transaction*. DB constraints cover identity/uniqueness only.

---

## 4. Relationships & References

| From | To | Via | Nature | Cascade |
|---|---|---|---|---|
| `rsvps.householdId` | `households.id` | FK (unique) | 1 : 0..1 | Delete household → delete its RSVP |

A household with no RSVP row = "no response yet" in the admin view (LEFT JOIN).

### Cascade / Delete Rules
Households are the source of truth; losing one removes its response (there is
never an RSVP without a household). Soft delete is not used.

### Join / Populate Patterns
Every read that needs served data joins households ⟕ rsvps eagerly
(few hundred rows, single query); no lazy loading patterns anywhere.

---

## 5. Indexes & Constraints

### 5.1 `households`
| Index | Fields | Unique | Purpose |
|---|---|---|---|
| PK / `uq_code` | `id` / `code` | yes | Opaque lookup + payload references |
| `uq_search_name` | `search_name` | yes | Type-ahead equality lookup |

### 5.2 `rsvps`
| Index | Fields | Unique | Purpose |
|---|---|---|---|
| `uq_household` | `household_id` | yes | Upsert target, one row per household |

---

## 6. Data Access & Scoping

### The Pattern
Not user-scoped — there are no user accounts. Access classes instead:

| Data | Who can read | Where enforced |
|---|---|---|
| Masked type-ahead matches | Anyone with the URL, rate-limited | Route handler (server-only, masked) |
| Full household + allowance | The selecting guest (after picking a match) | Server action, by `code` |
| All responses / CSV | Admin session only | Server-side session check |
| Dietary notes | Admin session only | Rendered in `/admin` only, never logs |

### Enforcement Points
| Layer | Enforcement | Bypassable? |
|---|---|---|
| Route/action | Every DB touchpoint lives in server-only modules; no DB client ships to the client | No |
| Middleware | `/admin` reads session cookie before rendering anything | No |
| Database | Neon credentials exist only in server env | No |

---

## 7. Migration Strategy

Drizzle-kit generates plain SQL migrations, committed to the repo.

### 7.1 File Format
`drizzle/NNNN_name.sql` pairs, applied by `drizzle-kit migrate`;
`pnpm drizzle-kit generate` after schema edits, review the SQL before commit.

### 7.2 Naming Convention
```
0000_initial_schema
0001_<change>_description
```

### 7.3 Running & CI/CD
Local: `pnpm db:push` (dev) → `pnpm drizzle-kit migrate` (CI parity).
Production: migrations run in the same shell step as the deploy
(`drizzle-kit migrate` then `vercel deploy --prod`), so a request never hits a
schema the code doesn't expect (single-instance scale means no rolling skew).

---

## 8. Seed Data

`scripts/seed.ts` reads `data/guest-list.csv` (columns:
`displayName,maxAdults,maxKids` — generated from the CONFIRMED list in
`CONTENT.md` §2), normalizes `searchName`, generates `code` values
(URL-safe random, 12 chars, via `node:crypto`), and **is idempotent**: it
upserts on `searchName`, so re-runs after list edits update caps and codes
without creating duplicates or orphaning existing RSVPs.
**Cap-unconfirmed rule (couple-approved):** households supplied without a
count seed as `maxAdults = 1, maxKids = 0`, and appear flagged "cap
unconfirmed" in the seed report and the admin table; corrections are made by
editing the list in `CONTENT.md` and re-seeding (no admin CRUD in v1).

The real list lives in `CONTENT.md` §2 and generates `data/guest-list.csv` at
build (implementation-plan Stage 4, step 4.2).

**Run:** `pnpm seed` (requires `DATABASE_URL`, refuses to run against production
without `--yes`).

---

## 9. TTL & Cleanup
Not applicable in v1 — no rows auto-expire. Post-wedding: the couple decides
retention; a one-off export + `truncate` is the documented cleanup path.

---

## 10. Backup & Recovery

### 10.1 Production
Neon point-in-time restore (default 7-day restore window on free tier) — the
effective backup story. Before each milestone deploy, couple-exported CSV
double-serves as a human-readable snapshot.

### 10.2 Local Development
Local Postgres via Neon's local proxy or a disposable Neon branch created from
`main`; seeds make local data reconstructible in one command, so no dump/restore
flow is needed.

---

## 11. Validation Rules Cross-Reference

| Field | DB boundary | API boundary (zod, shared with client form) |
|---|---|---|
| `code` | unique text(12) | `z.string().length(12).regex(/^[A-Za-z0-9_-]+$/)` |
| `searchName` | unique varchar(80) lowercase | derived server-side (`.toLowerCase()`), never client input |
| `displayName` | varchar(80) | `z.string().min(2).max(80)` at seed only |
| `status` | check enum accepted/declined | `z.enum(["accepted","declined"])` |
| `adultsAttending` | int, not null | `z.number().int().min(0).max(10)` + app check vs. `maxAdults` |
| `kidsAttending` | int, not null | `z.number().int().min(0).max(10)` + app check vs. `maxKids` |
| `dietaryNotes` | varchar(280) | `z.string().trim().max(280).optional()` |

**Principle:** the database guarantees identity and referential integrity;
cross-row business rules (party caps, accepted ⇒ someone attending) are the
API layer's job because they need context the row alone doesn't have.
