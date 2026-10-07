# Impeccable Audit — https://cp-rsvp.vercel.app/ (guest page)
Date: 2026-10-08 · Version: v1.3.3 · Scope: guest page (admin surface out of target)
Method: code-level technical audit + live evidence via Playwright (390×844 and 320×640,
real Chromium), detector run once. Not a design critique.

## Audit Health Score
| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | WCAG AA largely met (contrast 5.2–13.3:1, visible focus ring, reduced-motion honored); gaps: countdown overflows at 200% text zoom, footer link is 41px tall, no `<header>` landmark. |
| 2 | Performance | 4 | Lean: `/` First Load JS 161 kB (59 kB route); one lazy image with intrinsic dimensions; animations are transform/opacity only; no `will-change`; confetti rAF self-stops. |
| 3 | Theming | 3 | Full token system; light-only by decision; one gap: four hard-coded hex swatches in the dress-code list. |
| 4 | Responsive | 2 | Fluid at ≥375px; the countdown row overflows horizontally at ≤~365px and under 200% text zoom. |
| 5 | Implementation Integrity | 4 | `impeccable detect` 0 findings; coherent, product-specific system (masked lookup, enforced caps, no-JS twin); no dead code after the v1.3.3 truth-sync. |
| **Total** | | **16/20** | **Good (address the weak dimensions)** |

## Implementation Integrity Verdict
**Pass.** The implementation expresses a coherent, product-specific system, not an
interchangeable template. Verified evidence: household-masked type-ahead with
enforced per-household caps (`RsvpCombobox`, `RsvpPanel`), a no-JS twin posting the
same server action (`NoJsRsvpForm`), truthful confirmation with prefill, and a
deterministic detector result of 0 findings across `app components lib`.

## Executive Summary
- Audit Health Score: **16/20 (Good)**.
- Issues: **0 P0 · 0 P1 · 2 P2 · 3 P3**.
- Top issues: countdown horizontal overflow under narrow widths / text zoom (P2);
  missing favicon → 404 on every load (P2); hard-coded swatch hex (P3); 41px footer
  touch target (P3); no banner landmark (P3).
- Next steps: `adapt` the countdown + footer target, `polish` the tokens/favicon/landmark.

## Detailed Findings

### [P2] Countdown row overflows horizontally under constraint
- **Location**: `components/sections/CountdownCell.tsx` (row `flex … gap-3`, cells `min-w-[3.4rem]`).
- **Category**: Responsive.
- **Impact**: At 320–365px viewports and at 200% text zoom the four-unit row is wider
  than the content box (measured 345px in a 280px box at 320px; 479px vs 390px at 200%
  zoom), producing horizontal page scroll on budget Android phones and for low-vision
  users who enlarge text.
- **Standard**: WCAG 1.4.4 (Resize Text), 1.4.10 (Reflow).
- **Recommendation**: let the row shrink/wrap and reduce base gap + label tracking at
  the smallest sizes; keep the ≥sm composition unchanged.
- **Suggested command**: `/impeccable adapt`.

### [P2] Missing favicon
- **Location**: `app/` (no `icon.svg` / `favicon.ico`).
- **Category**: Implementation Integrity / Performance.
- **Impact**: Every page load logs `404 /favicon.ico` in guests' consoles; no tab
  identity. DESIGN §2 specifies a sage monogram on ivory.
- **Recommendation**: add `app/icon.svg` (sage monogram per DESIGN §2).
- **Suggested command**: `/impeccable polish`.

### [P3] Hard-coded hex in dress-code swatches
- **Location**: `components/sections/DressCodeSection.tsx:7–31` (`style={{ backgroundColor: swatch.hex }}`).
- **Category**: Theming.
- **Impact**: Values equal the palette tokens but bypass the token layer; a palette
  change would silently miss them.
- **Recommendation**: map swatches to token classes (`bg-page-ivory`, `bg-warm`,
  `bg-primary`, `bg-gold`).
- **Suggested command**: `/impeccable polish`.

### [P3] Footer address link below the touch-target floor
- **Location**: `components/sections/Footer.tsx:15–23` (41px tall).
- **Category**: Accessibility / Responsive.
- **Impact**: Slightly under the 44px target guideline for a tap link.
- **Recommendation**: `min-h-11` on the link.
- **Suggested command**: `/impeccable adapt`.

### [P3] No banner landmark
- **Location**: `app/page.tsx` (hero is a `<section>`, no `<header>`).
- **Category**: Accessibility (semantic).
- **Impact**: Screen-reader users get no banner landmark for the page's masthead.
- **Recommendation**: wrap/replace the hero root with `<header>`.
- **Suggested command**: `/impeccable polish`.

## Patterns & Systemic Issues
None systemic. The countdown is the single layout that is not fluid under constraint;
every other section reflows correctly at 320px.

## Positive Findings
- Contrast passes everywhere sampled (body 5.55:1, ink 13.33:1, sage pill 5.18:1).
- Visible keyboard focus ring (2px, offset 2px) confirmed via Tab.
- `prefers-reduced-motion` block present and honored; `motion` used only for the
  confirmation card.
- One image, lazy, with intrinsic width/height → no layout shift.
- No layout thrashing, no `will-change`, animations transform/opacity only.
- `#rsvp` deep link skips the curtain and lands on the form (verified).
- Detector clean; no dead code or orphaned styles after the fix pass.

## Recommended Actions
1. **[P2] `/impeccable adapt`** — make the countdown fluid at ≤365px and under text
   zoom; raise the footer link to the 44px floor.
2. **[P2] `/impeccable polish`** — add `app/icon.svg`; convert swatch hex to tokens;
   add the banner landmark.
3. **[final] `/impeccable polish`** — confirm the whole path at 320/390/1280 and close
   the critique snapshot once its Priority Issues are cleared.
