---
target: "https://cp-rsvp.vercel.app/"
total_score: 28
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 2
timestamp: 2026-10-08
slug: cp-rsvp-vercel-app
---
# Impeccable Critique — https://cp-rsvp.vercel.app/
Method: dual-agent (A: general sub-agent · B: general sub-agent) · 2026-10-08 · v1.3.2
Snapshot: `.impeccable/critique/2026-10-07T16-20-41Z__cp-rsvp-vercel-app.md`

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Honest searching/pending/success states, but no RSVP progress cue and no deadline visible. |
| 2 | Match System / Real World | 4 | Warm plain English; "Joyfully accepts / Regretfully declines"; honorifics preserved verbatim. |
| 3 | User Control and Freedom | 3 | "Not you?" / "Make a change" / overwrite semantics are good; the curtain is unskippable (2.1s). |
| 4 | Consistency and Standards | 2 | JS pills UPPERCASE vs no-JS sentence case; docs claim Fraunces, code ships Karla-only; H1 scale on h2. |
| 5 | Error Prevention | 4 | Steppers clamp to caps; dietary maxLength; "add at least one guest"; honeypot; required radio. |
| 6 | Recognition Rather Than Recall | 3 | Type-ahead + allowance line reduce memory load; guest must still recall invitation name; scratch hint low emphasis. |
| 7 | Flexibility and Efficiency | 3 | Keyboard scratch, ARIA combobox, no-JS twin, reduced-motion all real; no jump-to-RSVP; 10/min/IP lookup limit. |
| 8 | Aesthetic and Minimalist Design | 3 | Tasteful, but a centered 5-line hero paragraph and 8-row timeline undercut the claimed restraint. |
| 9 | Error Recovery | 3 | Inline failure/closed messages exist; Field never attaches aria-describedby (hints/errors not tied to inputs). |
| 10 | Help and Documentation | n/a | Single scrolling invitation; no separate documentation surface. |
| **Total** | | **28/36** | **Good (upper-mid)** |

## Design Specificity Verdict
**Authored content, category-interchangeable system.** The words are unmistakably this wedding (names, Peñafrancia Basilica, Naga City, the swipe-right story, per-household caps). The visual/interaction language is the 2025-26 soft-premium wedding default: ivory + sage, script names, confetti, editorial countdown, reveal gesture. Their one distinctive fact (met by swiping right) leaves zero visual trace; the scratch-reveal is the only authored gesture and sits buried as section two of eight. Engineering specificity is stronger than design specificity: masked lookup + enforced caps + truthful confirmation is genuinely non-copyable.

**Deterministic scan:** `impeccable detect --json app components lib` → **0 findings**, exit 0 (nothing to adjudicate). Live HTML checks: curtain markup present; og:image present (`/opengraph-image.png`); twitter:card `summary_large_image` present. Browser evidence: `assessment-b-desktop.png`, `assessment-b-mobile.png` (fresh sessions show the curtain first — the post-curtain state was not exercised by the CLI; that limitation is explicit, not hidden).

## Overall Impression
Craft is high and the core mechanic is honest. The biggest opportunity is alignment: the RSVP is the product's whole point, yet it is the visually weakest, least discoverable object on the page — and the first thing guests meet (the curtain) is the least polished visual on the site.

## What's Working
1. **The household lookup is the product** — masked type-ahead, preloaded caps, per-household allowance line; correct combobox semantics.
2. **Truth-telling confirmation** — exact counts + dietary echo + "Resubmitting updates your answer" + returning-guest prefill.
3. **Inclusion implemented, not claimed** — no-JS twin on the same server action, reduced-motion collapse, safe-area/interactiveWidget viewport, 48px targets, 16px input floor.

## Priority Issues
**[P1] The RSVP is undiscoverable.** Only reachable after scrolling past hero (100dvh) + 7 sections; no CTA, nav, jump link, or sticky affordance. Threatens the ≥90% response goal. Fix: sage "RSVP" CTA in the hero anchoring to #rsvp + slim sticky pill after the hero; keep the form surface uncluttered. Command: `layout`.

**[P1] The curtain is a dark, unskippable gate that may repeat every visit.** Dense vertical stripes read as corrugated/bamboo, not cloth (confirmed in the mobile capture); single center hairline reads as a seam; 2.1s total; sessionStorage is not reliably persisted by in-app messaging browsers; two buttons share one aria-label; `role="dialog"` without modal semantics or focus containment. Fix: lighten the fabric + make the meeting edge and top rod legible; cut to ~1.2s; allow tap-anywhere/scroll-to-skip; localStorage fallback; skip on #rsvp deep links; modal semantics. Commands: `colorize` + `harden`.

**[P2] Accessibility wiring is broken where it matters most.** (a) Field computes describedBy but renders it as a hidden span instead of attaching it to the control; (b) accept/decline pills lack a peer-focus-visible ring (invisible keyboard focus); (c) search input focus is border-color only; (d) curtain focus can escape behind the overlay. Fix per item. Command: `harden`.

**[P2] Docs and code have drifted apart.** DESIGN.md says Fraunces display + hero photo; code ships Karla-only and no hero photo (cpcj.jpg orphaned); H1 scale used on h2; 10px countdown labels below the documented floor; uppercase pills vs the brand's micro-only uppercase rule; globals still carries the retired load-time reveal block (stale RevealOnce comment, dead nth-child(8/9)); config dressCode.photo.alt unused and disagreeing; scratch docstring says ~60 shapes but draws 120. Fix: reconcile docs to reality and delete dead code. Command: `distill`.

**[P3] Centered, overlong hero paragraph hurts the target audience.** ~5 centered lines at 390px; centered multi-line body is the least readable alignment for older guests. Fix: left-align the paragraph in the centered stack at 45-52ch, or tighten copy. Command: `typeset`.

**[P3] Guests are never told the RSVP deadline.** The countdown targets the wedding day, not the action; no "Please respond by…" near the form. Fix: show the deadline beside the form (env-driven as designed). Command: `clarify`.

## Persona Red Flags
**Older, low-vision guest:** 10px uppercase countdown labels; uppercase 14px pill text wrapping to two cramped lines; 5-line centered hero paragraph; 55%-erase scratch requirement; RSVP seven screens down with no persistent CTA.
**First-timer from a messaging link:** curtain explains nothing; hero has no obvious next action; disabled "Send RSVP" gives no instruction ("choose an answer to continue").
**Keyboard / screen reader:** invisible focus on accept/decline pills; border-color-only focus on search; aria-describedby never wired; curtain does not trap focus and duplicates aria-labels.
**Wary-of-apps older relative (project-specific):** sessionStorage curtain re-appears on fresh opens; type-ahead asks them to type before anything is explained; 10/min/IP lookup limit can penalize a large family on one connection.

## Minor Observations
Field's hidden span literally renders the ID string as content. Two elements share aria-label "Tap to open". NoJsRsvpForm hardcodes `accent-[#5B6E4F]` instead of a token. Tagline and celebration use exclamation marks against the brand voice rule. Dress-code image lazy-loads, so full-page captures show a blank box (visual QA lies). nth-child(8/9) delays are dead. Scratch docstring stale.

## Questions to Consider
1. If success is ≥90% response in under two minutes, why does the page open with a tap gate + 2.1s sweep and put the form after seven screens? What if the RSVP were the first decision under the names, with the celebration as reward below?
2. The household-cap lookup is the one uncopyable thing — so why is the RSVP the plainest object on the page, contradicting DESIGN §6's "clearest visual weight"?
3. Is "scratch to reveal" delight or friction for a guest with arthritis who only wants the date and the form? Could the date be immediately legible with scratch as an optional flourish?

---

## Disposition (v1.3.3 fix pass, 2026-10-08)

Decisions from the couple's answers: **scope = P1 + P2 only**; **priority =
RSVP discoverability + accessibility wiring first**; **curtain = rebuild as
lighter, skippable cloth**; **off-limits = the hero and the content sections
(timeline, story, dress code, venues)**.

| Finding | Status | Resolution |
|---|---|---|
| P1 RSVP undiscoverable | **Fixed (partial)** | New `RsvpStickyCta` pill appears after the hero and hides while the RSVP section is in view. The critique's hero-CTA half is **deferred** — the hero was declared off-limits. |
| P1 curtain gate | **Fixed** | Lighter woven-linen fabric + visible rod + gold meeting-edge trim; one accessible overlay control (tap / wheel / touch / Escape); 1.25s sweep; `localStorage` persistence; `#rsvp` deep-link skip; `aria-modal` + page behind `inert`. |
| P2 a11y wiring | **Fixed** | `Field` attaches `aria-describedby`/`aria-invalid` via `cloneElement`; pills get `peer-focus-visible` rings; `focus:outline-none` removed from the search/guest inputs; curtain focus contained by `inert`. |
| P2 docs/code drift | **Fixed** | DESIGN §1/§2/§4/§14 reconciled (Karla-only, no hero photo, exclamation rule, heading-level note, superseded Fraunces row); dead reveal delays + stale comments removed; countdown labels raised to the 13px badge floor; uppercase removed from pills; dead `dressCode.photo` config pruned; scratch docstring corrected. |
| P3 hero paragraph alignment | **Deferred** | Hero off-limits this pass. |
| P3 deadline near the form | **Deferred** | Out of P1+P2 scope. |

Minors cleared: Field placeholder span removed; single curtain `aria-label`;
`accent-primary` token replaces the hardcoded hex; exclamation rule reconciled
in the docs; dead `nth-child(8/9)` removed; scratch docstring corrected.
