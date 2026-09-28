# Quality Baseline — rsvp
**Status:** started by Stage 2 (Taste) · **Completed by Stage 3 (Impeccable Init)** · **Version:** 0.2 · **Updated:** 2026-09-28

## A. Initial design constraints (from context + taste pass)
- Mobile-first single page; light theme locked page-wide (couple decision); deadline config TBDs render gracefully.
- Token source of truth: `DESIGN.md` §§3-9 + the §14.6 `@theme` block (1:1, no drift).
- Code constraints per RULES.md: ≤300-line files, named exports, `ActionResult` errors, no new deps beyond the locked table (icon-library question resolved in DESIGN §14.4).
- Hero: real photo `assets/hero/cpcj.jpg`; `min-h-[100dvh]`; stack ≤ 4 text elements; subtext ≤ 20 words; top padding ≤ pt-24 desktop.

## B. UX principles
- In-flow feedback only (no toasts, no modals) — DESIGN §10.
- Confirmation repeats recorded details back; resubmission overwrites; closed state is warm and points to the couple.
- Every guest is answering against a visible allowance (caps), the form can never silently reject more than the household may bring.
- Zero decorative eyebrows, zero scroll cues, zero fake content; the RSVP form is the visual anchor (white card on ivory, strongest shadow).

## C. Accessibility considerations
- WCAG AA pairs from DESIGN §3 verified at build (contrast gate).
- Focus-visible rings (2px primary, 2px offset) everywhere; keyboard-only RSVP flow; combobox pattern for typeahead.
- 48px minimum tap targets; `prefers-reduced-motion` collapses every animation; body ≥ 17px.
- Errors adjacent to inputs with `aria-describedby`; success announced via role=status.

## D. Responsive criteria
- 320–1440px sweep each milestone; no hover-only affordances on touch, no
  sticky-hover states, no 100vh anywhere (always `100dvh`), hero collapses to
  `w-full px-4` under 768px.
- Admin: single-column under lg, table scrolls horizontally, never shrinks type.

## E. Visual quality criteria
- One accent (sage) locked page-wide; gold strictly decorative; warm hairline borders paired with soft shadows (~ no border/radius clashes).
- One radius system documented (buttons pill, cards 16, inputs 12); concentric double-bezel only for the RSVP card.
- Typography: Fraunces display (grandfathered per DESIGN §14.4) + Karla body; names never scream (weight + color control hierarchy).

## F. Relevant Impeccable guidance
Detector categories (61 rules, CLI 4.1.0) mapped to our binding rules:

| Detector category | Our binding rule | Checkpoint |
|---|---|---|
| AI-slop tells (purple/violet, cyan-on-dark, gradient headings, glow) | Banned at DESIGN §14.3; sage palette is safe ground | M5 critique |
| Typography (overused fonts, flat type hierarchy) | Karla body (not flagged pool); Fraunces grandfathered per DESIGN §14.4 with recorded justification; 7-level scale | M4 + M5 |
| Color & contrast (AA pairs, gray-on-color, pure black/white) | AA-verified pairs in DESIGN §3; warm `#2F2A20` ink, never pure black | every build step + M5 |
| Layout (nested cards, monotonous spacing, everything-centered) | Double-bezel confined to the RSVP card; spacing rhythm per DESIGN §5 | M5 + M8 |
| Motion (bounce/elastic easing, layout-property transitions) | Token curves only (DESIGN §14.5); transform/opacity; reduced-motion collapse | M7 (emil stage) |
| Quality (tiny text, cramped padding, long lines, small touch targets) | Body ≥ 17px (floor 11px), 48px targets (detector floor 44px), 65ch measure | every build step |

Engine verification (Stage 3, real run): fixture planted with 4 violations →
detector caught all 4 (`low-contrast` with computed 2.8:1, `undersized-ui-text`
10px button, `ai-color-palette` purple, `gradient-text`), exit 1 as documented.
Baseline scan of the docs-only repo: **0 findings, exit 0**.
Gate: `npx impeccable detect` runs at every review stage (M5/M8/M10) and before
production; findings logged per stage in `context/reviews/`.

## G. Stage 3 (Impeccable Init) results
- **PRODUCT.md written** at project root (`impeccable:product-schema 1`):
  users, purpose, positioning, operating context, capabilities/constraints,
  brand commitments, evidence on hand, principles, accessibility. Interview
  duty satisfied by planning rounds 1-3 (strong repository evidence; per
  init.md, confirmed fields are never reopened). The three undecided facts
  (wedding date, ceremony time, RSVP deadline date) are recorded as explicitly
  open = ship-gated, not invented.
- **Workflow defaults**: no image generation is available in this harness, so
  per init.md §5 there is no comp-vs-code question: **code-first is the only
  path**; nothing is written to `.impeccable/config.json`.
- **Live mode**: deferred until the app runs (`.impeccable/live/config.json`
  belongs to a runnable web project; set up at the M5 critique if browser
  iteration is wanted).
- **Hooks**: deliberately not installed project-wide; the detector is invoked
  as explicit gates per the implementation plan (deterministic across agents).
- **Housekeeping**: `.gitignore` fixed (track `context/`, `context-template/`,
  `skills-lock.json`, `PRODUCT.md`, `assets/`; standard Next/env artifacts
  ignored) and the initial commit records Milestones 1-3.
