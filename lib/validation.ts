import { z } from 'zod';

/**
 * Validation — the single definition of every payload (RULES §3.4).
 * Client form and server action both derive from these schemas (`z.infer`),
 * so browser hints and server rejection cannot drift. Cross-row business
 * rules (caps of the chosen household) live in lib/rsvp.ts, which needs the
 * household row as context — a schema alone can not check that.
 */

export const attendingStatus = z.enum(['accepted', 'declined']);

export const rsvpLookupSchema = z.object({
  q: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Type at least 2 characters of your name')
    .max(80, 'Too long'),
});

/** Shared fields; honeypot `website` MUST be empty (ARCHITECTURE §10). */
export const rsvpSubmitSchema = z
  .object({
    website: z.string().max(0).optional().or(z.literal('')),
    status: attendingStatus,
    adults: z.number().int().min(0).max(10),
    kids: z.number().int().min(0).max(10),
    dietary: z.string().trim().max(280, 'Please keep the note under 280 characters').optional(),
    /** JS flow: the type-ahead resolved a household by opaque code. */
    code: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{12}$/, 'This invitation link is not valid')
      .optional(),
    /** No-JS fallback: exactly-matched household name, lowercased. */
    lookupName: z
      .string()
      .trim()
      .min(2, 'Please type your name as it appears on your invitation')
      .max(80, 'Too long')
      .optional(),
  })
  .strict()
  .refine(
    (data) => Number(data.code !== undefined) + Number(data.lookupName !== undefined) === 1,
    'Missing invitation: pick your household or type your name',
  );

export type RsvpLookupQuery = z.infer<typeof rsvpLookupSchema>;
export type RsvpSubmitPayload = z.infer<typeof rsvpSubmitSchema>;

/** Closed error union surfaced to the UI as ActionResult reasons (ARCH §4.3). */
export const actionReasons = [
  'not_found',
  'closed',
  'validation_failed',
  'rate_limited',
  'unavailable',
] as const;

export type ActionErrorReason = (typeof actionReasons)[number];
