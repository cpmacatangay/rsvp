# Project Context Template

A reusable, stack-agnostic set of planning documents for starting a new software
project. Copy this folder into your new repo as `context/` and fill it in.

## What's in this folder

| File | Purpose | When to write |
|---|---|---|
| `PRD.md` | What you're building and why (requirements, user stories, metrics) | Start here |
| `SCHEMA.md` | Data model: entities, fields, relationships, indexes, migrations | After PRD scope is clear |
| `ARCHITECTURE.md` | System design: tiers, patterns, data flow, deployment | Alongside SCHEMA |
| `DESIGN.md` | Visual system: brand, colors, type, components, accessibility | Parallel to PRD |
| `RULES.md` | Non-negotiable coding standards (mostly pre-filled defaults) | Skim first, tune last |
| `MOBILE.md` | Optional native/mobile client module | Only if you ship a mobile app |

## How to use

1. Copy this folder to your new project: `cp -r context-template <project>/context`
2. Read `RULES.md` — its defaults are language-neutral and mostly ready as-is.
   Adjust naming/casing rules and size limits for your chosen language.
3. Fill docs in this order: **PRD → SCHEMA → ARCHITECTURE → DESIGN → MOBILE (optional)**.
4. Delete optional sections marked `*(delete if N/A)*` and the whole `MOBILE.md`
   if you have no mobile client.
5. You're done when `grep -r "{{" context/` returns nothing (no placeholders left).

## Standard format

Every document follows the same conventions:

1. **Metadata header** at the top of every file:
   ```
   # <Title> — {{PROJECT_NAME}}
   **Project:** {{PROJECT_NAME}} · **Version:** {{X.Y}} · **Status:** {{Draft|Active|Final}} · **Updated:** {{DATE}}
   ```
2. **Numbered `##` sections**, separated by `---`.
3. **Placeholders** use `{{UPPER_SNAKE}}` for values and `<...>` for free-form slots.
4. **Fill instructions** are blockquotes: `> **Fill:** ...`
5. **Examples** are suffixed with `*(example)*` — they are illustrative, not prescriptive.
6. **Optional sections** are marked `*(delete if N/A)*`.
7. **Cross-references** point to sibling docs by filename.

## Source-of-truth hierarchy

When docs conflict, the executable source (code, config files, build scripts)
always wins over prose. Among the prose docs, priority is:

```
1. RULES.md        — coding standards, lint config, PR checklist, anti-patterns
2. SCHEMA.md       — data model, indexes, migrations, cascading deletes
3. ARCHITECTURE.md — layered architecture, middleware order, data flow, deployment
4. DESIGN.md       — palette, typography, spacing, component styling
5. PRD.md          — user stories, functional requirements, milestones
6. MOBILE.md       — mobile client architecture (if applicable)
```

## Checklist

- [ ] Copied to new project as `context/`
- [ ] `{{PROJECT_NAME}}` and metadata replaced in every file
- [ ] All `{{ }}` placeholders resolved
- [ ] Optional sections (`*(delete if N/A)*`) kept or removed deliberately
- [ ] `MOBILE.md` kept only if a mobile client exists
- [ ] `RULES.md` naming/size rules adjusted for your language
