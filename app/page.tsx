import { Curtain } from '~/components/sections/Curtain';
import { DateRevealSection } from '~/components/sections/DateRevealSection';
import { Hero } from '~/components/sections/Hero';
import { InfoSection } from '~/components/sections/InfoSection';
import { StorySection } from '~/components/sections/StorySection';
import { TimelineSection } from '~/components/sections/TimelineSection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page (v1.1): curtain → slim hero → scratch-the-date → countdown &
 * venues → timeline → dress code → story → RSVP finale → footer.
 *
 * Hero is OUTSIDE main deliberately (one main per page + landmark order);
 * the curtain is a fixed overlay that removes itself from the a11y tree on
 * tap. InfoSection still carries the countdown card until S8 splits venues.
 */
export default function HomePage() {
  return (
    <>
      <Curtain />
      <Hero />
      <main>
        <DateRevealSection />
        <InfoSection />
        <TimelineSection />
        <DressCodeSection />
        <StorySection />
        <RsvpSection />
      </main>
      <Footer />
    </>
  );
}
