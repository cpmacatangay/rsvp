'use client';

import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { statusView } from '~/lib/status';

/**
 * The success card body (M10: extracted so RsvpPanel stays under its size
 * ceiling). Dark, exact strings verbatim from the pre-split implementation.
 */

export type RsvpSuccessData = {
  displayName: string;
  status: 'accepted' | 'declined';
  adults: number;
  kids: number;
  dietary: string | null;
};

export function RsvpSuccessContent({
  success,
  onChange,
}: {
  success: RsvpSuccessData;
  onChange: () => void;
}) {
  return (
    <>
      <Badge
        label={success.status === 'accepted' ? 'Accepted' : 'Declined'}
        dot={statusView(success.status).dot}
        className={statusView(success.status).className}
      />
      <h3 className="font-display text-h1 text-ink">You are all set, {success.displayName}.</h3>
      <p className="font-body text-body text-ink">
        {success.status === 'accepted'
          ? `We recorded ${success.adults} adult${success.adults === 1 ? '' : 's'}${
              success.kids > 0 ? ` and ${success.kids} child${success.kids === 1 ? '' : 'ren'}` : ''
            } coming.`
          : 'We recorded that you cannot make it, and that is completely okay.'}
        {success.dietary ? ` Dietary notes: ${success.dietary}` : ''}
      </p>
      <p className="font-body text-caption text-ink-soft">
        Changed your mind before the deadline? Resubmitting updates your answer.
      </p>
      <div>
        <Button variant="ghost" onClick={onChange}>
          Make a change
        </Button>
      </div>
    </>
  );
}
