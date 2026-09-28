# Implementation Plan — rsvp (wedding RSVP, mobile-first one-pager)
**Status:** awaiting user approval · **Workflow:** BRIEF → TASTE → IMPECCABLE INIT → BUILD → CRITIQUE → FIX → EMIL → AUDIT → FIX → POLISH → SHIP
**Source of truth:** the five finalized docs in `context/` + `CONTENT.md` (created by this plan's first action) + user decisions of 2026-09-28.

# Project Status

## Confirmed decisions
From `context/` docs and user answers (source tags: [R1/R2] earlier Q&A rounds; [R3] 2026-09-28 answers A–D):

- Stack: Next.js 15 App Router + server actions + Neon Postgres (Drizzle), Vercel free tier, `.vercel.app` [R1]
- Guest identity: preloaded list, masked type-ahead, per-household caps [R1]
- RSVP fields: attending · guest count vs. cap · dietary note ≤280 — no email/message/meal/song/contact [R1]
- Confirmation: on-screen animated success card "You're all set" [R1]
- Editing: resubmit overwrites household response; auto-close at deadline; no cron [R1]
- Admin: `/admin` env-password, table + totals + CSV; HttpOnly 24h session; constant-time compare [R1]
- Copy: English only [R2]; sections: hero → countdown+location → story → schedule → dress code → RSVP → footer [R2]
- Design: soft premium, dials VARIANCE 4 / MOTION 4 / DENSITY 3; ivory+sage; Fraunces/Karla; `motion` lib; 48px taps; transform/opacity-only motion; `prefers-reduced-motion` always [R2]
- Couple: **Christian Paul & Christine Jane** [R3]
- Venue: **Peñafrancia Basilica, Naga City** + provided maps link [R3-C]
- Guests: **63 households** (verified: 136 adults + 16 children named by the couple; with the 11 cap-defaulted singles it becomes **147 adults + 16 children = 163 invited capacity**); seed from `CONTENT.md`; **cap-unconfirmed (11) default `1 adult`, flagged, fixable via CSV re-seed** [R3-A]
- Photos: **`assets/hero/cpcj.jpg`** verified in repo (4.0 MB) [R3-B]
- Dress code = site palette; schedule 14:00/15:30/18:30/21:00; story text verbatim [R3]
- **Timezone Asia/Manila** (corrects approved drafts) + **region: Vercel `sin1`, Neon Singapore** [R3-D]

## Remaining open questions (ship-gated only, per user's "LATER" choice)
1. Wedding date (`{{TBD_WEDDING_DATE}}`) → countdown target, meta, schedule weekday
2. Ceremony time (`{{TBD_CEREMONY_TIME}}`) → countdown + schedule
3. RSVP deadline (`RSVP_DEADLINE_DATE`) → auto-close logic warm-up
These three gate Milestone 11 (SHIP). They do not gate planning or BUILD; code reads them from a single typed config (`lib/config.ts`) with explicit missing-value handling that hides "TBD" countdown gracefully.

## Deferred minor decisions (with decision checkpoints)
| Item | Checkpoint | Recommendation |
|---|---|---|
| "Leave bridal white for our bride" note in dress code | M4 copy review | include (gentle) |
| Story singular "my" → "our" | M4 copy review | smooth it |
| Schedule item labels ("Ceremony/Reception/Dinner/Party") | M4 copy review | as listed in CONTENT.md |
| Favicon monogram letter (from couple names) | M4 foundation of sections ("C" default) | single sage "C" on ivory |
| Type-ahead debounce (ms), rate-limit exact numbers | S4-build/form step; tunable env | 200ms debounce; burst 10/min lookup, 5/5min submit |
| OG image (static, hero + names) | S11 | generate once from approved hero |

## Explicit assumptions (implementation-level, user may veto anytime)
- Hero uses the single provided photo `cpcj.jpg` (landscape assumed; portrait handled by layout).
- Display names keep honorifics verbatim ("Tito Rodel"); search lowercases tokens, so "Rodel" matches.
- Masking format: first token + surname initial ("Anna M.").
- Archive: no cookies for guests; admin cookie 24h HttpOnly SameSite=Lax.
- Rate limiting in-memory best-effort per instance (documented in ARCHITECTURE §15).
- Deployment on Vercel free `.vercel.app` (custom domain swap later chosen by user).
- `data/guest-list.csv` is generated at BUILD from `CONTENT.md` §2 (single source) — never hand-edited ad hoc.
- Impeccable is installed via the user-approved repo-link workaround (CDN 404); `npx impeccable update` later may switch to bundle flow.

---

# Significant dependencies and why we need them
Every dependency is listed in `context/PRD.md` §7 / `ARCHITECTURE.md` §14 with rationale. Summary of "why":
| Dependency | Why we need it |
|---|---|
| Next.js (App Router + server actions) | a single deploy unit, SSR for old phones, server-held DB credentials, no-JS `<form>` fallback |
| Tailwind CSS v4 | design tokens live as CSS vars (DESIGN.md) with zero runtime |
| Drizzle ORM + Neon serverless driver | typed 2-table schema, tiny serverless footprint |
| zod | one validator shared by client + server (RULES §3.4) |
| `motion` | small, transform/opacity-only island animations; no GSAP timelines for this motion budget |
| pino | structured logs without PII (server-side only) |
| @phosphor-icons/react | the only icon set aligned with the soft-premium direction (couple-confirmed at M3): ultra-light hairline icons for map pin / calendar / chevrons / steppers |
| vitest | pure helpers (deadline clamp, caps, masking, CSV) need deterministic tests |
| Node `crypto` | household codes (12-char URL-safe) — no extra dep, avoids inventing |
| impeccable CLI | the quality gate the user mandated (61 anti-pattern detector + stage tooling) |
Nothing else is added. Any PR adding a dependency beyond this table needs a review line stating why (`RULES` §5.6).

---

# Stage 1 — BRIEF
**Objective:** assemble the executable brief purely from approved context.
**Prerequisites:** build agent active; `plan/decisions-to-record.md` applied first.
**Tasks:** 1) Apply `decisions-to-record.md` edits to `context/*`; 2) create `context/CONTENT.md`; 3) copy this file to `context/implementation-plan.md`; 4) confirm the brief: goals (PRD §2), users (PRD §4), flow (PRD §5 US1–US10), page structure (PRD §3), content (CONTENT.md), functional reqs (PRD §6), technical reqs (PRD §7), constraints (RULES), design direction (DESIGN), a11y (DESIGN §12), data/privacy (ARCH §10, SCHEMA §11), deployment (ARCH §7).
**Files affected:** `context/README.md`, `context/CONTENT.md`, `context/PRD.md`, `context/SCHEMA.md`, `context/ARCHITECTURE.md`, `context/implementation-plan.md`.
**Dependencies:** none.
**Expected result:** context/ reflects all confirmed decisions; TBD slots only where user chose LATER.
**Validation:** `grep -r "Europe/Berlin\|newest-scroll\|us/eu region" context/` → 0 hits; TBD grep lists exactly { date, time, deadline }.
**Definition of done:** Milestone 1 — user approves this plan (approval gate).
**Potential issues:** CONTENT.md verbatim list contains trailing-hyphen artifacts from the chat paste — the normalized CSV above fixes them; reviewer should eyeball the 63 rows once.
**Open decisions:** none (open questions are the three ship-gated slots above).

# Stage 2 — TASTE SKILL
**Objective:** produce the concrete visual direction from the taste skills before any UI code.
**Prerequisites:** Stage 1 complete; skills loaded (`design-taste-frontend`, `high-end-visual-design` in `.agents/skills`).
**Tasks:** 1) Read both skill files; apply their rules at dials **4/4/3** (low density, restrained variance, gentle motion); 2) validate `DESIGN.md` tokens against skill rules — fonts (Fraunces/Karla OK per skill's font guidance), spacing rhythm, shadow warmth, button/pill anatomy, card structures, image treatment (hero overlay for text legibility), 3) enforce hard bans (em-dashes in copy, pure black/white text, oversized radius, gradient text); 4) extract the resource map from DESIGN.md §3–§9 → ready-to-paste `@theme` token block (Tailwind v4) for `app/globals.css`.
**Files affected:** `context/DESIGN.md` (append "§14 Taste application log"), `context/quality-baseline.md` (started), token block drafted for Stage 4.
**Dependencies:** Stage 1.
**Expected result:** a direction that is a pure translation of DESIGN.md — zero new patterns; every ban from the taste skill checked off.
**Validation:** token block matches DESIGN.md values 1:1 (spot-check 8 tokens); taste pre-flight checklist (skill's own) passes.
**Definition of done:** Milestone 2 — visual direction documented, tokens ready.
**Potential issues:** taste skill may suggest stricter letter-spacing on small-caps eyebrows than DESIGN.md says — DESIGN wins, tune only if contrast fails.
**Open decisions:** none.

# Stage 3 — IMPECCABLE INIT
**Objective:** establish the design/UX quality baseline before significant UI implementation.
**Prerequisites:** impeccable skill linked (done); Stage 2 tokens drafted.
**Tasks:** 1) Run the impeccable init flow; 2) document baseline into `context/quality-baseline.md`: initial design constraints (mobile-first, ivory base, ≤300-line files), UX principles (in-flow feedback, no toasts/modals by design — DESIGN §10), a11y considerations (AA contrast pairs from DESIGN §3, focus-visible rings, 48px targets, aria-live for form feedback), responsive criteria (320–1440px, no sticky hover, no 100vh — mobile-native rules), visual quality criteria (surface hierarchy: card vs. section vs. page), and impeccable guidance notes (touch target, cramped padding, flat type hierarchy detectors); 3) run `npx impeccable detect` against the empty scaffold to see baseline noise (expect low; record count).
**Files affected:** `context/quality-baseline.md`, initial detect log inside it.
**Dependencies:** Stage 1 (repo scaffold only — noop otherwise).
**Expected result:** a written baseline reviewers + the critique stages will compare against.
**Validation:** baseline doc covers: constraints / UX principles / a11y / responsive / visual criteria / impeccable guidance — all six headings present.
**Definition of done:** Milestone 3 — quality baseline committed (alongside M2).
**Potential issues:** detect on an empty Next scaffold may flag framework defaults (e.g. pure black `body` color) — those become first-day fixes in BUILD step 4.3, not critique findings.
**Open decisions:** none.

# Stage 4 — BUILD (incremental; each step = smallest useful change + verify)
**Objective:** implement exactly the approved requirements — nothing extra.
**Prerequisites:** M1–M3 done; `context/CONTENT.md` in place.

**Step 4.1 — Project foundation.** Goal: runnable Next.js 15 TS app scaffolded to the ARCHITECTURE §13 tree. Files: `package.json`, `tsconfig.json`, `next.config.ts` (image config for hero), `eslint.config.mjs`, `prettier`, `.env.example`, `app/layout.tsx`, `app/page.tsx` (stub), `app/globals.css` (tokens from Stage 2). Verify: `pnpm dev` renders ivory page; `pnpm lint`/`typecheck` pass.

**Step 4.2 — Data layer.** Goal: schema + seed per SCHEMA.md. Files: `db/schema.ts` (households, rsvps per §3), `db/index.ts` (Neon serverless driver, server-only), `drizzle.config.ts`, migration `0000_initial_schema`, `scripts/seed.ts` (idempotent, upsert on `searchName`; generates 12-char codes via `crypto`; emits report incl. the 11 "cap unconfirmed" rows), `data/guest-list.csv` (generated from CONTENT.md §2). Verify: `pnpm drizzle-kit migrate` + `pnpm seed` against a local Neon branch; re-run seed → 0 duplicates, caps updated.

**Step 4.3 — Domain `lib/` (pure, no side-effects).** Files: `lib/validation.ts` (zod: all payloads per SCHEMA §11), `lib/deadline.ts` (Asia/Manila open/closed math; typed config with `lib/config.ts` for `{ couple, venue, schedule, story, dressCode, mapsLink, deadline }` incl. graceful TBD handling), `lib/rsvp.ts` (cap clamp + upsert semantics), `lib/mask.ts` (first-token + initial), `lib/csv.ts`, `lib/status.ts`. Verify: `vitest run` green (tests for deadline math, clamp, masking, CSV shape).

**Step 4.4 — UI primitives.** Files: `components/ui/{Section,Card,Badge,Button,Field,Stepper}.tsx`. Rules: DESIGN §7/§10 (radius 16 cards/12 inputs/9999 pills; shadows warm; focus rings 2px offset; 48px minimums). Verify: keyboard-only walk of an interactive prototype of each primitive; `impeccable detect components/`.

**Step 4.5 — Sections (server-rendered).** Files: `components/sections/{Hero,Countdown,Location,Story,Schedule,DressCode,RsvpAnchor,Footer}.tsx` + wiring in `app/page.tsx`; hero uses `assets/hero/cpcj.jpg` via `next/image` (priority, `sizes`, soft ivory gradient overlay for wordmark legibility); copy from CONTENT.md verbatim; schedule times as given; maps = link-out button. Verify: mobile 360 & 412 widths + 768/1024; Lighthouse pass spot-check.

**Step 4.6 — RSVP form island (client).** Files: `components/form/{RsvpForm,HouseholdLookup,AttendingToggle,StepperField,DietaryField,SuccessState}.tsx`, `app/actions/rsvp.ts` (server action, `ActionResult` union per ARCH §4.3). Flow per PRD §6.2–6.3: typeahead (≥2 chars, masked matches) → household card (names + allowance) → accept (steppers clamped to caps) or decline → dietary → submit → success card repeating what was recorded + "change your RSVP" CTA. No honeypot visible; hidden field included. Verify: happy path + each error reason (`closed`, `not_found`, `validation_failed`, `rate_limited`, `unavailable`) rendered per DESIGN §10; keyboard-only pass; screen-reader pass (inline `aria-live`).

**Step 4.7 — No-JS fallback.** Goal: form posts to the server action with typed name; server returns server-rendered confirmation page. Verify: disable JS → full flow completes.

**Step 4.8 — Rate limit + lookup route.** Files: `app/api/lookup/route.ts` (GET `?q=`, in-memory limiter, zod-validated query), wire the submit limiter into the action. Verify: 429 returns `{ ok:false, reason:"rate_limited" }` under burst.

**Step 4.9 — Admin.** Files: `app/admin/{page.tsx,login/page.tsx}`, `app/api/admin/export.csv/route.ts` (hmm — route stays `/admin/export.csv` per ARCH), `lib/session.ts` (HMAC cookie via `SESSION_SECRET`), `middleware.ts` (logger → security headers → robots for `/admin`). Dashboard: totals header + one-row-per-household table + dietar notes + "cap unconfirmed" badge + CSV download. Verify: wrong password → generic error; correct → cookie; CSV gated; `/robots.txt` disallows `/admin`; `noindex` header present.

**Step 4.10 — Loading/error/empty states.** Files: `loading.tsx`, `error.tsx`, `not-found.tsx` patterns where used; section empty states. Verify: each async surface has visible in-flow states (no spinners-only trades).

**Step 4.11 — Responsive + a11y sweep.** Files: tweaks across sections/components. Verify: 320px–1440px; `prefers-reduced-motion` full pass (nothing moves but opacity); focus order visual audit; AA contrast spot-check on every text/background pair from DESIGN §3.

**Expected result:** the complete v1 site, matching the approved docs 1:1.
**Validation:** functional acceptance = PRD user stories US1–US10 each manually verifiable; `pnpm lint && pnpm typecheck && vitest run`; `impeccable detect src/` reviewed (findings recorded, not silently waived); Lighthouse mobile perf ≥95, a11y ≥95 (PRD §9).
**Definition of done:** Milestone 4 — initial implementation complete.
**Potential issues:** typeahead masking + honorific normalization edge cases (e.g. surname-only search); deadline config absent → must render "Contact us for date" state gracefully without dead countdown zeros; `next/image` + 4 MB source fine at build, but confirm AVIF output.
**Open decisions:** none blocking; three TBD config slots render gracefully.

# Stage 5 — IMPECCABLE CRITIQUE
**Objective:** find problems; do NOT fix immediately.
**Prerequisites:** M4; app running locally.
**Tasks:** run the impeccable critique flow on the real page (visual hierarchy, typography, spacing, layout, consistency, mobile UX, a11y, interaction quality, responsive, content presentation, form usability, error/success states). Categorize every finding **Critical / Important / Minor**; log to `context/reviews/m5-critique.md` with file/line references and recommended fix each.
**Files affected:** `context/reviews/m5-critique.md`.
**Dependencies:** M4.
**Expected result:** concrete critique inventory.
**Validation:** every finding has: category, location, problem, evidence, recommended fix.
**Definition of done:** Milestone 5 — critique complete.
**Potential issues:** critique may surface "template-feel" risks (single-column rhythm) — flag as design notes, not redesign pressure (polish stage boundaries per user's rules).
**Open decisions:** none.

# Stage 6 — FIX (critique findings)
**Objective:** fix in strict priority order; no unrelated design changes.
**Order:** 1) functional, 2) accessibility, 3) mobile UX, 4) layout, 5) visual consistency, 6) minor polish. After each group: regression check (relevant vitest + manual flow + `impeccable detect`).
**Files affected:** whatever the critique cites.
**Validation:** all Critical/Important closed with evidence (before/after notes in `m5-critique.md`); regression suite green.
**Definition of done:** Milestone 6.

# Stage 7 — EMIL DESIGN ENGINEERING
**Objective:** interaction quality via `emil-design-eng` (+ the installed `animate`/`mobile-native` guidance where relevant).
**Tasks:** apply to the form island and success state specifically: enter≠exit easing (enter ease-out 220–300ms / exit ease-in 120–180ms), only transform/opacity, single elements animate one property at a time, buttons respond within 100ms (background/underline shift, not scale-jumping), success-state craft (staggers ≤60ms, no bounce on data-critical UI), input interaction hygiene (focus rings, error placement adjacent to field, no layout shift on error reveal), loading feel (optimistic coding where safe — submit button state, not full page), perceived performance (server-render content, images sized honestly), mobile-native fixes re-verified (inputs don't zoom at 17px body+16px inputs, no tap highlight flash, safe-area bottom for sticky Submit). Respect `prefers-reduced-motion` everywhere; motion must never distract from RSVP task (budget: ≤5 animated properties on the flow path).
**Files affected:** form components, success card, countdown digits, buttons.
**Expected result:** intentional motion, documented shortcuts per DESIGN §9.
**Validation:** reduced-motion + full-motion manual pass; `impeccable detect` clean of motion adversities; animation log `context/reviews/m7-motion.md`.
**Definition of done:** Milestone 7.

# Stage 8 — IMPECCABLE AUDIT (second pass)
**Objective:** post-design-engineering quality check; regression hunt.
**Tasks:** audit for issues introduced during Stages 6–7 (spacing drift, type inconsistencies, a11y regressions, interaction inconsistencies, visual noise, unnecessary complexity, perf, mobile usability); compare against the brief + DESIGN.md; log per file to `context/reviews/m8-audit.md` with same Critical/Important/Minor rigor.
**Validation:** no finding silent; each fixed-or-deferred with reason.
**Definition of done:** Milestone 8.

# Stage 9 — FIX (audit findings)
**Objective:** close the audit list, focused; then verify end-to-end: RSVP flow happy path, resubmit overwrite, deadline close state (test with a past-dated env override), responsive layouts, full a11y pass, regression suite.
**Definition of done:** Milestone 9.

# Stage 10 — IMPECCABLE POLISH
**Objective:** make it feel intentional — spacing, alignment, typography details, component consistency, borders/surfaces, interaction states, form details, error/success micro-states, responsive edge cases, a11y details, visual rhythm.
**Rules:** no new features; no requirement changes; no redesign. Track changes in `context/reviews/m10-polish.md`.
**Definition of done:** Milestone 10.

# Stage 11 — SHIP
**Objective:** production readiness, only after user fills the three TBD config slots (date/time/deadline).
**Checklists:**
- Functionality: submit → stored correctly (verify row); validation rejects bad counts vs. caps; error handling per reason; overwrite works; CSV matches dashboard.
- Responsive: 320/375/412/768/1024/1440 + large-screen centering; small-screen form steppers reachable one-handed.
- A11y: keyboard-only full flow; focus states; labels; contrast (verified pairs); 48px targets; reduced-motion; landmark/heading structure.
- Performance: images AVIF/WebP + correct `sizes`; fonts self-hosted subset; JS budget (form island only); Lighthouse mobile ≥95/95 verified twice.
- Security/privacy: env vars real and non-empty (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `RSVP_DEADLINE_DATE`); no client-shipped secrets; zod at boundary; dietary notes only in `/admin`; robots/noindex verified.
- Production: `vercel build` passes; prod deploy; `/api/health` OK; **final RSVP test with real household from seed on production URL**; reseed against prod DB from CONTENT.md list; admin login on prod; deadline set + auto-close verified with an earlier test value first.
**Definition of done:** all checks pass → Milestone 11 — production-ready; announce `.vercel.app` URL to the couple.

---

# Milestones (definition of done)
| # | Milestone | DoD |
|---|---|---|
| 1 | Brief approved | decisions recorded in `context/`, `CONTENT.md` + this plan committed; **user approves plan** |
| 2 | Visual direction established | DESIGN.md taste log + tokens ready; contrast pairs verified |
| 3 | Quality baseline established | `context/quality-baseline.md` complete (6 sections) |
| 4 | Initial implementation complete | US1–US10 manual pass + gates green (lint/typecheck/vitest/detect/LH) |
| 5 | Initial critique complete | `m5-critique.md` full inventory |
| 6 | Critique fixes complete | Critical/Important closed, no regression |
| 7 | Design engineering complete | motion/interaction pass per emil rules + log |
| 8 | Audit complete | `m8-audit.md` inventory |
| 9 | Final fixes complete | audit closed; end-to-end flow verified |
| 10 | Polish complete | `m10-polish.md`; no new features; cohesive rhythm |
| 11 | Production-ready | SHIP checklist fully green on production URL |

# Execution rules
1. Incremental: each BUILD step = smallest useful change + its own verification.
2. Any new blocking/important question arises → stop, ask the user, resolve, continue.
3. No scope creep: PRD non-goals list is the veto reference.
4. Code follows `RULES.md` (size limits, `ActionResult`, zod boundary, named exports, no new deps beyond the table).
5. Skills staged exactly as the sequence demands — no "design and polish" collapse; impeccable stages each produce their `context/reviews/*` artifact.
