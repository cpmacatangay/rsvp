# Coding Rules — rsvp
**Project:** rsvp · **Applicable to:** `app/`, `components/`, `lib/`, `db/`, `scripts/`
**Enforcement:** ESLint (next/core-web-vitals) · Prettier · PR review · `impeccable detect` gate
**Language:** TypeScript (strict) · **Next.js 15 / React 19** · **Version:** 0.1 · **Status:** Draft

---

## 1. Purpose & Scope

Non-negotiable coding rules. Every contributor MUST follow these. PRs that
violate them WILL be rejected.

### Severity Levels (RFC 2119)

| Term | Meaning | Enforced By |
|---|---|---|
| **MUST** | Absolute requirement | CI / PR review gate |
| **SHOULD** | Strongly recommended; exception needs rationale | PR review |
| **MAY** | Optional guidance | Self-enforced |

---

## 2. SOLID Principles (Pragmatic Adaptation)

### 2.1 Single Responsibility Principle (SRP)
**Each module MUST have exactly one reason to change.**

Example split used here: deadline logic (`lib/deadline.ts` — pure), RSVP
domain (`lib/rsvp.ts` — upsert rules), validation (`lib/validation.ts` — zod),
data access (`db/` — Drizzle only). **SRP check:** describe the module in one
line; if it contains "and", split it.

### 2.2 Open-Closed Principle (OCP)
**Modules MUST be open for extension but closed for modification.** Outcome
states are closed unions (`ActionResult` reasons); new behaviour adds new
variants, not renamed strings across files.

### 2.3 Liskov Substitution Principle (LSP) — *Guiding*
Client fallback behaviour MUST work against the same `ActionResult` contract
as the interactive path — no-JS and JS flows get identical semantics.

### 2.4 Interface Segregation Principle (ISP) — *Guiding*
Components MUST receive only the props they render. Form island gets its own
narrow props type, not the whole page data.

### 2.5 Dependency Inversion Principle (DIP)
**High-level modules MUST NOT depend on low-level modules; both depend on
abstractions.** Side effects are injected:

```ts
// ✓ GOOD: the service takes time + data access, never imports them as globals
export async function submitRsvp(payload, deps: { db, now: () => Date, deadline: Date })
```
Exception: trivial pure utilities (string/date helpers) may be imported
directly.

---

## 3. DRY — The 4x Rule (Business Logic Only)

**When identical/near-identical *business logic* appears 4+ times, it MUST be
extracted into a shared helper/service.** Count resets after extraction.

### 3.1 What Counts

| Counts | Does NOT Count |
|---|---|
| Deadline math reuses | UI-only constants (colors, breakpoints) |
| Cap-clamp logic | Tailwind utility sequence |
| Validation rules | `z.infer` type re-exports |
| Masking rules | Import/export statements |
| CSV construction | Comments/docs |

### 3.2 Burn-Down Behavior

| Occurrence | Action |
|---|---|
| 1st–3rd | Duplication acceptable |
| 4th | **MUST** extract; remove all 4 copies |

### 3.3 Expected Extraction Targets
| Pattern | Likely location | Extract to |
|---|---|---|
| Deadline gating | page render + action + admin | `lib/deadline.ts` |
| Cap clamp | form + action | `lib/rsvp.ts` |
| Name search ranking | lookup | `lib/search-index.ts` |
| Status → label/color | admin + confirmation | `lib/status.ts` |

### 3.4 The Client/Server Exception
Client form types are *derived* from the server's zod schemas (`z.infer`) in a
client-safe module — one validator, zero drift. If a schema ever needs
server-only constraints (seed-only fields), keep those in a server file and
share a base schema instead of duplicating the whole shape.

---

## 4. KISS Principle

### 4.1 Smallest Viable Implementation
**Every new function MUST start as the simplest correct implementation.** This
project's default to avoid: premature caching tables, "generic" form builders,
feature flags for a single-user admin.

### 4.2 No Premature Configuration
**Do not add config flags/params/callbacks until a second real use case exists.**

### 4.3 Explicit Over Clever
Prefer readable `if/else` over ternary chains or clever generic helpers.

### 4.4 Avoid Over-Nesting
**Nesting depth MUST NOT exceed 3 levels** (excluding try/catch). Use early
returns.

### 4.5 Prefer Pure Functions
Derived state (deadline state, totals, masked names, clamped counts) MUST be
pure functions — same input, same output, no side effects — because those are
exactly what vitest covers per `PRD.md` §7.

---

## 5. Code Quality Rules

### 5.1 Naming Conventions

| Category | Convention | Example |
|---|---|---|
| Variables / functions | `camelCase` | `maxAdults`, `submitRsvp` |
| Components / React | `PascalCase` | `RsvpForm.tsx` |
| Constants (project-wide) | `UPPER_SNAKE_CASE` | `MAX_DIETARY_CHARS` |
| Files — lib/db/scripts | `kebab-case` | `deadline.ts`, `guest-list.csv` |
| Files — components | `PascalCase` | `RsvpForm.tsx` |
| Files — App Router | Next.js reserved names | `page.tsx`, `route.ts`, `actions.ts` |
| Booleans | `is`/`has`/`should` prefix | `isClosed`, `hasDietaryNote` |

### 5.2 Size Limits

| Metric | Limit | Enforced By |
|---|---|---|
| Function length | **MUST** ≤ 50 lines | eslint `max-lines-per-function` |
| File length | **MUST** ≤ 300 lines | eslint `max-lines` (components ≤ 150 SHOULD) |
| Function parameters | **SHOULD** ≤ 4 | eslint `max-params` (deps objects count as 1) |
| Cyclomatic complexity | **MUST** ≤ 10 | eslint `complexity` |
| Nesting depth | **MUST** ≤ 3 | eslint `max-depth` |
| Line length | **SHOULD** ≤ 100 | Prettier |

### 5.3 Imports & Exports
- **Named exports** for everything (no default exports) — except Next.js
  reserved `page.tsx`/`layout.tsx`/`route.ts` shapes which the framework owns.
- Import order: (1) react/next, (2) packages, (3) internal — separated by
  blank lines. Prettier + `eslint-plugin-import` order rules enforce.
- No deep relative soup: `~/` alias → project root, `@/` not used.

### 5.4 Error Handling
- **MUST** use the closed `ActionErrorReason` union + `ActionResult` shape;
  **MUST NOT** throw raw strings or leak stack traces to the client.
- **MUST NOT** swallow errors — log (pino, with request-id) and return the
  `unavailable` outcome.
- Client renders are never allowed to die on missing data: every section
  defines its empty state.

### 5.5 Asynchronous Code
- **MUST** use `async/await`. No raw `.then()` chains.
- **MUST** use `Promise.all` for independent parallel work (e.g. the admin
  totals query).

### 5.6 Dependencies
- **MUST** use latest stable versions at install time; remove unused deps
  immediately.
- Justified set only (see `ARCHITECTURE.md` §14): next, react, Tailwind,
  drizzle, zod, pino, motion, `@phosphor-icons/react`. Anything beyond needs
  one review line of rationale.
- **MUST NOT** introduce a UI kit (MUI, shadcn blocks) — this design is
  token-driven; kit defaults would fight it.

---

## 6. Anti-Patterns to Avoid

### 6.1 Fat Components/Actions
UI renders; actions orchestrate; `lib/` decides. No business rule inline in a
component or inside a server action body.

### 6.2 Services Leaking HTTP Concerns
Services return domain results; actions/handlers map them to HTTP statuses
(§4.3 `mapErrorToResponse` is the only place status codes are chosen).

### 6.3 Cross-Module Model Access
The admin CSV builder must not hand-roll DB queries; it goes through the same
service read the dashboard uses.

### 6.4 Comments That Parrot Code
Comment WHY, not WHAT.

### 6.5 Negated Boolean Props
`isClosed`, not `isNotOpen`.

### 6.6 Magic Strings / Numbers
Enums + UPPER_SNAKECase constants; env values validated at boot (fail fast on
missing `DATABASE_URL`/`ADMIN_PASSWORD`, with a honest error). Never hardcode
the deadline twice — `RSVP_DEADLINE_DATE` is read by `lib/deadline.ts` only.

---

## 7. Enforcement & Tooling

### 7.1 Lint Configuration
`eslint.config.mjs` = `next/core-web-vitals` + `eslint:recommended` +
size rules from §5.2 + `no-console` (`warn`/`error` allowed) +
`no-throw-literal`. Prettier runs last (`prettier` config: 100 chars,
single quotes, trailing commas).

### 7.2 Pre-commit
`lint-staged`: eslint --fix + prettier on staged TS/TSX/MD.

### 7.3 PR Review Checklist

| # | Check |
|---|---|
| 1 | No DB access outside `db/` + server-only modules |
| 2 | No business logic in components or action bodies |
| 3 | Side-effectful deps injected (`now`, `db`) |
| 4 | No function > 50 lines / file > 300 lines |
| 5 | No magic strings — deadlines, statuses, caps from `lib/` |
| 6 | New payload → new/updated zod schema, client derives types |
| 7 | Errors `ActionResult`-shaped, logged with request-id |
| 8 | `motion-reduce` present on any added animation |
| 9 | `npx impeccable detect` clean or findings consciously waived |
| 10 | Env additions documented in `.env.example` + `ARCHITECTURE.md` §7.2 |

### 7.4 CI Gate
`pnpm lint` → `pnpm typecheck` → `vitest run` → `npx impeccable detect app components lib`
(0 findings, or waived with a note) → Lighthouse mobile (perf ≥ 95, a11y ≥ 95) →
`vercel build` (deploy preview).
Tooling note: `impeccable` was briefly unavailable (its skill had been linked
from a temp checkout that Windows cleaned; the official bundle endpoint had
also been 404). Officially reinstalled 2026-10-07 via
`npx impeccable install -y --no-hooks` into stable skill roots and restored as
a gate here. It immediately earned the reinstall by flagging the curtain's
4px one-sided gold border as a side-tab tell, now fixed with a gradient trim
(v1.2.1).

---

## 8. Quick Reference Card

| Principle | TL;DR |
|---|---|
| **SRP** | One reason to change per module |
| **OCP** | Add new behavior, don't edit old code |
| **LSP** | No-JS path obeys the same contract as the JS path |
| **ISP** | Lean component props |
| **DIP** | Inject `db`/`now`; never import side effects deep down |
| **DRY** | Extract at 4th business-logic repetition |
| **KISS** | Start simple; add only for a concrete need |
