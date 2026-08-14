import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// ── Fonts via next/font/google ──────────────────────────────────────────────
// next/font: zero render-blocking, self-hosted by Vercel, font-display:swap.
// ALL original weights preserved to avoid any visual regression.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  preload: true,
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-playfair',
  // Playfair is only used on hero headings/tech detail titles
  preload: false,
});

// ── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'RINK Technology Transfer Portal | Research Innovation Network Kerala',
  description:
    'Connecting Research • Innovation • Commercialization. Discover and license commercializable technologies developed by Kerala research institutions.',
  keywords: 'Kerala startup, research technology, technology transfer, KSUM, RINK, CTCRI, CPCRI, NIIST, commercialization, innovation',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'RINK Technology Transfer Portal',
    description: 'Connecting Research • Innovation • Commercialization — Kerala Startup Mission',
    type: 'website',
  },
};

export const revalidate = 60;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
        {/*
          ── NOTE: No manual image preload here ──────────────────────────────
          The hero uses next/image with priority={true}, which automatically
          injects a <link rel="preload"> for the OPTIMIZED image format
          (AVIF/WebP) at the correct responsive size. A manual PNG preload
          would defeat this by pre-fetching the raw 1.52 MB PNG.
        */}
        {/* DNS prefetch for Google APIs used in the data pipeline */}
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-text-primary relative pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
