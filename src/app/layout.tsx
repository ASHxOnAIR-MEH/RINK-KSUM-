import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RinkAIAssistant from '@/components/ai/RinkAIAssistant';

export const metadata: Metadata = {
  title: 'RINK Technology Explorer | Discover Research. Build Startups.',
  description:
    'Discover commercializable technologies developed by Kerala research institutions. RINK Technology Explorer helps startup founders identify, evaluate, and access research innovations from CTCRI, CPCRI, NIIST, CWRDM, and more.',
  keywords: 'Kerala startup, research technology, technology transfer, KSUM, RINK, CTCRI, CPCRI, NIIST, commercialization, innovation',
  openGraph: {
    title: 'RINK Technology Explorer',
    description: 'Discover Research. Build Startups. — Kerala Startup Mission',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* AI Discovery Assistant — floating widget on all pages */}
        <RinkAIAssistant />
      </body>
    </html>
  );
}

