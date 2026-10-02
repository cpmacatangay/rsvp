import { Section } from '~/components/ui/Section';
import { story } from '~/lib/config';

/**
 * Our story (#story) — couple-verbatim (CONTENT.md §4); warm surface alt.
 * Polish (M10): the paragraph earns the display serif at story scale —
 * typographic warmth, zero new colors or ornament.
 */

export function StorySection() {
  return (
    <Section id="story" ariaLabel="Our story" tone="warm" title="Our story">
      <p className="mt-4 max-w-[65ch] font-display text-h3 font-normal text-ink">
        {story}
      </p>
    </Section>
  );
}
