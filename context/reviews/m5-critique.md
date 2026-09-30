# M5 — Impeccable Critique (rsvp)
**Date:** 2026-09-28 · Reviewer pass on the complete initial implementation (BUILD 4.1–4.9) · tool: `impeccable detect` (0 findings on all scans) + the taste-skill mechanical pre-flight + a design-engineer read of every component.

> Rule enforced: findings are identified ONLY here; fixes land in Stage 6 per
> the priority ladder (functional → a11y → mobile UX → layout → consistency →
> polish). Status column tracks the FIX stage.

## Critical

| # | Finding | Where | Evidence | Fix |
|---|---|---|---|---|
| C1 | Sign-out form existed as an empty placeholder — logout was NOT implemented | `app/admin/page.tsx` | stray `<form>` with only a comment | FIXED in 4.10 (`app/admin/action.ts` signOutAdmin + plain form button) |
| C2 | `timingSafeEqual` throws on unequal byte lengths — UTF-8 "Peña" password variants crashed login instead of failing safely | `lib/session.ts` | session tests caught it (27-test suite) | FIXED in 4.9 (fixed-length digest compare) |

## Important

| # | Finding | Where | Evidence | Fix |
|---|---|---|---|---|
| I1 | Combobox input had no label association | `RsvpCombobox.tsx` | a11y checklist: every control needs a label | FIXED in 4.11 (visible "Your name" label) |
| I2 | `ink-faint` (#9A917F ≈ 2.6:1 on ivory) carried FUNCTIONAL hint text — DESIGN allows it for decoration only | `Field.tsx`, `Stepper.tsx`, `RsvpCombobox.tsx` ×3 | contrast check per DESIGN §3 | FIXED in 4.11 (functional hints → `ink-soft` 4.6:1; the decorative separator in CountdownCell keeps faint) |
| I3 | Deadline state machine had no graceful pending-config UX on the guest page | was `InfoSection` | CONTENT.md kept date as open fact | FIXED when wedding date landed (TBA copy → real countdown); RSVP deadline still pending-config-open (graceful by design) |
| I4 | Security headers lack a CSP (inline styles/scripts require allowlist work) | `next.config.ts`| architecture §10 row unfilled | DOCUMENTED deferral: CSP lands at Ship (M11) with a nonce, else the RSVP form's inline action bootstrap breaks; frame-options/nosniff/referrer shipped |
| I5 | Rate limiting is per-instance in-memory — resets on cold start | `lib/rate-limit.ts` | ARCH §15 documents the trade | ACCEPTED for v1 scope (wedding traffic); revisit only if attacked |

## Minor

| # | Finding | Where | Evidence | Fix |
|---|---|---|---|---|
| m1 | Dead copy constant `rsvpFindPlaceholder` | `lib/config.ts` | grep: unused | FIXED in 4.11 (removed; placeholder shows a real example "e.g. Clarisse Calamiong") |
| m2 | Hydration error: FM styles differed server vs client on first paint | `RsvpPanel.tsx` | user-reported console error | FIXED (`f035b3c`: first paint plain, motion post-interaction) |
| m3 | `pgEnum` unused in schema (column uses text enum) | `db/schema.ts` | migration inspect | DEFER to polish: align to pgEnum for a real CHECK constraint or drop the type — one-line change either way |
| m4 | Admin table responds poorly at very narrow widths | `app/admin/page.tsx` | 320px sweep in plan | CHECK at 4.11/ship (table scrolls horizontally by design; verify no page-level x-scroll leaks) |
| m5 | Story section is a single text block — visually plain next to other sections | `StorySection.tsx` | editorial rhythm review | POLISH stage candidate: warm-tinted quote-style treatment w/o new ornament |
| m6 | `submittedAt` stays correct on overwrite (verified) — note the "Responded" column shows LATEST time | admin | SCHEMA §3.2 latest-wins | none (documented) |
| m7 | `searchName` uniqueness means two guests spelled identically collide at seed | `content/CONTENT.md` | 63/63 unique today | none (documented rule; admin flags only cap-unconfirmed) |

## Mechanical pre-flight results (taste DTF §14 + DESIGN §14 log)
- Em-dash/en-dash in served HTML: **0** (checked at output level, twice)
- Eyebrow count: **0** decorative (badge level reserved for semantics) ✓
- Color consistency: single interactive accent (sage) ✓ — gold decorative only ✓
- Shape consistency: card 16 / input 12 / button pill + concentric bezel documented ✓
- Hero stack: names + 1 subtext + 1 CTA + photo ✓ ; top padding ≤ pt-24 ✓; min-h-[100dvh] ✓ (no h-screen anywhere)
- CTA single-intent: one "RSVP" hero anchor + form submit ("Send RSVP") — different intents (nav vs submit) ✓
- Form contrast: labels/hints on `ink-soft` after I2 ✓; error pair danger-on-card ✓
- All content strings verified against CONTENT.md — no invented wedding facts ✓
- Status dots: only where real semantic state lives (admin badges, success badge) ✓

## User review findings (2026-09-28, from the couples' hands-on pass) — all FIXED in M6 commit

| # | Finding | Fix |
|---|---|---|
| U1 | Stepper +/− glyphs not centered in the 48px buttons | `flex items-center justify-center` on the buttons (Stepper rewrite) |
| U2 | Children stepper rendered even when the invitation covers no kids | Children stepper only when `maxKids > 0` (hidden kids input stays for submission) |
| U3 | "Adults of x / Children of x" wording | plain labels; the allowance lives only in the "This invitation covers…" summary line (Stepper helper removed) |
| U4 | Dietary notes shown after "Regretfully declines" | field only in the accepted branch; server stores `dietary = null` on declines |
| U5 | No guest search on a 63-row admin table | `AdminTable` client filter across name/status/dietary with a "showing N of 63" caption; totals above always count ALL guests |
| U6 | (same pass) steppers' "+" and "−" as light hairline Phosphor | covered by U1 centering pass |

## User review round 2 (2026-09-30) — all FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U7 | No header-level filter on the admin table | Status chips above the table: All / Pending / Accepted / Declined (aria-pressed toggles), combining with the name search |
| U8 | "Household" column header | Renamed to "Name" |
| U9 | Search swept dietary notes + status words; label said "Search guests" | Search is name-only (single lowercase substring test — the fastest approach at 63 rows); placeholder now "Search by name" |

## User review round 3 (2026-09-30) — all FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U10 | Returning guests saw a blank form instead of their previous answer | Lookup now LEFT-JOINs the household's recorded response; picking a household pre-fills attending/counts/dietary (clamped to current caps) and shows "Your earlier RSVP on {date}: …" |
| U11 | RSVP form inside a card felt boxed | Card removed: the flow renders free on the section surface, headline moved into the section (matching sibling sections), state transitions unchanged |

## User review round 4 (2026-09-30) — all FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U12 | Hero photo still boxed in the wrapper | Double-bezel dropped; photograph free on ivory with radius + warm shadow only |
| U13 | Admin dashboard not real-time when guests respond | visibility-aware 15s polling via `router.refresh()` (server components re-render with fresh rows) + "Refresh now" + last-checked stamp — KISS trade recorded in ARCHITECTURE §9.4 (no SSE infra) |
| U14 | Mobile-first gaps in the admin | stats 2-up on phones; stacked guest cards below `sm` (name + badge + invitation + counts + dietary + time) instead of the 7-col x-scroll table; search/chips reflow on mobile |

## User review round 5 (screenshot, 2026-09-30) — FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U15 | Top of the dashboard not optimized on phones (title/actions mis-stack, refresh row wrapping, "5 adults + 1 children" grammar) | Header redesigned: title text-h2 on mobile with both actions pinned right on one compact line; "Guests coming: N guests" stat (grammar-safe); refresh row is one line (truncating caption + compact "Refresh" button) |

## User review round 6 (2026-09-30) — all FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U16 | Guest search performance | Households list cached in server memory (60s TTL, re-seeded rarely) + pure RAM ranker `lib/search-index.ts` (prefix > word-prefix > contains, length, alphabetical — 6 new unit tests). Per keystroke the server does zero household SQL; one small live query joins the ≤8 finalists' recorded RSVPs for the pre-fill |
| U17 | Masked last names ("Evelyn C.") | Full names shown in type-ahead + selection, per the couple's explicit call; PRD §6.2 + ARCHITECTURE §10 privacy rows updated (rate limits + honeypot unchanged); `lib/mask.ts` + its tests removed (unused code purged per RULES §5.6) |

## User review round 7 (2026-09-30) — FIXED in M6

| # | Finding | Fix |
|---|---|---|
| U18 | Action buttons not mobile-first ("Sign out" clipped at the right edge) | On phones "Export CSV" + "Sign out" stack as full-page buttons (grid-cols-2, 48px); from `sm` they return to the single header line |
| U19 | Spacing out of proportion (mixed mt-5/mt-6 margins) | Blanket rhythm: the dashboard is one `gap-6` column — header, stats, live row, table — so every block separates identically; AdminTable root no longer carries its own margin |

## Scan log

- `impeccable detect app components lib`: 0 findings (run at 4.4/4.5, 4.6 gates, 4.9)
- `impeccable detect` verification fixture (Stage 3): 4/4 planted violations caught
