import { CountdownCell } from '~/components/sections/CountdownCell';
import { Section } from '~/components/ui/Section';
import { weddingDate, weddingDateDisplay } from '~/lib/config';

/**
 * Countdown section (v1.2 review): card removed — the numerals are the
 * decoration now, floating on the ivory with generous air. Date caption
 * sits beneath in sentence casing (casing ruling: no forced uppercase).
 */
export function CountdownSection() {
  return (
    <Section id="countdown" ariaLabel="Counting down" title="Counting Down">
      <div className="mt-8 flex flex-col items-center gap-4">
        <CountdownCell targetMs={weddingDate.getTime()} />
        <p className="font-body text-caption text-ink-soft">
          {weddingDateDisplay} <span aria-hidden="true">·</span> Naga City
        </p>
      </div>
    </Section>
  );
}
