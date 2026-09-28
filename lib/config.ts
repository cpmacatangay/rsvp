/**
 * Single source of content and configuration (PRD §6.6: no CMS).
 * Facts are CONFIRMED inputs from context/CONTENT.md — see that file before
 * changing any string here. The three OPEN facts (date/time/deadline) stay
 * env- or null-driven and render gracefully until supplied.
 */

export const couple = {
  names: 'Christian Paul & Christine Jane',
  title: 'Christian Paul & Christine Jane',
} as const;

export const venue = {
  name: 'Minor Basilica and National Shrine of Our Lady of Peñafrancia',
  city: 'Naga City, Camarines Sur, Philippines',
  mapsUrl: 'https://maps.app.goo.gl/axEuRdLZbETTy5UXA',
} as const;

/** Day schedule — CONFIRMED in CONTENT.md §5; labels are the couple's pick. */
export const schedule = [
  { time: '14:00', label: 'Ceremony' },
  { time: '15:30', label: 'Reception' },
  { time: '18:30', label: 'Dinner' },
  { time: '21:00', label: 'Party' },
] as const;

/** Our story — couple-verbatim (CONTENT.md §4). The "my→our" smoothing is a
 * RECOMMENDATION pending the couple's approval at the M4 copy review; this
 * constant must stay verbatim until then. */
export const story =
  'We both swiped right on a quiet weeknight, not expecting much more than a good conversation. What started as simple messages quickly turned into hours of talking that felt as easy as breathing. Across the screen, we found a real connection that made the distance between us feel small. Looking back, that simple digital match was the moment my whole world changed for the better.' as const;

/** Dress code — couple's rule (site palette); draft copy pending M4 approval. */
export const dressCode = {
  heading: 'Dress code',
  line: 'Festive attire in our palette: ivory, cream, sage, soft gold.',
} as const;

export const copy = {
  tagline: "We're getting married. Come celebrate with us!",
  rsvpOpenHeadline: "Who's coming?",
  rsvpFindPlaceholder: 'Find your name',
  accept: 'Joyfully accepts',
  decline: 'Regretfully declines',
  closedHeadline: 'RSVPs are closed',
  closedBody: 'If something changed, just send us a message directly.',
} as const;

/*
 * NOTE: RSVP_DEADLINE_DATE is read ONLY in lib/deadline.ts (RULES §6.6:
 * never hardcode or re-read the deadline anywhere else).
 */
