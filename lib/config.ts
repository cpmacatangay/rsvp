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
  receptionNote: 'Reception to follow',
} as const;

/**
 * Wedding date — CONFIRMED for display (CONTENT.md §1; couple marked "for
 * now", reconfirm at M4 copy review). The countdown flips to "wedding day"
 * at the start of Aug 6 in Asia/Manila (= Aug 5 16:00 UTC end-of-day math).
 */
export const weddingDate = new Date(Date.UTC(2028, 7, 5, 16, 0, 0, 0)); // = 2028-08-06 00:00 +08:00

export const weddingDateDisplay = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Manila',
}).format(weddingDate);

/** Wedding-day timeline — confirmed by the couple (2026-09-30 message);
 * supersedes CONTENT.md's earlier 4-row schedule; ceremony now 3:00 pm.
 * Icon keys map to installed Phosphor icons in TimelineSection (verified). */
export const timeline = [
  { time: '2:00 PM', icon: 'handwaving', label: 'Meet & greet' },
  { time: '3:00 PM', icon: 'church', label: 'Ceremony' },
  { time: '3:30 PM', icon: 'martini', label: 'Cocktails and canapes' },
  { time: '4:00 PM', icon: 'camera', label: 'Photos' },
  { time: '5:30 PM', icon: 'cake', label: 'Cake cutting' },
  { time: '6:00 PM', icon: 'forkknife', label: 'Dinner' },
  { time: '7:30 PM', icon: 'discoball', label: 'Party' },
  { time: '11:00 PM', icon: 'moonstars', label: 'Farewells' },
] as const;

/** Our story — couple-verbatim (CONTENT.md §4). The "my→our" smoothing is a
 * RECOMMENDATION pending the couple's approval at the M4 copy review; this
 * constant must stay verbatim until then. */
export const story =
  'We both swiped right on a quiet weeknight, not expecting much more than a good conversation. What started as simple messages quickly turned into hours of talking that felt as easy as breathing. Across the screen, we found a real connection that made the distance between us feel small. Looking back, that simple digital match was the moment my whole world changed for the better.' as const;

/** Dress code — couple's rule (site palette); draft copy pending M4 approval.
 * Sample photo: assets/dress-code/dresscode.jpg (v1.1 redesign). */
export const dressCode = {
  heading: 'Dress Code',
  line: 'Festive attire in our palette: ivory, cream, sage, soft gold.',
  photo: {
    src: 'assets/dress-code/dresscode.jpg',
    alt: 'A group of guests in celebration attire among cacti, as attire inspiration',
  },
} as const;

export const copy = {
  tagline: "We're getting married. Come celebrate with us!",
  rsvpOpenHeadline: "Who's Coming?",
  accept: 'Joyfully accepts',
  decline: 'Regretfully declines',
  closedHeadline: 'RSVPs are closed',
  closedBody: 'If something changed, just send us a message directly.',
} as const;

/** v1.1 invitation-moment copy (couple-approved redesign). */
export const invitation = {
  curtainHint: 'Tap to open',
  /** hero message (v1.2): lead + two supporting sentences, couple-approved tone */
  heroMessage: {
    lead: 'We would like to invite you to celebrate the beginning of our forever.',
    body1:
      'On August 6, 2028, we will say our vows surrounded by the people we love most, and we are saving a place for you.',
    body2: 'Come as you are, bring your joy, and share this day with us.',
  },
  scratchHint: 'Scratch to discover the date',
  celebration: "We're getting married!",
  /** circle values are display-only; the machine date stays in weddingDate */
  dateParts: { month: 'August', day: '6', year: '2028' },
} as const;

/*
 * NOTE: RSVP_DEADLINE_DATE is read ONLY in lib/deadline.ts (RULES §6.6:
 * never hardcode or re-read the deadline anywhere else).
 */
