import type { Metadata, Viewport } from 'next';
import { Fraunces, Karla } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-fraunces',
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
 * mobile-native baseline (skill "Baseline" section): viewport-fit=cover so the
 * safe-area env() variables are live (BackToTop uses them), theme-color per
 * scheme matching the ivory header, and the interactive-widget hint so the
 * Android software keyboard shrinks the layout like iOS does.
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
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="min-h-[100dvh]">{children}</body>
    </html>
  );
}
