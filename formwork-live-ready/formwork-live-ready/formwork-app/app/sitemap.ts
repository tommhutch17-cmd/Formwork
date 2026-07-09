import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formwork.app';
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/estimate-generator`, lastModified: new Date(), priority: 0.95 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), priority: 0.8 }
  ];
}
