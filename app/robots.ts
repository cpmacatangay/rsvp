import type { MetadataRoute } from 'next';

/** BLOCK crawl of everything private (PRD §6.1). The guest page is not listed on purpose. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/admin', '/api/'],
      },
    ],
  };
}
