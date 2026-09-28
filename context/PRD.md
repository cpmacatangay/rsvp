# Product Requirements Document
## rsvp — one-page mobile-first wedding RSVP
**Project:** rsvp · **Version:** 0.1 · **Status:** Draft · **Updated:** 2026-09-28

---

## 1. Problem & Context

Chasing wedding responses over WhatsApp and paper cards is slow, error-prone, and
hard to consolidate. Guests — many of them older relatives on phones — need one
simple place to see the essentials of the day and confirm attendance in under two
minutes. The couple needs a single, accurate headcount (adults and children,
dietary needs) to hand to their caterer and seating planner, without manual
data entry.

---

## 2. Goals & Non-Goals

### Goals (v1)

1. Every invited household can read the essentials of the day and submit or
   update their RSVP from a phone in ≤ 2 minutes, without an account.
2. Households are always answering against a known invitation — the form knows
   each household's allowed guest count and enforces it.
3. The couple can see every response, totals, and a CSV export at any time,
   from a phone, behind a single password.
4. The page quietly prepares the day: countdown, venue/directions facts,
   our story, day schedule, dress code.
5. The guest experience is reliable on mid-range and old phones: server-rendered
   content, form submits that survive JavaScript failures, no heavy assets.

### Non-Goals (explicitly deferred)

- Email or SMS notifications in any direction
- Meal-menu selection
- Song requests, photo uploads, guest comments
- Admin CRUD of households (seed list is the single source)
- Native apps or installable PWA
- Multi-event support (separate RSVPs per ceremony tier)
- Seat-level guest names (per-person dietary attribution)

### Later phases (not in v1)

- Personalised per-guest pages (codes printed on paper invitations)
- Meal choices once the catering menu is fixed
- Bilingual copy

---

## 3. Project Scope

| In Scope (v1) | Out of Scope (later) |
|---|---|
| Single scrolling guest page: hero → countdown + location → our story → day schedule → dress code → RSVP → footer | Separate detail pages, navigation menus |
| Household lookup (preloaded list, type-ahead) | Unique printed invite codes |
| RSVP: attending, guest count vs. household cap, dietary note | Meal selection, contact fields, message field |
| Resubmission overwrite until close; auto-close at deadline | One-shot RSVPs; late manual re-open tooling |
| On-screen animated confirmation only | Email confirmations |
| `/admin`: password, table, totals, CSV export | Admin editing/deleting of RSVPs; SSO |
| Rate limiting, honeypot, robots noindex on /admin | CAPTCHA accounts, bot firewalls |
| Vercel free tier + Neon Postgres | Custom domain (optional, zero-cost swap later) |

---

## 4. Users & Personas

**Primary persona — "Auntie with an older iPhone":**
60s, comfortable with WhatsApp and search engines, wary of apps and logins.
Visits on her phone from the invitation link, scrolls, wants to know
where/when/what to wear, then RSVPs. Big type, big tap targets, zero
account creation, instant confirmation she can trust.

**Secondary persona — "the couple (admins)":**
Between wedding appointments, checks responses on a phone between other tasks.
Wants totals quickly ("how many eating?") and a clean CSV for the caterer.
No time for a second tool — the fewer clicks the better.

---

## 5. User Stories

*Discovery & Info*
- US1: As a guest opening the link, I see the couple's names, date, and a photo
  immediately, and can reach the RSVP form in one scroll or one tap.
- US2: As a guest, I can read location/directions, the outline of the day, and
  the dress code without hunting through sections.

*RSVP*
- US3: As a guest, I can find my household by typing my name and see exactly
  how many people I may bring.
- US4: As a guest, I can respond "Joyfully accepts" (with guest count) or
  "Regretfully declines", plus an optional dietary note.
- US5: After submitting, I see an unmistakable confirmation of what was recorded.
- US6: As a guest who changed their mind, I can find my household again and
  resubmit — my latest response wins, until the deadline.
- US7: As a guest after the deadline, I see a friendly closed message pointing
  me at the couple directly.

*Admin*
- US8: As the couple, I can log into /admin with one shared password.
- US9: As the couple, I can see all households with status (no response yet /
  accepted / declined), guest counts, and dietary notes, plus totals.
- US10: As the couple, I can export everything as CSV for the caterer.

---

## 6. Functional Requirements

### 6.1 Authentication & Authorization
- The only protected route is `/admin` (+ its CSV endpoint). Auth = single
  shared password from `ADMIN_PASSWORD` env, compared in constant time; success
  sets an httpOnly, SameSite=Lax session cookie (`ADMIN_PASSWORD`-signed token
  with expiry). Guest pages have no accounts; guests are identified only
  through their preloaded household.
- `/admin` is `noindex`, robots-disallowed, and not linked from the guest page.

### 6.2 Household Lookup
- `households` seeded from the couple's list (name, max adults, max children),
  each with an opaque random public code (not guessable).
- Type-ahead queries the server with ≥ 2 characters, rate-limited, returning
  masked matches (first name + surname initial, e.g. "Anna M."). Selecting a
  match reveals that household only: pre-filled name(s) and allowed counts.
- Guests never see the full guest list at once; capitalisation does not matter
  in search.

### 6.3 RSVP Submission
- Fields: attending (`accepted` / `declined`), if accepted: guests coming
  (steppers, clamped 0..max adults and 0..max kids, at least 1 total), dietary
  note (optional, ≤ 280 chars, plain text).
- A hidden honeypot field must stay empty; filled submissions are silently
  discarded.
- Server action validates with zod against the household's actual caps and
  upserts the household's single RSVP row (latest submission wins; earlier
  row overwritten, `updatedAt` refreshed). Response: success payload the UI
  renders as the confirmation state.
- No-JS fallback: the form posts to the server action with the typed name
  submitted as text; the server performs the same lookup and returns a plain
  server-rendered confirmation page.

### 6.4 Deadline Handling
- Deadline lives in a single configuration source (`RSVP_DEADLINE_DATE` env,
  Asia/Manila). Before it: form fully open. After: lookups and submissions
  return the closed state; UI swaps the form for a warm "RSVPs are closed —
  just message us" block. No cron involved; state is computed at request time.
- Deadline helpers are pure functions (unit-tested): date used by both the
  page render and the action guard must agree.

### 6.5 Notifications
None in v1 (deliberate). Confirmation is on-screen only; the couple watches
`/admin`. The confirmation state repeats the recorded details back so guests
can trust it without email.

### 6.6 Main View / Dashboard
- `/admin` dashboard = single table of all households, one row each:
  household name, status (Pending / Accepted / Declined), adults + kids
  coming, dietary note, last updated.
- Totals header: households invited / responded, headcount of acceptances
  split adults/children/kids, dietary note count.
- "Export CSV" button streams all rows (authorized users only).
- Content sections (countdown + location, story, schedule, dress code) are
  server-rendered from environment/config constants — no CMS.

---

## 7. Technical Requirements

| Area | Decision | Notes |
|---|---|---|
| Frontend framework | Next.js 15 (App Router, React Server Components) | Server-rendered first paint; one route `/` + `/admin` |
| Frontend state | Plain React state (form only) | No client store needed |
| Styling | Tailwind CSS v4 | Design tokens per `DESIGN.md` |
| Motion | `motion` (framer-motion) client-side | Transform/opacity only; CSS where enough (per `DESIGN.md` §9) |
| Backend runtime | Next.js server actions + route handlers (Node on Vercel) | No separate API server |
| Validation | zod | Second source of truth vs. types (see `RULES.md` §2) |
| Database | Neon Postgres (free tier), Drizzle ORM | Serverless driver; migrations via drizzle-kit |
| Logging | `pino` (structured), request-id | No PII in logs |
| Error tracking | None in v1 | Optional Sentry later |
| Testing | vitest + `impeccable detect`, Lighthouse mobile ≥ 95 | Pure helpers only: deadline math, cap clamp, CSV builder, masking |
| Scheduling | None | Deadline computed at request time |
| Typeahead search | Server route handler with warm Postgres query | Households expected ≤ 300 rows |

### Security & Compliance
- No passwords, no accounts — no hashing scheme needed; admin session cookie
  is short-lived (≤ 24 h) and HttpOnly.
- Data stored: household label, counts, dietary note. Dietary data is
  health-adjacent — shown only inside the password-gated admin; never logged.
- Zod validation at the single boundary (server action/route handlers); types
  never double as validators.
- Rate limits: name lookup (per IP, small bursts) and RSVP submit (per IP) —
  stops enumeration of the guest list and spam floods; honeypot for bots.
- CSV export gated behind the same admin session.
- Secrets only via env vars (`DATABASE_URL`, `ADMIN_PASSWORD`,
  `RSVP_DEADLINE_DATE`); never committed; `.env.example` documents them.

### Dev Tooling
- pnpm; ESLint (next/core-web-vitals) + Prettier; TypeScript strict.
- `npx impeccable detect` run in CI-style pre-launch gate (see `RULES.md` §7).
- Seed script reads `data/guest-list.csv`, generates codes + search names
  idempotently (re-runs do not duplicate).
- Vercel preview deploys per push; production on main.

---

## 8. Data Model (high-level)

```
Household { id, code, searchName, displayName, maxAdults, maxKids, createdAt }
Rsvp     { id, householdId → Household (unique), status: accepted|declined,
           adultsAttending, kidsAttending, dietaryNotes?, submittedAt, updatedAt }
```
One household ⇒ zero or one RSVP. Full detail in `SCHEMA.md`.

---

## 9. Success Metrics

| Metric | Target (by RSVP deadline) | Notes |
|---|---|---|
| Response coverage | ≥ 90% of seeded households have an RSVP | proxy for "the page worked" |
| Mobile Lighthouse (performance + a11y) | ≥ 95 / ≥ 95 | cold visit, mid-tier phone profile |
| Submission success rate | ≥ 98% of started flows end confirmed | error states must be self-explanatory |
| Admin usage without support | couple can answer "how many coming?"/ dietary in < 1 min | the reason the dashboard exists |

---

## 10. Milestones

| Week | Focus | Deliverables |
|---|---|---|
| Wk 1 | Scaffold + schema | Next.js app, Tailwind tokens per `DESIGN.md`, Drizzle schema, Neon, seed loader + `data/guest-list.csv` from the couple |
| Wk 2 | Guest page shell | Hero, countdown, location, story, schedule, dress code — server-rendered, mobile-first |
| Wk 3 | RSVP flow | Type-ahead lookup, capped form, server action + upsert, success state, no-JS fallback |
| Wk 4 | Admin | Password gate, dashboard table + totals, CSV export |
| Wk 5 | Polish & launch | Motion pass (taste/emil skills), `impeccable detect` clean, a11y + real-device sweep, deadline close behaviour, deploy + smoke test |

---

## 11. Confirmed Content Inputs

All page content facts (couple, venue, schedule, story, dress code, guest
list, photos, locale) are recorded verbatim in `CONTENT.md` with a per-item
status (CONFIRMED / RECOMMENDATION / OPEN). Ship blockers remain: wedding
date, ceremony time, RSVP deadline ({{TBD_*}} slots).
