import { Section } from '~/components/ui/Section';
import { story } from '~/lib/config';

/** Our story (#story) — couple-verbatim (CONTENT.md §4); warm surface alt. */
export function StorySection() {
  return (
    <Section id="story" ariaLabel="Our story" tone="warm">
      <h2 className="font-display text-h1 text-ink">Our story</h2>
      <p className="max-w-[65ch] font-body text-body text-ink">{story}</p>
    </Section>
  );
}
