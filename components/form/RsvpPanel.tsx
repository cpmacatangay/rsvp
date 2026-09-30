'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { RsvpCombobox, type HouseholdPick } from '~/components/form/RsvpCombobox';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Field, controlClass } from '~/components/ui/Field';
import { Stepper } from '~/components/ui/Stepper';
import { statusView } from '~/lib/status';
import { copy } from '~/lib/config';
import { submitRsvp, type RsvpFormState } from '~/app/actions/rsvp';

/**
 * RSVP panel — client island for the guest flow (US3-US7) with the plain
 * <form> progressive no-JS fallback: a typed name + native number inputs
 * (PRD §6.3; ARCH §5). JS: type-ahead picks the household, steppers run, the
 * success card crossfades in. No-JS: the noscript twin submits the same
 * server action and re-renders this page with the same success state.
 */

type Phase = 'search' | 'answer';

export function RsvpPanel() {
  const [state, formAction, pending] = useActionState(submitRsvp, null);
  const [phase, setPhase] = useState<Phase>('search');
  const [household, setHousehold] = useState<HouseholdPick | null>(null);
  const [attend, setAttend] = useState<'accepted' | 'declined' | ''>('');
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  /** true once the guest interacted: motion runs only post-hydration states */
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const successRef = useRef<HTMLDivElement>(null);

  const status = state === null ? 'idle' : state.ok ? 'success' : 'error';

  /** keyboard + screen-reader focus lands on the confirmation (M7 craft) */
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function pick(pick: HouseholdPick) {
    setHousehold(pick);
    if (pick.previous) {
      // returning guest (US6): pre-fill their recorded answer
      setAttend(pick.previous.status);
      setAdults(Math.min(pick.previous.adults, pick.maxAdults));
      setKids(Math.min(pick.previous.kids, pick.maxKids));
    } else {
      setAttend('');
      setAdults(1);
      setKids(0);
    }
    setTouched(true);
    setPhase('answer');
  }

  function backToSearch() {
    setPhase('search');
    setHousehold(null);
    setAttend('');
  }

  const success = status === 'success' && state?.data ? state.data : null;
  const closed = status === 'error' && state?.reason === 'closed';
  const failure = status === 'error' ? state! : null;

  /**
   * Motion per Emil's framework (M7): asymmetric enter/exit, hardware-safe,
   * custom curves from DESIGN tokens — enter ease-out 240ms, exit faster
   * 150ms ("system responds fast"), success gets the drawer curve.
   */
  const enterEase = [0.16, 1, 0.3, 1] as const;
  const exitEase = [0.7, 0, 0.84, 0] as const;
  const successEase = [0.32, 0.72, 0, 1] as const;

  /**
   * Motion per Emil's framework (M7): asymmetric enter/exit, hardware-safe,
   * custom curves — enter ease-out 240ms, exit faster 150ms ("system responds
   * fast"), success gets the drawer curve; framer x/y shorthands avoided in
   * favor of the full transform string (hardware acceleration, Emil §Perf).
   */
  const motionSettings = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : {
        initial: { opacity: 0, transform: 'translateY(12px)' },
        animate: {
          opacity: 1,
          transform: 'translateY(0px)',
          transition: { duration: 0.24, ease: enterEase },
        },
        exit: {
          opacity: 0,
          transform: 'translateY(-8px)',
          /** asymmetric: the system always steps aside faster (Emil §Timing) */
          transition: { duration: 0.15, ease: exitEase },
        },
      };

  const allowance =
    household === null
      ? ''
      : `This invitation covers ${household.maxAdults} adult${household.maxAdults === 1 ? '' : 's'}${
          household.maxKids > 0
            ? ` and ${household.maxKids} child${household.maxKids === 1 ? '' : 'ren'}`
            : ''
        }.`;

  /** single-authored search content: plain on first paint (hydration-safe), motion after.
   * Headline + lead moved to RsvpSection (the couple's no-card pass, 2026-09-30). */
  const searchContent = (
    <>
      <RsvpCombobox onPick={pick} />
    </>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* No-JS twin (PRD §6.3): typed name, native number inputs, same action. */}
      <noscript>
        <form action={formAction} className="flex flex-col gap-4">
          <p className="font-body text-caption text-ink-soft">
            JavaScript is off. Type your name exactly as it reads on the invitation.
          </p>
          <Field
            id="lookupName-njs"
            label="Your name on the invitation"
            control={
              <input
                id="lookupName-njs"
                name="lookupName"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                enterKeyHint="send"
                className={controlClass(null)}
              />
            }
          />
          <fieldset className="flex flex-col gap-2">
            <legend className="font-body text-caption text-ink-soft">Will you come?</legend>
            <label className="flex items-center gap-2 font-body text-body text-ink">
              <input type="radio" name="status" value="accepted" required className="accent-[#5B6E4F]" />
              {copy.accept}
            </label>
            <label className="flex items-center gap-2 font-body text-body text-ink">
              <input type="radio" name="status" value="declined" className="accent-[#5B6E4F]" />
              {copy.decline}
            </label>
          </fieldset>
          <Field
            id="adults-njs"
            label="Adults coming"
            control={
              <input
                type="number"
                id="adults-njs"
                name="adults"
                min={0}
                max={10}
                defaultValue={1}
                required
                className={controlClass(null)}
              />
            }
            hint="Counted against your invitation automatically."
          />
          <Field
            id="kids-njs"
            label="Children coming"
            control={
              <input
                type="number"
                id="kids-njs"
                name="kids"
                min={0}
                max={10}
                defaultValue={0}
                className={controlClass(null)}
              />
            }
          />
          <Field
            id="dietary-njs"
            label="Dietary notes (optional)"
            control={<textarea id="dietary-njs" name="dietary" rows={3} maxLength={280} className={controlClass(null)} />}
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0"
          />
          <Button type="submit">Send RSVP</Button>
        </form>
      </noscript>

      <div className="js-rsvp-flow">
        {/* hide the interactive flow when scripts are disabled */}
        <noscript>
          <style>{'.js-rsvp-flow { display: none; }'}</style>
        </noscript>

        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.div
              key="success"
              ref={successRef}
              tabIndex={-1}
              {...motionSettings}
              transition={{ duration: reduce ? 0.01 : 0.3, ease: successEase }}
              className="flex flex-col gap-4 outline-none"
              role="status"
            >
              <Badge
                label={success.status === 'accepted' ? 'Accepted' : 'Declined'}
                dot={statusView(success.status).dot}
                className={statusView(success.status).className}
              />
              <h3 className="font-display text-h1 text-ink">
                You are all set, {success.displayName}.
              </h3>
              <p className="font-body text-body text-ink">
                {success.status === 'accepted'
                  ? `We recorded ${success.adults} adult${success.adults === 1 ? '' : 's'}${
                      success.kids > 0
                        ? ` and ${success.kids} child${success.kids === 1 ? '' : 'ren'}`
                        : ''
                    } coming.`
                  : 'We recorded that you cannot make it, and that is completely okay.'}
                {success.dietary ? ` Dietary notes: ${success.dietary}` : ''}
              </p>
              <p className="font-body text-caption text-ink-soft">
                Changed your mind before the deadline? Resubmitting updates your answer.
              </p>
              <div>
                <Button variant="ghost" onClick={backToSearch}>
                  Make a change
                </Button>
              </div>
            </motion.div>
          ) : closed ? (
            <motion.div
              key="closed"
              {...motionSettings}
              transition={{ duration: reduce ? 0.01 : 0.24, ease: enterEase }}
              className="flex flex-col gap-3"
            >
              <h3 className="font-display text-h1 text-ink">{copy.closedHeadline}</h3>
              <p className="font-body text-body text-ink">{copy.closedBody}</p>
            </motion.div>
          ) : phase === 'search' ? (
            touched ? (
              <motion.div
                key="search"
                {...motionSettings}
                transition={{ duration: reduce ? 0.01 : 0.24, ease: enterEase }}
                className="flex flex-col gap-3"
              >
                {searchContent}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">{searchContent}</div>
            )
          ) : (
            <motion.form
              key="answer"
              {...motionSettings}
              transition={{ duration: reduce ? 0.01 : 0.24, ease: enterEase }}
              action={formAction}
              className="flex flex-col gap-4"
            >
              {/* identifiers travel with every submission, accepted or declined */}
              <input type="hidden" name="code" value={household?.code ?? ''} />
              <input type="hidden" name="adults" value={adults} />
              <input type="hidden" name="kids" value={kids} />

              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-h2 text-ink">{household?.label}</h3>
                <Button variant="ghost" onClick={backToSearch} className="px-3">
                  Not you?
                </Button>
              </div>
              <p className="font-body text-caption text-ink-soft">{allowance}</p>
              {household?.previous ? (
                <p className="font-body text-caption text-ink-soft" role="status">
                  Your earlier RSVP on{' '}
                  {new Intl.DateTimeFormat('en-PH', {
                    dateStyle: 'medium',
                    timeZone: 'Asia/Manila',
                  }).format(new Date(household.previous.respondedAt))}
                  : {household.previous.status === 'accepted' ? copy.accept.toLowerCase() : copy.decline.toLowerCase()}
                  {household.previous.status === 'accepted'
                    ? ` with ${household.previous.adults} adult${household.previous.adults === 1 ? '' : 's'}${
                        household.previous.kids > 0
                          ? ` ${household.previous.kids} child${household.previous.kids === 1 ? '' : 'ren'}`
                          : ''
                      }`
                    : ''}
                  . We kept it below; sending again updates it.
                </p>
              ) : null}

              <fieldset className="grid grid-cols-2 gap-3">
                <legend className="sr-only">Will you come?</legend>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="accepted"
                    checked={attend === 'accepted'}
                    onChange={() => setAttend('accepted')}
                    required
                    className="peer sr-only"
                  />
                  <span className="flex h-12 items-center justify-center rounded-full border-[1.5px] border-primary px-3 text-center font-body text-caption uppercase text-primary transition-colors duration-150 ease-enter peer-checked:bg-primary peer-checked:text-page-ivory">
                    {copy.accept}
                  </span>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="declined"
                    checked={attend === 'declined'}
                    onChange={() => setAttend('declined')}
                    className="peer sr-only"
                  />
                  <span className="flex h-12 items-center justify-center rounded-full border-[1.5px] border-primary px-3 text-center font-body text-caption uppercase text-primary transition-colors duration-150 ease-enter peer-checked:bg-primary peer-checked:text-page-ivory">
                    {copy.decline}
                  </span>
                </label>
              </fieldset>

              {attend === 'accepted' && household ? (
                <div className="grid grid-cols-2 gap-4">
                  <Stepper label="Adults" value={adults} min={0} max={household.maxAdults} onChange={setAdults} />
                  {household.maxKids > 0 ? (
                    <Stepper label="Children" value={kids} min={0} max={household.maxKids} onChange={setKids} />
                  ) : null}
                  {adults + kids < 1 ? (
                    <p className="col-span-2 font-body text-caption text-warning">
                      Please add at least one guest before sending.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {attend === 'accepted' ? (
                <Field
                  id="dietary"
                  label="Dietary notes (optional)"
                  control={
                    <textarea id="dietary" name="dietary" rows={3} maxLength={280} className={controlClass(null)} />
                  }
                  hint="Allergies or notes for the caterer, if any."
                />
              ) : null}

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0"
              />

              {failure && !failure.ok ? (
                <p className="font-body text-caption text-danger" role="alert">
                  {failure.message}
                </p>
              ) : null}

              <Button type="submit" disabled={pending || attend === ''}>
                {pending ? 'Sending…' : 'Send RSVP'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
