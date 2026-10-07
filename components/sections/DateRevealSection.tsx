import dynamic from 'next/dynamic';

import { Section } from '~/components/ui/Section';

/**
 * Date section (v1.1): three scratch circles reveal August · 6 · 2028.
 * The scratch interactions are client-only (pointer events + canvas), so the
 * interactive core loads lazily; the section frame stays server-rendered.
 * No-JS guests: the interactive core never loads → the circles stay covered;
 * the plain date remains fully present in the countdown/venue sections, so
 * nothing is lost (both facts also appear server-rendered below).
 */
const ScratchDate = dynamic(
  () => import('~/components/sections/ScratchDate').then((m) => m.ScratchDate),
);

export function DateRevealSection() {
  return (
    <Section id="date" ariaLabel="The date" title="Save the Date">
      <ScratchDate />
    </Section>
  );
}
