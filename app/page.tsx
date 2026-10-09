import { Curtain } from '~/components/sections/Curtain';
import { DateRevealSection } from '~/components/sections/DateRevealSection';
import { Hero } from '~/components/sections/Hero';
import { CountdownSection } from '~/components/sections/CountdownSection';
import { VenuesSection } from '~/components/sections/VenuesSection';
import { TimelineSection } from '~/components/sections/TimelineSection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { StorySection } from '~/components/sections/StorySection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { RsvpStickyCta } from '~/components/sections/RsvpStickyCta';
import { ScrollReveal } from '~/components/motion/ScrollReveal';
import { Drapes } from '~/components/sections/Drapes';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page (v1.3.3): curtain → slim hero → scratch-the-date → countdown →
 * venues → timeline → dress code → story → RSVP → footer.
 *
 * #page-content wraps everything the curtain covers: while the curtain is up
 * it is `inert` (focus and AT stay inside the cover). Hero sits outside
 * <main> deliberately (one main per page + landmark order).
 */
export default function HomePage() {
  return (
    <>
      <Curtain />
      <div id="page-content">
        <Hero />
        <main>
          <DateRevealSection />
          <CountdownSection />
          <VenuesSection />
          <TimelineSection />
          <DressCodeSection />
          <StorySection />
          <RsvpSection />
        </main>
        <Footer />
      </div>
      <RsvpStickyCta />
      <ScrollReveal />
      <Drapes />
    </>
  );
}
