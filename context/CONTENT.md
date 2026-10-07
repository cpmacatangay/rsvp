# Confirmed Content & Inputs — rsvp
**Status:** Confirmed records · **Updated:** 2026-10-08
**Legend:** **CONFIRMED** = user-provided fact. **RECOMMENDATION** = drafted, needs user approval. **OPEN** = user to supply (ship-gated).

---

## 1. Wedding facts

| Item | Value | Status |
|---|---|---|
| Couple | Christian Paul & Christine Jane | CONFIRMED |
| Wedding date | Sunday, August 6, 2028 (Asia/Manila) | CONFIRMED |
| Ceremony time | 14:00 (Asia/Manila) | CONFIRMED (provisional: couple noted it might change; env/config only, no code change needed) |
| Venue | Minor Basilica and National Shrine of Our Lady of Peñafrancia | CONFIRMED |
| City | Naga City, Camarines Sur, Philippines | CONFIRMED (from the couple's own maps link) |
| Maps link | https://maps.app.goo.gl/axEuRdLZbETTy5UXA | CONFIRMED |
| Reception venue | Villa Caceres Hotel | CONFIRMED (couple, 2026-10-08; name resolved from their maps link) |
| Reception maps link | https://maps.app.goo.gl/z8DwwBUbPT3CZM4ZA | CONFIRMED (couple, 2026-10-08) |
| RSVP deadline | July 10, 2028, end-of-day Asia/Manila | CONFIRMED (provisional: couple noted it might change; lives in `RSVP_DEADLINE_DATE` env only) |
| Deadline timezone | Asia/Manila | CONFIRMED |

## 2. Guest list (seed source — 63 households)

Parsing rule from the couple's input: `Name - N adults[, M children]`; lines
without a count are cap-unconfirmed households.

**CONFIRMED DECISION (answer A):** cap-unconfirmed households seed as
`maxAdults = 1, maxKids = 0`, appear in the seed report and admin table
flagged **"cap unconfirmed"**, and are corrected by editing this list plus an
idempotent re-seed. No admin CRUD is added for this (PRD non-goal stands).

```csv
displayName,maxAdults,maxKids
Candyce Macatangay,2,1
Evelyn Camilo,2,3
Tito Ling,2,0
Tito Bernard,6,0
Viness Magno,2,0
Love Magno,2,0
Danilo Pelo,3,0
Lino Calamiong,2,0
Clarisse Calamiong,2,0
Uncle Richard,4,1
Ate Em,2,0
Uncle Jimmy,2,0
Kuya Julius,3,0
Kuya Jo,4,0
Kuya Godo,2,2
Uncle Joseph,4,0
Ate Kris,6,0
Tito Char,2,2
Tito Rodel,1,0
Tito Feng,4,2
Tita Verlyn,4,0
Tita Dess,4,0
Tito Eric,2,0
Tito Darwin,2,0
Kuya Elbert,4,0
Tita Val,5,0
Tita Gin,3,0
Tita Celine,1,0
Nanang Bing,1,0
Ate Mylene,1,0
Maliah,1,0
Tito Mike,2,0
Kent,2,0
Mai,2,0
Mic,2,0
Papa Dex,2,0
Marielle,2,0
Camille,2,1
Bonnie,2,1
Karl Bugtai,2,1
Rex Jerus,2,1
Rommel Flores,2,1
Alfonso,2,0
Wyben,2,0
Carl Calzada,2,0
Dan Lester,2,0
Dibon,2,0
Ralph,2,0
Jon,2,0
Vince,2,0
Karl Abregana,2,0
Carlo,1,0
Ryan,1,0
Deli,2,0
Chris,2,0
Sean,2,0
Allan,2,0
Abby,1,0
Eloisa,1,0
Kail,1,0
Gershee,2,0
Klein,1,0
Melody,6,0
```

Cap-unconfirmed rows (11): Tito Rodel, Tita Celine, Nanang Bing, Ate Mylene,
Maliah, Carlo, Ryan, Abby, Eloisa, Kail, Klein.
Totals if caps hold (verified by the seed parser): **136 adults named by the
couple + 11 cap-defaulted singles = 147 adults; 16 children; 163 invited
capacity.**

Notes: `data/guest-list.csv` is generated from this table at build step 4.2;
display names keep honorifics verbatim; search normalizes to lowercase tokens
so "Rodel" matches "Tito Rodel".

## 3. Photos

| Item | Value | Status |
|---|---|---|
| Hero photo | `assets/hero/cpcj.jpg` (4.0 MB, single photo) | CONFIRMED |
| Multi-photo layout | Not provided; hero designed for 1 photo | CONFIRMED |

Alt text: written at build by describing the visible scene, then verified
wording with the couple (RECOMMENDATION to confirm at Milestone 4 copy review).

## 4. Our story (verbatim)

"We both swiped right on a quiet weeknight, not expecting much more than a good
conversation. What started as simple messages quickly turned into hours of
talking that felt as easy as breathing. Across the screen, we found a real
connection that made the distance between us feel small. Looking back, that
simple digital match was the moment my whole world changed for the better."

RECOMMENDATION (minor, pending approval at M4 review): singular "my whole
world" → "our whole world" for voice consistency; no other edits proposed.

## 5. Day schedule

14:00 ceremony → 15:30 reception → 18:30 dinner → 21:00 party — CONFIRMED.

Labels RECOMMENDATION (approve at M4): "Ceremony", "Reception", "Dinner",
"Party".

## 6. Dress code

Couple's rule (CONFIRMED): same palette as the RSVP site
(ivory / cream / sage / champagne).
Draft copy RECOMMENDATION (approve at M4):
"Festive attire in our palette: ivory, cream, sage, soft gold."
(Colon replaces the em-dash: the taste skill hard-bans em-dashes in
page-visible copy — applied here for the record.)
Optional gentle note (deferred decision): "Please leave bridal white for our
bride." Included only if the couple approves at M4.

## 7. Location block

CONFIRMED: maps handled as a tappable link-out to the confirmed Google Maps
URL (no third-party embed iframe — performance budget; deferred decision log).

## 8. Copy language

CONFIRMED: English only.
