# M7 — Emil Design Engineering pass (rsvp)
**Date:** 2026-10-01 · Applied with the full `emil-design-eng` (674 lines) + `mobile-native` (311 lines) skill texts read first.

## Shipped in Emil's mandated format — one table, Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| `y: 12` / `y: -8` (framer shorthand, RsvpPanel) | full `transform: 'translateY(…)'` strings | framer `x`/`y` are NOT hardware-accelerated (requestAnimationFrame, main thread); transform strings stay smooth under load (Emil §Perf) |
| Same 240ms ease curve for enter and exit | enter 240ms `[0.16,1,0.3,1]`, exit **150ms** `[0.7,0,0.84,0]` | asymmetric timing rule: the system always steps aside faster than it arrives |
| Listbox entrance animation + 40ms candidate stagger on typing | instant open, zero entrance animation | keyboard-initiated UI (typing) never animates — skill framework rule #1 (a dropdown used dozens of times/day gets no animation at all) |
| `transition-colors` + `active:scale` on Button/Stepper | `transition-[background-color,color,transform]` 150–160ms | a transform change wasn't transitioned — press feedback snapped; exact properties (never `all`) per checklist |
| Listbox/table rows: no `:active` press feedback | `active:bg-warm` (+100ms color ease) on candidates and chips | press feedback must exist on every tappable element now that the browser's gray flash is globally removed |
| No viewport baseline meta, hover states ungated at the CSS layer, no 16px input floor, no `touch-action`/`user-select` control rules | mobile-native "Baseline" shipped globally (viewport-fit=cover +interactive-widget, theme-color per scheme for the ivory chrome, tap-highlight none, text-size-adjust, controls: `touch-action: manipulation` + long-press select guard, `@media (hover:hover) and (pointer:fine)` gate, `input { font-size:16px }` — zoom is fixed at the cause, never disabled) | the platform layer decides whether it feels installed |
| Success state announced but focus left behind on the (now removed) submit button | success card gets `tabIndex={-1}` + programmatic focus on arrival | keyboard + screen-reader users must land somewhere meaningful after the submit control disappears; `role="status"` still announces the text |
| `BackToTop` visible from `window.scrollTo` smooth only under default motion | unchanged logic + documented instant-jump under reduced motion (CSS override) | reduced motion = fewer and gentler, not broken |
| Hero/`100vh` confusion never existed (we were already dvh) | verified against mobile-native "Never Ship" table — `user-scalable` never disabled, no `100dvh` on marketing hero (hero uses `min-h-[100dvh]` app-shell-style; scroll-linked reveals fade static under reduced motion) | the never-ship table checked row by row |

## Deliberately NOT animated (framework decisions, recorded)
- Combobox open/close (keyboard-initiated × every keystroke) — no animation, and also **no spinner text flash** under 2 chars.
- Stepper +/- taps: press feedback only (100–160ms band), no moving value animation.
- Admin status chips: color transition only; click frequency excludes movement.
- Countdown digits: crossfade kept (rare, explanatory); duration unchanged at 180ms.

## Verified
- tsc / lint / vitest 28/28 / build (9/9 pages) / `impeccable detect` — all clean post-pass.
- Motion budget on the RSVP flow path unchanged: ≤ 5 animated properties.
- **Needs real hardware (user)**: tap-feel on the steppers/pills, safe-area inset under the browser chrome, keyboard-open behavior on the RSVP inputs — per mobile-native §11 these cannot be verified from desktop tooling.
