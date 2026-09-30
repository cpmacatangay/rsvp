'use client';

import { copy } from '~/lib/config';
import { Field, controlClass } from '~/components/ui/Field';
import { Button } from '~/components/ui/Button';

/**
 * No-JS twin (PRD §6.3): typed name, native number inputs, bound to the SAME
 * server action the interactive form uses through its useActionState dispatch
 * (M8-A3 split out of RsvpPanel to stay under the 300-line ceiling; strings
 * verbatim from the interactive twin).
 */

export function NoJsRsvpForm({
  action,
}: {
  /** the useActionState-bound dispatch (progressive form POST) */
  action: (formData: FormData) => void;
}) {
  return (
    <noscript>
      <form action={action} className="flex flex-col gap-4">
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
  );
}
