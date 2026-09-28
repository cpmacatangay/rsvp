# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 App Router + server actions, Neon Postgres (Drizzle ORM), Vercel free
tier (function region `sin1`), Tailwind v4 tokens, `motion` for animation.
Decided by the couple during planning rounds 1-2; recorded in
`context/PRD.md` §7 and `context/ARCHITECTURE.md` §14.

## Users

Primary: guests of Christian Paul & Christine Jane's wedding. 63 invited
households (capacity ≈ 136 adults + 16 children), ages roughly 20-80+, almost
all arriving on phones via a link shared through messaging apps. Comfort spans
smartphone-native to wary-of-apps older relatives. Their job: learn the
essentials of the day (where, when, schedule, dress code) and confirm attendance
in under two minutes without an account.

Secondary: the couple themselves. They check responses and totals on a phone
between appointments, and export a CSV for the caterer and seating planner.

## Product Purpose

A one-page wedding RSVP. Guests read the essentials, find their household from
a preloaded list, and answer with capped guest counts and a dietary note. The
couple gets a single accurate headcount plus per-household status. Success means
≥ 90% of households responded by the deadline (Asia/Manila state), a reliable
form on mid-range and older phones, and zero-lost submissions.

## Positioning

The single authoritative RSVP record for this wedding. Every guest answers
against their actual invitation (preloaded household with enforced caps), the
latest submission always wins, and every state tells the truth about what was
recorded. A generic form link cannot truthfully copy that.

## Operating Context

- Arrival: link shared like a WhatsApp message, opened on a phone.
- Venue: Minor Basilica and National Shrine of Our Lady of Peñafrancia,
  Naga City (couple's own maps link in `context/CONTENT.md`).
- Deadline logic computed in Asia/Manila; deadline date itself is an open fact.
- The couple consumes the data through `/admin` + CSV; not via email.
- Content facts, guest list, photo, and story live in `context/CONTENT.md`.

## Capabilities and Constraints

- RSVP v1: attending yes/no; guest count clamped to the household's caps;
  dietary note ≤ 280 chars; resubmission overwrites until close; on-screen
  animated confirmation only.
- Deliberately absent (PRD non-goals): email/SMS confirmations, meal choice,
  song requests, guest messages, household CRUD in the admin, PWA install.
- Admin: one shared password from env; dashboard table + totals + CSV export.
- Accessibility bar: WCAG 2.1 AA, tuned for older guests (48px targets, 17px
  body, keyboard + screen reader operable, reduced-motion honored).

## Brand Commitments

- Names as wordmark: Christian Paul & Christine Jane. Copy: English only.
- Venue as named (Basilica) with the couple's maps link.
- Dress code follows the RSVP palette (ivory / cream / sage / champagne).
- Our-story text is couple-verbatim; not to be rewritten short.
- Design direction (confirmed): soft premium, ivory + sage, dials 4/4/3,
  per `context/DESIGN.md`.

## Evidence on Hand

- Verified guest list (63 households, 11 cap-unconfirmed flagged): real input in
  `context/CONTENT.md` §2. Must not be fabricated or "completed".
- Hero photo: `assets/hero/cpcj.jpg` (real couple photograph).
- Venue: the couple's own Google Maps share link (resolved to the Basilica).
- No testimonials, benchmarks, or press exist; none may be invented.

## Product Principles

1. Truth over polish: every state confirms exactly what was recorded, and error
   states tell guests what to do next.
2. One decision per screen for guests; no accounts, no installs, no dead ends.
3. The invitation data is sacred: guest caps come from the couple's list and
   are clamped, never guessed.
4. Reliability beats cleverness on a three-year-old Android at a family party.

## Accessibility & Inclusion

Older relatives with reduced vision and dexterity are a first-class audience:
AA contrast pairs, 48px tap targets, readable body sizes, focus-visible rings,
reduced-motion honored everywhere. Plain warm English copy.
