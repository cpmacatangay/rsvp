# M8 — Second-Pass Impeccable Audit (rsvp)
**Date:** 2026-10-01 · Scope: regressions introduced during M6 fix rounds + M7 design-engineering pass, checked line-by-line against FRAMEWORK rules (emil checklist, mobile-native "Never Ship" table) and the brief (context docs, DESIGN.md).

> Detection: `impeccable detect app components lib` → **0 findings**; grep sweeps for the skill-checklist patterns (`transition-all`, framer shorthand moves, ungated hover, `scale(0)`) — no residuals; the `y:`-pattern grep hits were the new full-transform strings, verified false positives.

## Findings (all dispositioned)

| # | Severity | Finding | Disposition |
|---|---|---|---|
| A1 | Minor | Duplicated motion-rationale comment blocks in `RsvpPanel.tsx` (editing residue) | **FIXED** in M8: consolidated into one comment |
| A2 | Important (regression risk) | A blanket base-layer rule (added during M7) re-declared hover transitions for every `a[class]`/`button` — Tailwind `hover:` variants already compile into the hover gate, and components declare exact transition properties; a global re-declaration could animate borders/box-shadows that must be instant | **FIXED** in M8: rule removed, placeholder comment records why |
| A3 | Important (code health) | `RsvpPanel.tsx` over the 300-line ceiling (322) with complexity 47 — four state branches + no-JS twin + strings in one function | **OPEN → M9 first task**: split search / answer / success / closed into sibling components in `components/form/`, strings stay verbatim |
| A4 | Important (interaction regression) | `reveal-on-scroll` re-triggers on upward scroll (`animation-timeline: view()`, fill both): the RSVP section is interaction-heavy — a user scrolling back to the form while focused would watch its content shift beneath the caret | **FIXED in M8**: `RsvpSection` renders `reveal={false}`; informational sections keep the reveal (their re-entry is harmless and slow-scrolled) |
| A5 | Minor | Reduced-motion branch of `motionSettings` animates opacity without an explicit transition → library default (~300ms) | **ACCEPTED**: reduced motion keeps gentle opacity fades per Emil's a11y section ("fewer and gentler, not zero"); noting for honesty |
| A6 | Minor (verified non-issue) | Potential collision: fixed back-to-top (z-40) vs open typeahead listbox (z-10) | Checked: mutually exclusive by construction — the button only appears after the viewport passes the search block, which is exactly when the listbox cannot be open |
| A7 | Minor | Motion rationale comments duplicated the token curve names without referencing `DESIGN §14.5` | **FIXED** in M8: single comment, now points at the tokens (source: `context/DESIGN.md`) |
| A8 | Info (correct as-is) | `role="status"` + programmatic focus on the success card could read as double announcement | Checked: `role="status"` announces text; focus moves *later* in the same frame — standard confirm-then-focus pattern (Vercel/Linear do the same); keeping |
| A9 | Info | The audit's own scope claims held from earlier stages: zero em-dashes in served HTML (re-verified), single interactive accent, one radius/shadow system, motion budget ≤5 properties on the RSVP path, `user-scalable` never disabled, 16px input floor, no `100vh` | **PASS** |
| A10 | Info (deferred by plan) | Status-column header in admin is a plain label — sorting (not filtering, which exists) was never requested; noted as future if the couple ever asks | DEFERRED |

## Verified-clean regression sweep
- All interactive surfaces: `user-select: none` at the control level only (body text stays copyable — addresses, names, dietary text).
- `touch-action: manipulation` on every tappable element (global); no `touch-action: none` on scrollable content.
- The 16px input floor covers every input/textarea (control-class + noscript twins).
- Contrast: no new text/color pairs below AA (BackToTop primary-on-card 4.6:1); `ink-faint` remains decoration-only (Countdown separator).
- `impeccable` full gate: tsc, lint (0 errors), vitest 28/28, build 9/9 pages.
- **Needs real hardware:** the m7-motion.md hardware list carries forward (tap-feel, safe areas, keyboard-open behavior — mobile-native §11).
