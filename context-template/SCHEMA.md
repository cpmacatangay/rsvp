# Data Schema — {{PROJECT_NAME}}
**Project:** {{PROJECT_NAME}} · **Database:** {{DB_ENGINE}} · **ODM/ORM:** {{ODM_ORM}} · **Version:** {{X.Y}} · **Status:** {{Draft}} · **Updated:** {{DATE}}

---

## 1. Schema Overview

> **Fill:** One row per entity/collection/table. "Retention" = how long rows live.

| Entity | Purpose | Avg Size | Retention |
|---|---|---|---|
| `{{ENTITY_1}}` | {{PURPOSE}} | ~{{N}} B | {{PERMANENT\|TTL\|SOFT_DELETE}} |
| `{{ENTITY_2}}` | {{PURPOSE}} | ~{{N}} B | {{...}} |

---

## 2. Entity-Relationship Diagram

> **Fill:** Replace with your own. Keep the mermaid `erDiagram` syntax; see
> https://mermaid.js.org/syntax/entityRelationshipDiagram.html
> *(example)*

```mermaid
erDiagram
    USER ||--o{ {{ENTITY}} : "1 to many"
    USER {
        string id PK
        string email "unique, indexed"
    }
    {{ENTITY}} {
        string id PK
        string ownerId FK "ref: User"
        string name
        date   dueDate
    }
```

### Denormalization Notes
> **Fill:** Any intentionally duplicated fields (e.g. `{{OWNER_FIELD}}` copied onto
> child entities to avoid joins), and the tradeoff. *(delete if none)*

---

## 3. Per-Entity Schemas

> **Fill:** Repeat this block per entity. *(example below — replace)*

### 3.1 `{{ENTITY_1}}`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `_id` | {{ID_TYPE}} | auto | auto | — | Primary key |
| `{{FIELD}}` | {{TYPE}} | yes | — | {{CONSTRAINT}} | {{DESC}} |

**Schema definition:**
> **Fill:** Paste the actual schema in your ODM/ORM/migration DSL. *(example)*
> ```javascript
> const schema = new Schema({
>   ownerId: { type: ObjectId, ref: 'User', required: true, index: true },
>   name: { type: String, required: true, maxlength: 100 },
> })
> ```

### 3.2 `{{ENTITY_2}}`
> **Fill:** Repeat the table + schema block above.

---

## 4. Relationships & References

| From | To | Via | Nature | Cascade |
|---|---|---|---|---|
| `{{A}}.{{FK}}` | `{{B}}._id` | {{ref/join}} | {{1:1\|1:N\|N:M}} | {{delete behavior}} |

### Cascade / Delete Rules
> **Fill:** What happens to children on parent delete? Soft vs hard delete policy.

### Join / Populate Patterns
> **Fill:** Which queries join eagerly vs lazily, and why.

---

## 5. Indexes & Constraints

> **Fill:** Per entity. *(example)*

### 5.1 `{{ENTITY_1}}`

| Index | Fields | Unique | Purpose |
|---|---|---|---|
| `uq_{{field}}` | `{ {{field}}: 1 }` | Yes | {{reason}} |
| `idx_{{owner}}` | `{ {{OWNER_FIELD}}: 1 }` | No | {{reason}} |

---

## 6. Data Access & Scoping (Multi-tenancy)

> **Fill:** If data is user-scoped, document the pattern. In document DBs with no
> native row-level security, scoping is enforced at the application layer.

### The Pattern
> **Fill:** *(example)* "Every query returning user data MUST include `{{OWNER_FIELD}}: <current-user>`."

### Enforcement Points

| Layer | Enforcement | Bypassable? |
|---|---|---|
| Route/Middleware | {{AUTH_GATE}} | No |
| Service | Every method accepts `{{OWNER_FIELD}}` and passes it to every query | No |
| Database | {{NONE\|RLS\|POLICIES}} | {{...}} |

---

## 7. Migration Strategy

> **Fill:** Choose a tool or state "none yet". Generic conventions below.

### 7.1 File Format
> **Fill:** Use an up/down pair per migration, e.g.:
> ```javascript
> export async function up(db) { await db.collection('{{entity}}').createIndex({ email: 1 }, { unique: true }) }
> export async function down(db) { await db.collection('{{entity}}').dropIndex({ email: 1 }) }
> ```

### 7.2 Naming Convention
```
YYYYMMDDHHMMSS_description
```
> **Fill:** *(example)* `202607160001_initial-schemas`, `202608010000_add-{{field}}`

### 7.3 Running & CI/CD
> **Fill:** Commands (`migrate up` / `down` / `status`) and when migrations run
> relative to deploy.

---

## 8. Seed Data

> **Fill:** Demo data seeder. *(example)*
> ```javascript
> const demo = await {{Entity}}.create({ email: 'demo@example.com', ... })
> ```
> **Run:** `{{npm run seed:demo}}`

---

## 9. TTL & Cleanup

### 9.1 {{LEDGER/LOG}} TTL
> **Fill:** Any auto-expiring collections and their retention window. *(delete if N/A)*

### 9.2 Soft-Delete Purge
> **Fill:** Background job that hard-deletes rows soft-deleted > N days. *(delete if N/A)*

### 9.3 Account Deletion (GDPR / compliance)
> **Fill:** Immediate hard-purge of all user-scoped data. *(delete if N/A)*

---

## 10. Backup & Recovery

### 10.1 Production
> **Fill:** Managed backups, cadence, or a documented gap.

### 10.2 Local Development
> **Fill:** Dump/restore commands for the local database.

---

## 11. Validation Rules Cross-Reference

> **Fill:** If DB-layer and API-layer validation coexist, map them so they don't
> drift. *(example)*

| Field | {{DB}} boundary | {{API}} boundary |
|---|---|---|
| `email` | `maxlength: 255` | `{{z.string().email().max(255)}}` |
| `{{field}}` | `min: 1, max: {{N}}` | `{{z.number().int().min(1).max(N)}}` |

**Principle:** DB validation is the last line of defense; API validation catches
bad input earlier and produces friendlier errors (and is reused by the client).
