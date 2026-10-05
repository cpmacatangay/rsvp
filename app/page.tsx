import { Curtain } from '~/components/sections/Curtain';
import { DateRevealSection } from '~/components/sections/DateRevealSection';
import { Hero } from '~/components/sections/Hero';
import { CountdownSection } from '~/components/sections/CountdownSection';
import { VenuesSection } from '~/components/sections/VenuesSection';
import { TimelineSection } from '~/components/sections/TimelineSection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { StorySection } from '~/components/sections/StorySection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page (v1.1): curtain → slim hero → scratch-the-date → countdown →
 * venues (church + reception-to-follow) → timeline → dress code → story →
 * RSVP finale → footer.
 *
 * Hero is OUTSIDE main deliberately (one main per page + landmark order);
 * the curtain is a fixed overlay that removes itself from the a11y tree on
 * tap; the scratch canvases degrade to plain visible text for no-JS.
 */
export default function HomePage() {
  return (
    <>
      <Curtain />
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
    </>
  );
}
