import type { Metadata, Viewport } from 'next';
import { Great_Vibes, Karla } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-karla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Christian Paul & Christine Jane',
  description: 'We are getting married on Sunday, August 6, 2028. RSVP here.',
};

/**
 * mobile-native baseline (viewport-fit=cover so safe-area env() vars are
 * live; theme-color per scheme matching the ivory chrome; interactive-widget
 * so the Android keyboard shrinks the layout like iOS). Fonts (v1.2.2):
 * Karla = everything (display + body), Great Vibes = script accents only
 * (names, celebration); Cormorant Garamond removed by the couple's call.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F0' },
    { media: '(prefers-color-scheme: dark)', color: '#FAF7F0' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: the pre-paint script below adds `js-reveal` to
  // <html> before hydration, so React must not warn about the extra class
  // (standard pattern for theme/reveal bootstrap scripts).
  return (
    <html lang="en" className={`${greatVibes.variable} ${karla.variable}`} suppressHydrationWarning>
      <body className="min-h-[100dvh]">
        {/* Pre-paint opt-in for scroll reveals: set before sections paint so
            above-the-fold sections animate in without a flash. Skipped for
            reduced-motion users, automated browsers, and ?capture=1. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=new URLSearchParams(location.search);if(!(p.get('reveal')==='off'||p.has('capture'))&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.webdriver){document.documentElement.classList.add('js-reveal')}}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
