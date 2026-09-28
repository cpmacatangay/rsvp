import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // couple's hero photo ships AVIF-first per DESIGN.md hero rules
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
