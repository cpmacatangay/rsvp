import { Section } from '~/components/ui/Section';
import { story } from '~/lib/config';

/**
 * Our story (#story) — couple-verbatim (CONTENT.md §4); warm surface alt.
 * v1.2 review: the paragraph now uses the same body typography as other
 * sections' content (Karla 17px, ink) instead of the display serif.
 */
export function StorySection() {
  return (
    <Section id="story" ariaLabel="Our story" tone="warm" title="Our Story">
      <p className="mt-4 max-w-[65ch] font-body text-body text-ink">{story}</p>
    </Section>
  );
}
