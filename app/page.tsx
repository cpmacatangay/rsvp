import { Curtain } from '~/components/sections/Curtain';
import { Hero } from '~/components/sections/Hero';
import { InfoSection } from '~/components/sections/InfoSection';
import { StorySection } from '~/components/sections/StorySection';
import { TimelineSection } from '~/components/sections/TimelineSection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page (v1.1 in progress):
 *   curtain → hero (slim) → then the existing sections while the remaining
 *   redesign steps land in their own commits (scratch-date, venues, timeline
 *   order, dress code photo, story seat, RSVP finale).
 *
 * Hero is OUTSIDE main deliberately: contentinfo/landmark order keeps one
 * main per page. The curtain is fixed overlay, removed from the flow on tap.
 */
export default function HomePage() {
  return (
    <>
      <Curtain />
      <Hero />
      <main>
        <InfoSection />
        <StorySection />
        <TimelineSection />
        <DressCodeSection />
        <RsvpSection />
      </main>
      <Footer />
    </>
  );
}
