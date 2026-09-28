# Design System — {{PROJECT_NAME}}
**Project:** {{PROJECT_NAME}} · **Brand:** {{BRAND_NAME}} · **Styling:** {{STYLING_LIB}} · **Version:** {{X.Y}} · **Status:** {{Draft}} · **Updated:** {{DATE}}

---

## 1. Brand Identity

### Name
> **Fill:** `{{BRAND_NAME}}` — one sentence on the name.

### Tagline
> **Fill:** *(example)* "Never miss a {{THING}}."

### Brand Personality

| Attribute | Description |
|---|---|
| Tone | {{Warm/clinical/playful/...}} |
| Voice | {{...}} |
| Emotion | {{...}} |

### Target Audience
> **Fill:** Who, age range, comfort level, pain points.

---

## 2. Logo — Concept

> **Fill:** Shape, mark, color, minimum size, favicon treatment. *(delete if no logo yet)*

---

## 3. Color Palette

> **Fill:** Replace hexes. The "{{STYLING_LIB}} class" column is optional — keep
> if your styling uses named tokens, else delete the column.

### Primary & Accent

| Token | Hex | {{Styling class}} | Usage |
|---|---|---|---|
| Primary | `{{#HEX}}` | | Buttons, links, active states |
| Primary hover | `{{#HEX}}` | | Hover state |
| Primary light | `{{#HEX}}` | | Light backgrounds, badges |
| Accent | `{{#HEX}}` | | Highlights, decorative |

### Backgrounds & Surfaces

| Token | Hex | Usage |
|---|---|---|
| Page background | `{{#HEX}}` | |
| Surface / card | `{{#HEX}}` | |
| Surface secondary | `{{#HEX}}` | |
| Divider | `{{#HEX}}` | |

### Neutrals

| Token | Hex | Usage |
|---|---|---|
| Text primary | `{{#HEX}}` | |
| Text secondary | `{{#HEX}}` | |
| Text placeholder | `{{#HEX}}` | |
| Text inverse | `{{#HEX}}` | |

### Semantic (Status) Colors

| Token | Hex | AA on white? |
|---|---|---|
| {{SUCCESS}} | `{{#HEX}}` | {{yes/no}} |
| {{WARNING}} | `{{#HEX}}` | {{yes/no}} |
| {{ERROR}} | `{{#HEX}}` | {{yes/no}} |
| {{INFO/NEUTRAL}} | `{{#HEX}}` | {{yes/no}} |

---

## 4. Typography

### Font Stack

| Role | Font | Fallback | Weights |
|---|---|---|---|
| Headings / Display | {{FONT_1}} | {{fallback}} | {{600}} |
| Body / UI | {{FONT_2}} | {{fallback}} | {{400, 600}} |

### Type Scale

| Level | Size | Weight | Line Height | Letter-spacing | Font |
|---|---|---|---|---|---|
| Hero | {{44}}px | {{600}} | {{1.12}} | {{-0.01em}} | {{FONT_1}} |
| H1 | {{34}}px | | | | |
| H2 | {{26}}px | | | | |
| H3 | {{22}}px | | | | |
| Body | {{17}}px | {{400}} | {{1.55}} | | {{FONT_2}} |
| Caption | {{14}}px | | | | |
| Badge | {{13}}px | | | | |

> **Fill:** Only keep the levels you actually use.

---

## 5. Spacing Scale

> **Fill:** Keep the 4px base unless you have a reason otherwise — it's a safe default.

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

### Layout defaults
> **Fill:** Page padding, section gaps, card padding. *(example)* `px-4 md:px-6 lg:px-8`.

---

## 6. Layout & Grid

> **Fill:** Grid approach (card-based? tables?). *(example)*

### Grid breakpoints

| Breakpoint | Columns | Max width | Gap |
|---|---|---|---|
| Mobile (<640px) | 1 | 100% | {{gap}} |
| Tablet (640–1023px) | 2 | {{640px}} | |
| Desktop (1024px+) | 3 | {{1200px}} | |

### Component anatomy
> **Fill:** ASCII sketch of your primary card/row. *(delete if N/A)*

---

## 7. Border Radius & Shadows

### Border Radius

| Token | px | Usage |
|---|---|---|
| sm | 4 | badges |
| md | 8 | secondary cards |
| lg | 12 | buttons, cards, inputs |
| xl | 16 | dialogs |
| full | 9999 | pills, avatars |

### Shadows

| Token | Value | Usage |
|---|---|---|
| card | `{{0 2px 8px rgba(0,0,0,0.06)}}` | |
| card-hover | `{{...}}` | |
| elevated | `{{...}}` | |

---

## 8. Iconography

- **Source:** {{ICON_SET}} *(example: Heroicons outline set)*
- **Sizes:** {{default / compact / avatar sizes}}
- **Color:** {{inherit text or brand color}}

### Key icons
> **Fill:** table of context → icon → size. *(delete if N/A)*

---

## 9. Animations & Transitions

> **Fill:** All animations must respect `prefers-reduced-motion`. *(example)*

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Card hover | scale + shadow lift | 200ms | ease-out |
| Modal overlay | fade in | 200ms | ease-out |
| Toast | slide in | 300ms | ease-out |

---

## 10. Component Styling Notes

### Buttons
> **Fill:** Variant styles (primary/secondary/ghost/danger/icon), min height
> (≥44px tap target), focus ring, disabled state.

### Input Fields
> **Fill:** Border, focus, error, label, placeholder styles.

### Status Pills / Badges
> **Fill:** Per-status style + shared pill structure.

### Toast / Notification
> **Fill:** Position, duration, dismiss, max width.

### Modals
> **Fill:** Overlay, content, title, actions.

---

## 11. Responsive Breakpoints

> **Fill:** *(example)*

| Label | Min-width | Target |
|---|---|---|
| `sm` | 640px | phones landscape |
| `md` | 768px | tablets |
| `lg` | 1024px | desktop |
| `xl` | 1280px | wide |

Mobile-first: base styles target phones, breakpoints override upward.

---

## 12. Accessibility (WCAG 2.1 AA)

### Color & Contrast
- All text/background pairs meet **4.5:1** (AA normal text); large text ≥3:1.
- Verify each semantic color in §3. Fix or relegate failing colors to decoration.

### Focus & Keyboard
- Visible focus ring on all interactive elements.
- Tab order follows visual layout; modals trap focus and close on Escape.

### Screen Readers
- Icon-only buttons have `aria-label`.
- Dynamic updates announce via `role="status"` + `aria-live="polite"`.
- Skip-to-content link on every page.

### Reduced Motion
- Wrap animations in `@media (prefers-reduced-motion: no-preference)` or use a
  `motion-safe:` variant.

### Touch Targets
- Interactive elements ≥ 44×44 px.

---

## 13. Email Design Consistency

> **Fill:** *(delete if the product sends no email)* Brand-consistent HTML email:
> header bar, centered 600px body, system font fallback, CTA button, footer
> with unsubscribe link.

---

## 14. Platform Port

> **Fill:** *(delete if N/A)* If a native/mobile client exists, map web design
> tokens to the platform's equivalents. See `MOBILE.md`.

| Web token | Platform token | Value |
|---|---|---|
| Primary `{{#HEX}}` | `{{ColorScheme.primary}}` | `{{Color(0xFF...)}}` |
| H1 {{34}}px | `{{headlineLarge}}` | {{34sp}} |

---

## 15. Future Considerations

> **Fill:** Dark mode, i18n, uploads, illustration set, motion design, more clients.
