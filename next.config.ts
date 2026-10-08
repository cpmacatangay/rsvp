import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev-server cross-origin (Next 16 requirement). Defining this switches the
  // dev server from "warn" to "block", so allow the whole private LAN range
  // (not one brittle DHCP IP) plus mDNS hostnames — the couple tests on phones
  // over the LAN. Dev-only; ignored in production.
  allowedDevOrigins: ['192.168.1.*', '192.168.*.*', '10.*.*.*', '*.local'],
  images: {
    // AVIF-first; qualities must be declared explicitly from Next.js 16.
    // 80 = dress-code sample photo; 75 = Next's default for any future image.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
