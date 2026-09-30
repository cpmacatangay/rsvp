import { Section } from '~/components/ui/Section';
import { story } from '~/lib/config';

/** Our story (#story) — couple-verbatim (CONTENT.md §4); warm surface alt. */
export function StorySection() {
  return (
    <Section id="story" ariaLabel="Our story" tone="warm" title="Our story">
      <p className="mt-4 max-w-[65ch] font-body text-body text-ink">{story}</p>
    </Section>
  );
}
