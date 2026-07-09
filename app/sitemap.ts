import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formwork-peach.vercel.app';
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/estimate-generator`, lastModified: new Date(), priority: 0.95 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/tools/estimate-generator`, lastModified: new Date(), priority: 0.95 },
    { url: `${baseUrl}/tools/variation-tracker`, lastModified: new Date(), priority: 0.85 },
    { url: `${baseUrl}/tools/site-diary`, lastModified: new Date(), priority: 0.85 },
    { url: `${baseUrl}/tools/snagging-list`, lastModified: new Date(), priority: 0.85 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), priority: 0.75 }
  ];
}
