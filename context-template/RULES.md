# Coding Rules — {{PROJECT_NAME}}
**Project:** {{PROJECT_NAME}} · **Applicable to:** {{CLIENT_DIR}}, {{SERVER_DIR}}, and any other code dirs
**Enforcement:** ESLint · Pre-commit hooks · PR review
**Language:** {{LANGUAGE}} · **Version:** {{X.Y}} · **Status:** {{Draft}}

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

> **Fill:** Adapt the language-specific notes. JavaScript/TypeScript has no native
> interfaces; other languages (Java/Kotlin/C#) do — adjust examples accordingly.

### 2.1 Single Responsibility Principle (SRP)
**Each module MUST have exactly one reason to change.**

> *(example)*
> ```javascript
> // ❌ BAD: one class does entities AND emails
> class {{Entity}}Service {
>   async create(data) { /* ... */ }
>   async sendNotification(entity) { /* ... */ }
> }
> // ✓ GOOD: split
> class {{Entity}}Service { async create(data) { /* ... */ } }
> class NotificationService { async send(entity) { /* ... */ } }
> ```
> **SRP check:** describe the module in one line; if it contains "and"/"or", split it.

### 2.2 Open-Closed Principle (OCP)
**Modules MUST be open for extension but closed for modification.** Prefer adding, not changing.

> *(example)* Registry/strategy map over a `switch` that you must edit for each new case.

### 2.3 Liskov Substitution Principle (LSP) — *Guiding*
**A consumer MUST work with any subtype of its expected input.**

> *(example)* Components/services accepting a shared props/return shape are
> interchangeable; keep response shapes consistent.

### 2.4 Interface Segregation Principle (ISP) — *Guiding*
**No module SHOULD depend on methods it does not use.** Keep props/params lean.

### 2.5 Dependency Inversion Principle (DIP)
**High-level modules MUST NOT depend on low-level modules; both depend on abstractions.** Inject side-effectful dependencies.

> *(example)*
> ```javascript
> // ✓ GOOD: inject mailer, logger, time provider
> class ReminderService {
>   constructor(mailer, logger, timeProvider) { ... }
> }
> ```
> **Exception:** trivial pure utilities (date/string helpers) may be imported directly.

---

## 3. DRY — The 4x Rule (Business Logic Only)

**When identical/near-identical *business logic* appears 4+ times, it MUST be
extracted into a shared helper/service.** Count resets after extraction.

### 3.1 What Counts

| Counts | Does NOT Count |
|---|---|
| Service-layer logic | UI-only constants (colors, breakpoints) |
| Controller request-handling patterns | Seed/scaffold/stub code |
| Domain computation (status, date math) | Schema/type definitions |
| Email/template construction | Import/export statements |
| Error-handling patterns | Comments/docs |

### 3.2 Burn-Down Behavior

| Occurrence | Action |
|---|---|
| 1st–3rd | Duplication acceptable |
| 4th | **MUST** extract; remove all 4 copies |

### 3.3 Expected Extraction Targets
> **Fill:** List patterns you expect to hit 4x in this project. *(example)*
> | Pattern | Likely location | Extract to |
> |---|---|---|
> | {{STATUS}} derivation | multiple services | `lib/{{compute-status}}.js` |
> | {{OWNER_FIELD}} scoping | every service | base service / query helper |

### 3.4 The Client/Server Exception
> **Fill:** If you duplicate validation/types between client and server (no shared
> types package), state that explicitly and when you'd revisit it.

---

## 4. KISS Principle

### 4.1 Smallest Viable Implementation
**Every new function MUST start as the simplest correct implementation.** Add
complexity only when a concrete requirement demands it.

### 4.2 No Premature Configuration
**Do not add config flags/params/callbacks until a second real use case exists.**

### 4.3 Explicit Over Clever
> *(example)* Prefer a readable `if/else if` chain over an indexed ternary array.

### 4.4 Avoid Over-Nesting
**Nesting depth MUST NOT exceed 3 levels** (excluding try/catch and class boundaries). Use early returns.

### 4.5 Prefer Pure Functions
**Functions computing derived state MUST be pure** — same input, same output, no side effects.

---

## 5. Code Quality Rules

### 5.1 Naming Conventions

| Category | Convention | Example |
|---|---|---|
| Variables / functions | `camelCase` | `sendReminder`, `dueDate` |
| Classes / constructors | `PascalCase` | `{{Entity}}Service` |
| Constants (project-wide) | `UPPER_SNAKE_CASE` | `MAX_LEAD_DAYS` |
| Files — modules | `kebab-case` | `{{entity}}.service.js` |
| Files — components | `PascalCase` | `{{Entity}}Card.jsx` |
| Booleans | `is`/`has`/`should` prefix | `isVerified`, `shouldNotify` |

> **Fill:** Adjust casing/file conventions to your language/framework.

### 5.2 Size Limits

| Metric | Limit | Enforced By |
|---|---|---|
| Function length | **MUST** ≤ 50 lines | `max-lines-per-function` |
| File length | **MUST** ≤ 300 lines | `max-lines` |
| Function parameters | **SHOULD** ≤ 4 | `max-params` |
| Cyclomatic complexity | **MUST** ≤ 10 | `complexity` |
| Nesting depth | **MUST** ≤ 3 | `max-depth` |
| Line length | **SHOULD** ≤ 100 | formatter |

### 5.3 Imports & Exports
- **Named exports** for everything (no default exports).
- Import order: (1) builtins, (2) packages, (3) internal — separated by blank lines.
- No deep relative path soup; use an alias (`@/` / `src/`-relative).

### 5.4 Error Handling
- **MUST** use custom error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`).
- **MUST NOT** throw raw strings, generic `Error`, or status codes.
- **MUST NOT** swallow errors — log and rethrow, or handle properly.

### 5.5 Asynchronous Code
- **MUST** use `async/await`. No raw `.then()`/`.catch()` chains.
- **MUST** use `Promise.all` for independent parallel work.

### 5.6 Dependencies
- **MUST** use latest stable versions at install time.
- **MUST NOT** use deprecated APIs/packages; check `npm outdated` / `depcheck` per milestone.
- **MUST** remove unused dependencies immediately.

---

## 6. Anti-Patterns to Avoid

### 6.1 Fat Controllers
> *(example)* Controllers must delegate to services, never call models directly.

### 6.2 Services Leaking HTTP Concerns
> *(example)* Services return data; controllers format responses and pick status codes.

### 6.3 Cross-Service Model Access
> *(example)* A service must not reach into another domain's model; orchestrate in the controller/use-case.

### 6.4 Comments That Parrot Code
> *(example)* Comment WHY, not WHAT.

### 6.5 Negated Boolean Props
> *(example)* `isEnabled` not `isNotEnabled`.

### 6.6 Magic Strings / Numbers
> *(example)* Constants in `UPPER_SNAKE_CASE`; secrets from env only. Never hardcode secrets.

---

## 7. Enforcement & Tooling

### 7.1 Lint Configuration
> **Fill:** Place in each package's config file. *(example — adjust rules to your stack)*
> ```javascript
> module.exports = {
>   env: { node: true, es2024: true },
>   extends: ['eslint:recommended', 'prettier'],
>   rules: {
>     'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
>     'max-lines-per-function': ['warn', { max: 50 }],
>     'max-params': ['warn', { max: 4 }],
>     'complexity': ['warn', { max: 10 }],
>     'max-depth': ['warn', { max: 3 }],
>     'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
>     'no-console': ['error', { allow: ['warn', 'error'] }],
>     'no-var': 'error', 'prefer-const': 'error',
>     'no-throw-literal': 'error',
>   },
> }
> ```

### 7.2 Pre-commit (lint-staged)
> **Fill:** *(example)* `npx lint-staged` running `eslint --fix` + formatter on staged files.

### 7.3 PR Review Checklist

| # | Check |
|---|---|
| 1 | No service calls another service's model directly |
| 2 | No business logic in controllers |
| 3 | Side-effectful deps injected, not imported directly |
| 4 | No function > 50 lines |
| 5 | No file > 300 lines |
| 6 | No magic strings/numbers |
| 7 | No deprecated APIs/packages |
| 8 | No `console.log` (warn/error allowed) |
| 9 | Functions pure where possible |
| 10 | No 4th un-extracted duplication of business logic |
| 11 | Custom error classes used |
| 12 | Values from env validated with defaults or explicit fail |

### 7.4 CI Gate
> **Fill:** *(example)* `npm ci` → `depcheck` → `eslint` → `prettier --check` → `npm test` → `npm outdated`.

---

## 8. Quick Reference Card

| Principle | TL;DR |
|---|---|
| **SRP** | One reason to change per module |
| **OCP** | Add new behavior, don't edit old code |
| **LSP** | Consumers work with any implementation |
| **ISP** | Don't depend on what you don't use |
| **DIP** | Inject side-effects (mailer, time, logger) |
| **DRY** | Extract at 4th business-logic repetition |
| **KISS** | Start simple; add only for a concrete need |
