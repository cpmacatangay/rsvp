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
  return (
    <html lang="en" className={`${greatVibes.variable} ${karla.variable}`}>
      <body className="min-h-[100dvh]">{children}</body>
    </html>
  );
}
