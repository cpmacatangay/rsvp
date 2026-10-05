import { CountdownCell } from '~/components/sections/CountdownCell';
import { Card } from '~/components/ui/Card';
import { Section } from '~/components/ui/Section';
import { weddingDate, weddingDateDisplay } from '~/lib/config';

/**
 * Countdown section (v1.1): the date card alone — venues moved to their own
 * section. Wedding date lives in lib/config (single source); counts to the
 * first minute of the day in Asia/Manila.
 */
export function CountdownSection() {
  return (
    <Section id="countdown" ariaLabel="Counting down" title="Counting down">
      <div className="mt-4">
        <Card className="flex flex-col gap-2">
          <CountdownCell targetMs={weddingDate.getTime()} />
          <p className="font-body text-caption text-ink-soft">
            {weddingDateDisplay} <span aria-hidden="true">·</span> Naga City
          </p>
        </Card>
      </div>
    </Section>
  );
}
