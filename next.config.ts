import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
