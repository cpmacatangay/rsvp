# Project Context — rsvp

Documentation for the wedding RSVP site: one mobile-first page guests use to
confirm attendance, plus a password-gated dashboard for the couple. Built on
Next.js + Neon Postgres, deployed on Vercel.

## Source of truth

```
RULES.md        — coding standards, lint config, PR checklist, anti-patterns
SCHEMA.md       — 2-table data model, constraints, migration + seed rules
ARCHITECTURE.md — app topology, server actions, deployment, security
DESIGN.md       — soft-premium design system (palette, type, motion, a11y)
PRD.md          — scope, user stories, requirements, milestones
```
Executable source (code, config, build scripts) wins over every doc above.

## File index

| File | Contents |
|---|---|
| `PRD.md` | Problem, goals/non-goals, personas, 10 user stories, functional + technical requirements, success metrics, milestones |
| `SCHEMA.md` | `households` + `rsvps`, ERD, Drizzle definitions, validation cross-reference |
| `ARCHITECTURE.md` | Server-action architecture, lookup/export handlers, admin auth, deployment, security boundaries |
| `DESIGN.md` | Soft-premium direction: ivory+sage palette, Fraunces/Karla type, section anatomy, motion rules |
| `RULES.md` | RFC-2119 coding rules, size limits, closed-union error pattern, CI gates |
| `CONTENT.md` | Confirmed content inputs: couple, venue, guest list (seed source), story, schedule, dress code, photos |
| `implementation-plan.md` | The staged BRIEF→SHIP implementation plan + milestones (approved by the couple) |

## Locked product decisions (round 1 + 2 Q&A)

| Decision | Value |
|---|---|
| Stack | Next.js 15 App Router, server actions, Neon Postgres, Vercel free tier |
| Guest identity | Preloaded list, masked type-ahead, per-household caps |
| RSVP fields | Attending · guest count vs. cap · dietary note (≤ 280). No email/message/meal/song |
| Confirmation | On-screen animated success card |
| Editing | Resubmit overwrites household response until close |
| Deadline | Computed from `RSVP_DEADLINE_DATE` (Asia/Manila), no cron |
| Admin | `/admin`, env password, table + totals + CSV |
| Copy | English only |
| Design | Soft premium · ivory + sage · photo hero · dials 4/4/3 · `motion` for animation |
| Hosting | Vercel free `.vercel.app` URL |
| Skills in use | `design-taste-frontend`, `high-end-visual-design`, `emil-design-eng`, `mobile-native`, `impeccable` (quality gate: `npx impeccable detect`) |
| Couple | Christian Paul & Christine Jane |
| Venue | Minor Basilica and National Shrine of Our Lady of Peñafrancia, Naga City (confirmed; maps link in `CONTENT.md`) |
| Guests | 63 households seeded from `CONTENT.md`; 11 without counts default to 1 adult, flagged "cap unconfirmed", correctable via CSV re-seed |
| Locale & region | Deadline timezone `Asia/Manila` · Vercel `sin1` + Neon Singapore (guests in the Philippines) |

MOBILE.md intentionally does not exist: mobile-first web page, no native client.

## Pending inputs (blocks "no placeholders" completion rule)

| Placeholder | Needed for | Ask |
|---|---|---|
| (none) | — | All content facts resolved 2026-10-01. The two temporal facts carry a provisional note (couple may change); both are env/config values, so a change is one env edit + redeploy, never code |

These appear verbatim in the docs; grep `TBD_` to locate every remaining slot.
Everything else is final. Resolved items (couple, venue, guest list, photos,
story, schedule, dress code) live in `CONTENT.md`.

## Build order

1. Scaffold Next.js app + Tailwind tokens from `DESIGN.md` §3–§5.
2. Drizzle schema + migrations (`SCHEMA.md`), seed loader.
3. Sections (server-rendered) → RSVP flow → admin.
4. Motion + a11y pass under taste/emil/mobile-native skill rules.
5. Gates: `impeccable detect`, Lighthouse ≥ 95 mobile, vitest pure helpers.
6. Deploy Vercel; smoke `/api/health`; real-device check; set `RSVP_DEADLINE_DATE`.
