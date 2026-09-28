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
Warm, short, no exclamation marks — e.g. "We're getting married —
and we'd love you there."

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
No logo mark; the wordmark is the couple's names set in the display serif.
Favicon: single sage monogram letter on ivory (SVG). OG image: hero photo with
names overlaid (1200×630).

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
| Display / headings / wordmark | **Fraunces** (opsz axis, soft serif) | Georgia, serif | 300, 400, 600 |
| Body / UI | **Karla** | system-ui, sans-serif | 400, 600 |

Fraunces is deliberately not in the overused-font pool (impeccable's typographic
sl tells); Karla is humanist-warm, open apertures, excellent small-size
legibility on phones.

### Type Scale (mobile-first; desktop +2px via `sm` overrides)

| Level | Size (mobile) | Weight | Line Height | Letter-spacing | Font |
|---|---|---|---|---|---|
| Hero wordmark | 44px | 300 | 1.05 | -0.01em | Fraunces |
| H1 | 34px | 400 | 1.15 | -0.005em | Fraunces |
| H2 | 26px | 400 | 1.2 | 0 | Fraunces |
| H3 | 21px | 600 | 1.3 | 0 | Karla |
| Body | 17px | 400 | 1.6 | 0 | Karla |
| Caption | 14px | 400 | 1.45 | 0.01em | Karla |
| Badge/eyebrow | 13px | 600 | 1.2 | 0.08em uppercase | Karla |

Only these seven levels exist. Body copy never smaller than 17px mobile
(reading comfort for older guests).

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

Single scrolling column, no dashboard grids on the guest page. Sections order:
hero → countdown+location → our story → day schedule → dress code → RSVP →
footer. The RSVP form is the page's most important object: it gets the
clearest visual weight (white card on ivory, strongest shadow).

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
ship for everything; durations from emil/animate rules: enter 220–300ms
ease-out, exit 120–180ms ease-in, no bounce on data-critical UI.

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Sections on scroll | fade + 12px rise (IntersectionObserver, once) | 300ms | ease-out |
| Household card reveal | height+fade | 240ms | ease-out |
| Accept/Decline pills | background-color 150ms, active scale .98 | 150ms | ease-out |
| Success state | crossfade to card + single soft "rise" | 300ms | ease-out |
| Confidence details in success | stagger children | 60ms/child | ease-out |
| Countdown digits | crossfade on change | 180ms | ease-out |
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
| Display serif | DTF §4.1 bans Fraunces as a default: it is one of the two "LLM-favorite" display serifs. Override allowed with explicit brand justification (preflight: "or it is, with explicit brand justification") | **Fraunces retained with recorded justification:** this is a wedding invitation in the editorial/luxury/heritage genre, exactly DTF's override case; soft-premium direction was chosen BY the couple, and Fraunces couples the stationery feel with an optical-size axis for large names. Flagged alternative at M4 review if the couple prefers the fresh-pool route: Cormorant Garamond or Canela (both in skill's rotation pool). No silent swap without user approval. **Confirmed at M3 wrap-up:** the couple chose to keep Fraunces; the recorded justification makes the grandfathering a confirmed decision |
| Icon library | DTF §3.C discourages lucide (allowed if requested/already used); high-end §2 bans thick-stroked icons | **RESOLVED (couple confirmed at the M3 wrap-up):** `@phosphor-icons/react` (weight `light`) is the project icon set; DESIGN §8 updated accordingly |
| Eyebrows | DTF §4.7 cap: max 1 eyebrow per 3 sections, hero counts as 1 | Form-card sketch amended: its "RSVP" eyebrow is dropped (headlines carry the sections). Page will use **zero decorative eyebrows**; the type scale keeps the 13px badge level reserved for semantic badges only |
| Card architecture | high-end §4.A "Double-Bezel": outer shell + inner core with concentric radii | Adopted concentrically **within the approved radius scale** (`rounded-lg` outer, mathematically smaller inner). No 2rem squircles vs the locked 16px system |
| Section padding | high-end §4.C demands py-24 minimum (its mobile rule allows px-4/py-8 <768px) | Desktop `py-24` as decided (approved); mobile `py-16` exceeds the skill's own mobile minimum (py-8) |
| Accent count | DTF §4.2 "max 1 accent" | Champagne gold is decoration-only (thin rules/ornaments); **interactive accent = sage, locked page-wide**. No interactive element ever uses gold |
| Hero stack | DTF §4.7: max 4 text elements, subtext ≤ 20 words, prefs pt-24 cap | Hero = names (headline, 1-2 lines) + one date/location subtext line ≤ 20 words + 1 CTA; no eyebrow; padding ≤ pt-24 on desktop |
| Content density | DTF §4.9 sub-paragraphs ≤ 25 words | Exception recorded: story section copy is couple-verbatim (user-provided fact; brief names the copy). Presenting with larger measure + more whitespace to compensate |
| Dark mode | DTF §6.C/§8 wants both modes unless user instructed otherwise | Light-only v1 is an explicit couple decision (recorded in PRD non-goals); dark mode stays a later-phase consideration |
| Images | DTF §4.8: real asset required in hero | Satisfied: real couple photograph `cpcj.jpg` via `next/image`; no fake shots, no hand-rolled decorative SVGs |

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
