import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Construction Estimate Generator | Formwork',
  description: 'Create branded construction estimates, variations, site diaries and snagging lists with your company logo, VAT details and payment terms already built in.',
  keywords: ['construction estimate generator', 'building estimate software', 'contractor quotation tool', 'site diary template', 'variation tracker', 'snagging list']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
