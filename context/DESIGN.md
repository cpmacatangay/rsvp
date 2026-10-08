# Design System — rsvp
**Project:** rsvp · **Brand:** Wedding of Christian Paul & Christine Jane · **Styling:** Tailwind CSS v4 · **Version:** 0.2 · **Status:** Draft · **Updated:** 2026-09-28

> Direction (locked): **soft premium** — calm, warm, "expensive stationery".
> taste-skill variant `high-end-visual-design`, dials:
> **VARIANCE 4 / MOTION 4 / DENSITY 3**. Skill rules in force:
> `design-taste-frontend`, `emil-design-eng`, `mobile-native`, `impeccable`.
> All animation rules honor `prefers-reduced-motion`.

---

## 1. Brand Identity

### Name
The page brand = the wedding itself: couple names as wordmark
(**Christian Paul & Christine Jane**).

### Tagline
Warm and short. Exclamation marks are rationed: exactly one celebratory line
carries them ("We're getting married!"), and the hero tagline may close with a
single one; everywhere else the voice stays declarative.

### Brand Personality

| Attribute | Description |
|---|---|
| Tone | Warm, sincere, quietly festive |
| Voice | "We" — written by the couple; no marketing-speak, no ALL CAPS |
| Emotion | Joyful anticipation, calm rather than loud |

### Target Audience
Wedding guests 20–80+, mostly on phones, incl. low-tech comfort. Legibility
and trust beat cleverness everywhere in this system.

---

## 2. Logo — Concept
No logo mark; the wordmark is the couple's names set in the script accent
(Great Vibes). Favicon: single sage monogram letter on ivory (SVG). OG image:
names over the ivory ground (1200×630; generated from `app/opengraph-image`).
The hero itself carries no photograph — the invitation is type-led.

---

## 3. Color Palette

### Primary & Accent

| Token | Hex | Tailwind class | Usage |
|---|---|---|---|
| Primary (deep sage) | `#5B6E4F` | `bg-primary` | Primary buttons, links, focus accents |
| Primary hover | `#4A5A40` | `hover:bg-primary-dark` | Hover/active |
| Primary soft | `#DCE3D2` | `bg-primary-soft` | Chips, soft section backgrounds |
| Accent (champagne gold) | `#B79B5B` | `text-accent` | Thin rules, ornaments, small highlights — never body text on ivory |

### Backgrounds & Surfaces

| Token | Hex | Usage |
|---|---|---|
| Page background (ivory) | `#FAF7F0` | Page |
| Surface / card | `#FFFFFF` | Cards (form, admin table) |
| Surface warm | `#F3EEE3` | Alternating sections, table header |
| Divider | `#E6DFD0` | Hairlines |

### Neutrals (warm, olive-leaning)

| Token | Hex | Usage |
|---|---|---|
| Text primary | `#2F2A20` | Body + headings on ivory/white |
| Text secondary | `#6B6353` | Captions, meta (AA on ivory: 4.6:1) |
| Text placeholder | `#9A917F` | Input placeholders (decoration only, never required info) |
| Text inverse | `#FAF7F0` | On primary buttons |

### Semantic (Status) Colors

| Token | Hex | AA on white? |
|---|---|---|
| Success (sage) | `#5B6E4F` | yes (4.6:1) |
| Warning (ochre) | `#8F6B2A` | yes (4.5:1) |
| Error (muted clay) | `#9C4430` | yes (on white 6.2:1) |
| Neutral (olive) | `#6B6353` | yes (4.6:1) |

> Palette audit at build: every text/background pair re-checked by the
> `impeccable detect` contrast gate + vitest contrast snippets; any failing
> value re-tuned rather than flagged.

---

## 4. Typography

### Font Stack (self-hosted via `next/font`, no external CSS call)

| Role | Font | Fallback | Weights |
|---|---|---|---|
| Display / headings / wordmark | **Karla** | system-ui, sans-serif | 400, 600 |
| Script accents (names, celebration) | **Great Vibes** | cursive | 400 |
| Body / UI | **Karla** | system-ui, sans-serif | 400, 600 |

Karla carries everything structural — humanist-warm, open apertures, excellent
small-size legibility on phones — at weight 600 for headings (v1.2.2). Great
Vibes is reserved for the couple's names and the celebration line. Fraunces and
Cormorant Garamond were retired by the couple's call (see §14 log); no display
serif is in use.

### Type Scale (mobile-first; desktop +2px via `sm` overrides)

| Level | Token | Size (mobile) | Weight | Line Height | Letter-spacing | Font |
|---|---|---|---|---|---|---|
| Hero wordmark (script names) | `hero` | 64px | 400 | 0.95 | -0.01em | Great Vibes |
| Section heading | `h1` | 34px | 600 | 1.15 | -0.005em | Karla |
| Subheading | `h2` | 26px | 600 | 1.2 | 0 | Karla |
| H3 | `h3` | 21px | 600 | 1.3 | 0 | Karla |
| Body | `body` | 17px | 400 | 1.6 | 0 | Karla |
| Caption | `caption` | 14px | 400 | 1.45 | 0.01em | Karla |
| Badge | `badge` | 13px | 600 | 1.2 | 0.08em uppercase | Karla |

Only these seven levels exist. Body copy never smaller than 17px mobile
(reading comfort for older guests); the badge level (13px) is the floor and is
reserved for semantic micro-labels — the countdown unit labels use it. Section
headings render as `<h2>` elements but take the 34px `h1` scale (one `<h1>`
exists per page: the hero wordmark).

---

## 5. Spacing Scale

4px base; generous by design (soft premium = space is the luxury signal).

| Token | px | rem |
|---|---|---|
| xs | 8 | 0.5 |
| sm | 12 | 0.75 |
| md | 16 | 1 |
| lg | 20 | 1.25 |
| xl | 24 | 1.5 |
| 2xl | 32 | 2 |
| 3xl | 40 | 2.5 |
| 4xl | 48 | 3 |
| section | 96 | 6 | (mobile: 64) |

### Layout defaults
- Page gutter: `px-5` mobile, `px-6` ≥ 768px.
- Section vertical: `py-16` mobile → `py-24` desktop.
- Card padding: `p-5` mobile → `p-6` desktop.
- Max content width: `48rem` (single column; admin table scrolls instead of
  shrinking type).

---

## 6. Layout & Grid

Single scrolling column, no dashboard grids on the guest page. Section order:
hero → scratch-the-date → countdown → venues → day schedule → dress code →
story → RSVP → footer. The guest page is **card-free** (v1.6): hierarchy comes
from type, spacing, and hairline rules — not boxes. The RSVP form is the page's
most important object; it earns weight through position, type, and the sticky
RSVP affordance (not a card).

### Grid breakpoints

| Breakpoint | Columns | Max width | Gap |
|---|---|---|---|
| Mobile (<640px) | 1 | 100% − gutters | 16px |
| ≥640px | 1 (content) | 48rem | 24px |
| Admin ≥1024px | summary + table | 72rem | 32px |

### Component anatomy — RSVP form card
```
┌───────────────────────────────────┐
│  26px H2: "Who's coming?"         │
│  type-ahead: [ Find your name  ▾] │   ← 48px min height
│  ─────────────────────────────    │
│  Household card (revealed):       │
│    names + "2 adults, 1 child"    │
│    [ Joyfully accepts ]           │   ← primary pill
│    [ Regretfully declines ]       │   ← secondary pill
│    (if accepts) steppers:         │
│      Adults   − 2 +   (of 2)     │
│      Children − 0 +   (of 1)     │
│    Dietary note (textarea)        │
│    [ Send RSVP ]                  │   ← primary pill, sticky on mobile
└───────────────────────────────────┘
```

---

## 7. Border Radius & Shadows

### Border Radius
| Token | px | Usage |
|---|---|---|
| sm | 8 | badges, chips |
| md | 12 | inputs |
| lg | 16 | cards, buttons (soft premium favors rounder than the template default) |
| full | 9999 | pill buttons, avatars |

### Shadows (warm-tinted, barely there)
| Token | Value | Usage |
|---|---|---|
| card | `0 1px 2px rgba(47,42,32,.05), 0 8px 24px rgba(47,42,32,.06)` | form card, modals |
| card-hover | `0 2px 3px rgba(47,42,32,.06), 0 12px 32px rgba(47,42,32,.09)` | hover lift |
| elevated | `0 2px 4px rgba(47,42,32,.07), 0 16px 40px rgba(47,42,32,.12)` | dialogs (admin only, if used) |

Elevation comes from shadow + border pairing (`1px solid #E6DFD0` on cards),
not from color fills — per `emil-design-eng` (no border/radius clashes).

## 8. Iconography

- **Source:** `@phosphor-icons/react`, weight `light` (ultra-light hairline
  strokes; couple-confirmed 2026-09-28, replacing the earlier lucide choice)
- **Sizes:** 20px inline, 24px standalone
- **Color:** `currentColor` (inherits text color); never multi-color icons.
- Used only where words don't work (calendar, map pin, chevron); every
  icon is either aria-labelled or purely decorative (`aria-hidden`).

---

## 9. Animations & Transitions

All motion transforms `transform`/`opacity` only, `motion-reduce:` variants
ship for everything. Two tiers (emil): **functional feedback stays fast**
(100–160ms — press, hover, focus); **authored entrances/celebrations run
slower** for an elegant, editorial feel (v1.5: reveal 700ms, curtain sweep
1.5s, success 450ms). No bounce on data-critical UI.

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Sections on scroll | fade + 32px rise (IntersectionObserver, replays on downward entry) | 700ms | ease-out |
| Curtain sweep | two panels part (200ms beat first) | 1500ms | drawer curve |
| Household card reveal | height+fade | 240ms | ease-out |
| Accept/Decline pills | background-color 150ms, active scale .98 | 150ms | ease-out |
| Success state | crossfade to card + single soft "rise" | 450ms | ease-out |
| Confidence details in success | stagger children | 60ms/child | ease-out |
| Countdown digits | crossfade on change | 320ms | ease-out |
| Celebration line | fade + scale-in | 700ms | ease-out |
| Sticky RSVP pill / back-to-top | opacity + rise | 320 / 220ms | ease-out |
| Focus states | ring-color 120ms | 120ms | linear |

Banned: bounce/elastic easings, layout-property transitions, parallax gems,
anything that fights `prefers-reduced-motion`.

---

## 10. Component Styling Notes

### Buttons
- Variants: primary (deep sage fill, ivory text), secondary (ivory fill,
  1.5px primary outline, primary text), ghost (primary text only), danger
  (muted clay, admin only).
- Min height 48px; pill radius; horizontal padding 20px.
- Focus: 2px outline `#5B6E4F`, offset 2px; focus never removed, only styled.
- Disabled: 45% opacity + no hover shift; keeps size (no layout shift).
- Active: `scale(0.98)` 150ms.

### Input Fields
- 48px height, `md` radius, 1.5px border `#E6DFD0`, ivory fill; focus border
  primary + same ring as buttons.
- Labels always visible (`text-secondary` caption above input) — placeholder
  text is example-only.
- Error: 1.5px error-clay border + 14px error message below; error text pairs
  with `aria-describedby`.

### Status Pills / Badges
Pending (olive soft bg), Accepted (sage soft bg, sage text), Declined (clay
soft bg, clay text) — 13px, 9999 radius, dot + label.

### Toast / Notification
None in v1: feedback is in-flow (inline form errors + success card), which
mobile-native calls the right call for form outcomes.

### Modals
None in v1 — everything is inline; the admin uses a details drawer only if
the couple asks later.

---

## 11. Responsive Breakpoints

| Label | Min-width | Target |
|---|---|---|
| `sm` | 640px | phones landscape |
| `md` | 768px | tablets |
| `lg` | 1024px | desktop/admin table view |

Mobile-first: base styles target phones; desktop gets airier spacing and the
admin two-column layout. No hover-only affordances exist on mobile (sticky
hover states avoided per `mobile-native`).

---

## 12. Accessibility (WCAG 2.1 AA)

- Contrast: every pair in §3 is 4.5:1+ (verified at build, see palette note).
- Focus & keyboard: visible rings everywhere; the type-ahead is a combobox
  pattern (arrow keys, Escape), the form is fully operable keyboard-only.
- Screen readers: heading order h1→h3 without skips; form errors announced via
  `aria-live="polite"`; success announced via `role="status"`.
- Tap targets ≥ 48×48 (our minimum, above the 44 template floor).
- `target-size`, contrast, and alt-text rules are CI-gated (`impeccable detect`).
- Zoom-proof up to 200%: no fixed viewport heights on text containers.

---

## 13. Future Considerations
- Bilingual German/English copy (structure already l10n-ready: no image-embedded
  text).
- Meal choice step once the menu is fixed.
- A footer privacy blurb expansion if dietary data retention is formalized.

---

## 14. v1.2 Review Log (2026-10-07)
Fonts: **Karla** carries display and body (v1.2.2: Cormorant Garamond removed
on the couple's call); **Great Vibes** remains the script accent for
names/celebration. Curtain: real-cloth fabric layers, monogram removed, 300ms
beat then a 1600ms sweep (2.1s total), gold edge as a gradient trim (v1.2.1,
after the detector flagged the former one-sided border). Motion: MOTION dial
runs at 7 (emphasized), confetti stage 640×420, ~4.2s fall with soft tail.
Casing ruling: Title Case for headings, uppercase reserved for tiny micro
labels. Countdown: editorial numerals, card removed. Timeline: free hairline
icons in editorial blocks. Story: body typography. Full notes:
`context/reviews/v1.2-review.md`.

### v1.3.3 — Impeccable critique fix pass (2026-10-08)
Full dual-agent critique recorded at
`context/reviews/impeccable-critique.md` (28/36, 0 detector findings). P1+P2
fixes shipped: a sticky RSVP pill (appears after the hero, hides over the form)
for discoverability; the curtain rebuilt as lighter woven linen with a visible
rod, legible meeting edges, one accessible control (tap/wheel/touch/Escape),
~1.25s sweep, `localStorage` persistence and `#rsvp` deep-link skip, with the
page behind `inert` while closed; `Field` now actually attaches
`aria-describedby`/`aria-invalid` via `cloneElement`; accept/decline pills and
inputs gained a visible keyboard focus ring; docs/code drift reconciled (fonts,
hero photo, exclamation rule, countdown labels to the 13px badge floor, dead
reveal delays and stale comments removed, unused config pruned). Deferred P3s:
hero paragraph alignment and the RSVP deadline near the form.

### v1.3.4 — Impeccable audit + polish (2026-10-08)
Audit scored 16/20 (Good); full report `context/reviews/impeccable-audit.md`.
Fixed: countdown made fluid below 380px (clamp numerals, tighter gap/tracking;
≥380px composition unchanged) so it no longer overflows at ≤365px; dress-code
swatches use palette tokens instead of inline hex; footer link meets the 44px
touch target; hero is now a `<header>` banner landmark. Deferred: favicon asset
(needs a monogram choice) and the 200% text-zoom residual on the countdown.

### v1.3.5 — audit follow-ups (2026-10-08)
`app/icon.svg` (sage "C" monogram on ivory) ends the `/favicon.ico` 404; the
countdown gains a `flex-wrap` fallback from 380px up so 200% text zoom reflows
(one row preserved at 320–414px); the hero invitation paragraph is left-aligned
for older readers; the RSVP section states the env-driven deadline ("Please
respond by July 10, 2028.") via `deadlineDisplayDate` while the page stays
statically generated. Residual: text-only zoom below 380px.

### v1.4 — scroll-entry reveals (2026-10-08)
Each `main > section` now rises in (opacity + 24px translate, 480ms ease-enter)
when it enters from below, and replays on the next downward pass; exiting
upward keeps it revealed. Driven by `components/motion/ScrollReveal`
(IntersectionObserver, `rootMargin` −12% bottom, transition-based so replays
are interruptible). The hidden start state lives behind `.js-reveal`, set by a
pre-paint inline script so above-the-fold sections animate on load without a
flash. Capture-safe: `.js-reveal` is withheld for reduced-motion, for
`navigator.webdriver`, and for `?capture=1` / `?reveal=off`. Full-page QA
captures must use `?capture=1` (stealth automation is not reliably detectable).

### v1.5 — slower authored motion (2026-10-09)
The couple asked for slower motion. Authored entrances slowed; functional
feedback left fast (emil). Section reveals 480→700ms with 32px travel; curtain
beat/sweep 150→200ms / 1.1→1.5s (unmount ~1.75s); countdown fade 180→320ms;
RSVP enter/exit/success 240/150/300→380/220/450ms; sticky pill 200→320ms;
celebration line 500→700ms; scratch circle 200→300ms; back-to-top 150→220ms;
curtain hint pulse 2.2→2.6s. (v1.4.x) `suppressHydrationWarning` on `<html>`
fixes the `js-reveal` hydration mismatch in dev.

### v1.6 — unboxing + venue consistency (2026-10-09)
Guest page is card-free: the two venue `Card`s and the dress-code photo frame
lose their fill/border/shadow; content sits on the ivory/warm surface with
hierarchy from type + spacing (impeccable anti-card). Admin login unboxed
(`DoubleBezel` retired; `Card`/`cardRecipe` remain for admin data surfaces).
Venues rebuilt as one identical structure (title → name → "Get directions"),
equal height with buttons pinned to the bottom; reception shows the hotel name
only, church keeps its confirmed name. Church location verified against
CONTENT.md §1 / the maps link.

---

## 14. Taste Application Log (Stage 2 deliverable)

Source skills read in full: `design-taste-frontend` (v2, 1206 lines),
`high-end-visual-design` (98 lines). Applied at locked dials.

### 14.1 Design Read (skill §0.B one-liner)
"Reading this as: an event-announcement page (wedding invitation) for guests
of all ages incl. older relatives, warm editorial language, soft-premium
aesthetic, leaning toward Tailwind v4 token system + restrained motion."

### 14.2 Dials (locked by the couple; validated against the skill's inference table)
| Dial | Our value | Skill inference check |
|---|---|---|
| VARIANCE | 4 | "calm/editorial" = 5-6; "trust-first/a11y-critical" = 3-4. Ours sits between: offset, not chaotic. OK |
| MOTION | 4 | Both rows land 2-4. Fluid-CSS band: transitions + gentle reveals, no hijacks. OK |
| DENSITY | 3 | "calm" = 2-3. Art-gallery airiness. OK |

### 14.3 Hard bans adopted (verbatim from DTF §9 / high-end §2; enforced from build start)
1. **Em-dash ban (§9.G): zero** em-dashes or en-dash separators in any
   page-visible string (copy, buttons, captions, alt text, labels). Page copy
   drafts amended where needed (dress code now uses a colon). Docs tables
   (this file, CONTENT.md) are not page copy and keep their typographic
   separators.
2. No pure black/white text: our `#2F2A20` on `#FAF7F0` already compliant.
3. No gradient text on headings; no neon glows; no AI-purple (moot: sage).
4. No bounce or `linear`/`ease-in-out` transitions: only the custom cubics in
   the token block; enter/exit never swapped.
5. No scroll cues, no version labels, no section-number eyebrows, no pills
   overlaid on photos, no photo-credit captions, no decoration strips at the
   hero bottom, no fake spec tables.
6. Middle dot rationed: max 1 `·` per line in any meta strip.
7. No decorative status dots. Exception documented: admin table badges carry
   them as real semantic state (pending/accepted/declined).
8. `h-screen` is banned: hero uses `min-h-[100dvh]`.
9. No `window.addEventListener("scroll")`: reveals via IntersectionObserver /
   Motion `whileInView` only.
10. Animations only ever `transform`/`opacity`; reduced-motion collapses all
    of them (always honored).

### 14.4 Conflicts between the taste rules and this design system — resolutions
| Topic | Skill rule (source) | Resolution |
|---|---|---|
| Display serif | DTF §4.1 bans Fraunces as a default: it is one of the two "LLM-favorite" display serifs. Override allowed with explicit brand justification (preflight: "or it is, with explicit brand justification") | **Superseded (v1.2.2):** the couple removed both display serifs. Karla now carries display and body; Great Vibes is the only decorative face. The earlier Fraunces justification is retained here for history but no longer applies |
| Icon library | DTF §3.C discourages lucide (allowed if requested/already used); high-end §2 bans thick-stroked icons | **RESOLVED (couple confirmed at the M3 wrap-up):** `@phosphor-icons/react` (weight `light`) is the project icon set; DESIGN §8 updated accordingly |
| Eyebrows | DTF §4.7 cap: max 1 eyebrow per 3 sections, hero counts as 1 | Form-card sketch amended: its "RSVP" eyebrow is dropped (headlines carry the sections). Page will use **zero decorative eyebrows**; the type scale keeps the 13px badge level reserved for semantic badges only |
| Card architecture | high-end §4.A "Double-Bezel": outer shell + inner core with concentric radii | **Retired (v1.6):** the guest page is card-free and the admin login was unboxed; the `DoubleBezel` primitive is removed. Cards remain only for admin data surfaces (stat tiles, table). |
| Section padding | high-end §4.C demands py-24 minimum (its mobile rule allows px-4/py-8 <768px) | Desktop `py-24` as decided (approved); mobile `py-16` exceeds the skill's own mobile minimum (py-8) |
| Accent count | DTF §4.2 "max 1 accent" | Champagne gold is decoration-only (thin rules/ornaments); **interactive accent = sage, locked page-wide**. No interactive element ever uses gold |
| Hero stack | DTF §4.7: max 4 text elements, subtext ≤ 20 words, prefs pt-24 cap | Hero = names (headline, 1-2 lines) + one date/location subtext line ≤ 20 words + 1 CTA; no eyebrow; padding ≤ pt-24 on desktop |
| Content density | DTF §4.9 sub-paragraphs ≤ 25 words | Exception recorded: story section copy is couple-verbatim (user-provided fact; brief names the copy). Presenting with larger measure + more whitespace to compensate |
| Dark mode | DTF §6.C/§8 wants both modes unless user instructed otherwise | Light-only v1 is an explicit couple decision (recorded in PRD non-goals); dark mode stays a later-phase consideration |
| Images | DTF §4.8: real asset required in hero | Overridden by the couple (v1.2): the hero is type-led with no photograph. Real assets remain elsewhere (dress-code sample via `next/image`); no fake shots, no hand-rolled decorative SVGs |

### 14.5 Motion mapping (ties to §9 easing column)
| §9 word | Token curve | Notes |
|---|---|---|
| "ease-out" (enter) | `cubic-bezier(0.16, 1, 0.3, 1)` | taste §5.C canonical curve |
| "ease-in" (exit) | `cubic-bezier(0.7, 0, 0.84, 0)` | quick exit, never on enter |
| spring (success state only) | `cubic-bezier(0.32, 0.72, 0, 1)` fallback | high-end §5 curve; only for the confirmation card's single rise |

### 14.6 Ready-to-paste design tokens (Tailwind v4 `@theme` for `app/globals.css`)
```css
@import "tailwindcss";

@theme {
  /* ---- Colors — DESIGN.md §3 (1:1) ------------------------- */
  --color-page-ivory: #FAF7F0;
  --color-card: #FFFFFF;
  --color-warm: #F3EEE3;
  --color-line: #E6DFD0;
  --color-ink: #2F2A20;
  --color-ink-soft: #6B6353;
  --color-ink-faint: #9A917F;
  --color-primary: #5B6E4F;        /* deep sage */
  --color-primary-dark: #4A5A40;    /* hover/active */
  --color-primary-soft: #DCE3D2;    /* chips, soft sections */
  --color-gold: #B79B5B;            /* decorative rules only */
  --color-danger: #9C4430;
  --color-warning: #8F6B2A;

  /* ---- Radius — DESIGN.md §7 -------------------------------- */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* ---- Shadows — DESIGN.md §7 ------------------------------- */
  --shadow-card: 0 1px 2px rgba(47,42,32,.05), 0 8px 24px rgba(47,42,32,.06);
  --shadow-card-hover: 0 2px 3px rgba(47,42,32,.06), 0 12px 32px rgba(47,42,32,.09);
  --shadow-elevated: 0 2px 4px rgba(47,42,32,.07), 0 16px 40px rgba(47,42,32,.12);

  /* ---- Type scale — DESIGN.md §4 ----------------------------- */
  --text-hero: 44px;  --text-hero--line-height: 1.05;  --text-hero--letter-spacing: -0.01em;  --text-hero--font-weight: 300;
  --text-h1: 34px;    --text-h1--line-height: 1.15;    --text-h1--letter-spacing: -0.005em;
  --text-h2: 26px;    --text-h2--line-height: 1.2;
  --text-h3: 21px;    --text-h3--line-height: 1.3;     --text-h3--font-weight: 600;
  --text-body: 17px;  --text-body--line-height: 1.6;
  --text-caption: 14px; --text-caption--line-height: 1.45; --text-caption--letter-spacing: 0.01em;
  /* badge level reserved for semantic badges (see §14.4 eyebrow rule) */
  --text-badge: 13px; --text-badge--line-height: 1.2; --text-badge--letter-spacing: 0.08em;

  /* ---- Fonts — wired to next/font variables at M4 ----------- */
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-karla), system-ui, sans-serif;

  /* ---- Motion — DESIGN.md §9 + §14.5 ------------------------- */
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);

  /* ---- Breakpoints — DESIGN.md §11 --------------------------- */
  --breakpoint-sm: 40rem;   /* 640  phones landscape */
  --breakpoint-md: 48rem;   /* 768  tablets */
  --breakpoint-lg: 64rem;   /* 1024 desktop / admin */
}
```
(Body text never below 17px mobile: per §4 note. `motion-reduce:` variants
ship per §9 and §12.)

### 14.7 Stage 2 validation result
- Token block above checked 1:1 against DESIGN.md §3–§7 values (10 colors, 3
  radii, 3 shadows, 7 type levels, 3 breakpoints) via the validation script
  at the end of this stage.
- Pre-flight (DTF §14) runs on real components at M4; the taste log above
  pre-answers the mechanical checks (eyebrow count, locks, hero stack).
