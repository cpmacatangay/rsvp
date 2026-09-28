# Product Requirements Document
## {{PROJECT_NAME}} — {{ONE_LINE_DESCRIPTION}}
**Project:** {{PROJECT_NAME}} · **Version:** {{X.Y}} · **Status:** {{Draft}} · **Updated:** {{DATE}}

---

## 1. Problem & Context

> **Fill:** Two or three sentences. What pain does this solve? Who feels it today
> and how do they cope without this product?

---

## 2. Goals & Non-Goals

### Goals ({{MVP|v1}})

> **Fill:** Numbered, outcome-oriented goals. Prefer measurable outcomes over
> feature lists. *(example)*
>
> 1. Let a user sign up and manage their own {{CORE_ENTITY}} records.
> 2. Send {{CHANNEL}} reminders before a deadline.

### Non-Goals (explicitly deferred)

> **Fill:** What you are *not* building, to prevent scope creep. *(example)*
>
> - Multi-user/team collaboration
> - Mobile apps
> - Public API

### Later phases (now in-scope)

> **Fill:** Anything you've pulled forward or deferred. *(delete if N/A)*

---

## 3. Project Scope

| In Scope ({{MVP|v1}}) | Out of Scope (later) |
|---|---|
| {{FEATURE_1}} | {{DEFERRED_1}} |
| {{FEATURE_2}} | {{DEFERRED_2}} |

---

## 4. Users & Personas

**Primary persona — "{{PERSONA_NAME}}":**
> **Fill:** Who uses this daily? Age, comfort level, pain points, what they need.
> *(example)* "A household owner with 1–5 records. Wants quick setup and reliable nudges."

**Secondary (later) — {{PERSONA_NAME}}:**
> **Fill:** *(delete if N/A)*

---

## 5. User Stories

> **Fill:** Group by epic. Use the `US-n` numbering so requirements can reference them.
> *(example)*
>
> *Auth*
> - US1: As a new user, I can sign up with {{METHOD}} and receive a confirmation.
> - US2: As a returning user, I can log in and receive a {{TOKEN_KIND}} session.
>
> *{{CORE_ENTITY}} Management*
> - US3: As a user, I can create a {{CORE_ENTITY}}.
> - US4: I can edit or delete it.
>
> *{{NOTIFICATIONS_OR_JOBS}}*
> - US5: I can configure {{SETTING}}.

---

## 6. Functional Requirements

### 6.1 Authentication & Authorization
> **Fill:** Signup/login method, hashing, session/token model, protected routes,
> data scoping rule. *(example)* "All routes except `/auth/*` protected; data scoped to `{{OWNER_FIELD}}`."

### 6.2 {{CORE_ENTITY}} Management
> **Fill:** CRUD endpoints, field summary, soft-cap, delete semantics.

### 6.3 {{SECONDARY_ENTITY_OR_JOB}}
> **Fill:** Business rules, derived state, scheduling. *(delete if N/A)*

### 6.4 Background Jobs / Automation
> **Fill:** Scheduler, trigger, idempotency approach, retry policy.

### 6.5 Notifications
> **Fill:** Channels (email/push/SMS), templates, unsubscribe.

### 6.6 Main View / Dashboard
> **Fill:** Primary screen aggregation, grouping, statuses.

---

## 7. Technical Requirements

> **Fill:** Stack is deliberately unspecified — choose per project. One row per decision.

| Area | Decision | Notes |
|---|---|---|
| Frontend framework | {{FRONTEND_FRAMEWORK}} | |
| Frontend state/data | {{STATE_LIB}} | |
| Styling | {{STYLING}} | |
| Backend runtime | {{RUNTIME}} | |
| Backend framework | {{BACKEND_FRAMEWORK}} | |
| Validation | {{VALIDATION_LIB}} | |
| Database | {{DB}} | hosted: {{DB_HOST}} |
| Logging | {{LOGGER}} | |
| Error tracking | {{ERROR_TRACKER}} | |
| Testing | {{TEST_RUNNER}} | coverage target: {{COVERAGE_%}} |
| Scheduling | {{SCHEDULER}} | |

### Security & Compliance
> **Fill:** Password hashing cost, secret handling, GDPR/retention, CSP, XSS posture.

### Dev Tooling
> **Fill:** Lint/format, pre-commit hooks, local env (compose/containers), seed script.

---

## 8. Data Model (high-level)

> **Fill:** Sketch entities and relationships. Full detail lives in `SCHEMA.md`.
> *(example)*
> ```
> User { _id, email, passwordHash, prefs, createdAt }
> {{ENTITY}} { _id, {{OWNER_FIELD}}→User, name, dueDate, createdAt }
> ```

---

## 9. Success Metrics

> **Fill:** Outcome metrics with targets. *(example row shown — delete when done)*

| Metric | Target ({{90}} days post-launch) | Notes |
|---|---|---|
| Activation rate | ≥ {{50}}% of signups do {{KEY_ACTION}} within 24h | proxy for core value |
| {{METRIC_2}} | {{TARGET}} | {{NOTE}} |

---

## 10. Milestones

> **Fill:** Week-by-week build plan. *(example)*

| Week | Focus | Deliverables |
|---|---|---|
| Wk 1 | Scaffolding | Repo layout, CI skeleton, local dev env, README |
| Wk 2 | {{CORE_ENTITY}} + auth | Signup/login, {{CORE_ENTITY}} CRUD |
| Wk 3 | {{SECONDARY_FEATURE}} | |
| Wk 4 | Automation/notifications | Scheduler, {{CHANNEL}} delivery |
| Wk 5 | Main view & polish | Dashboard, loading/empty/error states |
| Wk 6 | Hardening & deploy | Rate limits, secrets, deploy + smoke test |
