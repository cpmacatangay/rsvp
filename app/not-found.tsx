import { Button } from '~/components/ui/Button';
import { couple } from '~/lib/config';

/** 404 — honest and on-brand; the only real destination is the guest page. */
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-display text-h1 text-ink">That page does not exist</h1>
      <p className="font-body text-body text-ink-soft">
        {couple.names.split(' & ')[0]} and {couple.names.split(' & ')[1]} are getting married —
        the wedding page lives at the address your invitation link pointed to.
      </p>
      <div>
        <Button href="/" variant="primary">
          Back to the main page
        </Button>
      </div>
    </main>
  );
}
