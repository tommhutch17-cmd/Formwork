import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formwork.app';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/settings', '/projects'] }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
