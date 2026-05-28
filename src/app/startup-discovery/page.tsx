import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTechnologies } from '@/lib/db';
import StartupDiscoveryClient from './StartupDiscoveryClient';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Startup Discovery | RINK Technology Explorer',
  description: 'Find the right technology to build your startup. Browse Kerala research technologies by startup domain and discover commercialization opportunities.',
};

const CATEGORIES = [
  { label: 'Food Processing',       slug: 'food-processing',      icon: '🍽️', description: 'Value-added food products, processing machinery, functional foods, and food ingredients from Kerala research.' },
  { label: 'Agriculture',           slug: 'agriculture',          icon: '🌾', description: 'Smart farming, soil health, crop management, and agricultural input technologies.' },
  { label: 'Water Technology',      slug: 'water-technology',     icon: '💧', description: 'Water purification, quality monitoring, and rainwater management innovations.' },
  { label: 'Renewable Energy',      slug: 'renewable-energy',     icon: '⚡', description: 'Biomass energy, bio-briquettes, and clean energy technologies from plantation crop by-products.' },
  { label: 'Manufacturing',         slug: 'manufacturing',        icon: '⚙️', description: 'Processing equipment, extraction systems, and industrial technology for entrepreneurs.' },
  { label: 'Sustainable Materials', slug: 'sustainable-materials',icon: '♻️', description: 'Biodegradable packaging, natural fiber composites, and eco-friendly material alternatives.' },
  { label: 'Climate Tech',          slug: 'climate-tech',         icon: '🌍', description: 'Carbon sequestration, biochar, and technologies for climate change adaptation.' },
  { label: 'Smart Systems',         slug: 'smart-systems',        icon: '📡', description: 'IoT sensors, monitoring devices, and smart agriculture technologies.' },
  { label: 'Biotechnology',         slug: 'biotechnology',        icon: '🧬', description: 'Bio-formulations, microbial products, and biotechnology innovations for agriculture.' },
];

interface PageProps {
  searchParams: Promise<{ sector?: string }>;
}

export default async function StartupDiscoveryPage({ searchParams }: PageProps) {
  const { sector: initialSector } = await searchParams;
  const allTechs = await getAllTechnologies();

  // Build a map of category slug → technologies
  const techsByCategory: Record<string, typeof allTechs> = {};
  for (const cat of CATEGORIES) {
    techsByCategory[cat.slug] = allTechs.filter((t) => t.sector_slug === cat.slug);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#003F8A] to-[#002D6B] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center gap-2 text-sm text-blue-300 mb-4 justify-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Startup Discovery</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-semibold text-blue-200 mb-5">
            <Rocket className="w-3.5 h-3.5" />
            Startup Discovery Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
            I Want To Build A Startup In...
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-xl mx-auto">
            Select your domain below to discover relevant technologies from Kerala research institutions
            that you can license and commercialize.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
          <StartupDiscoveryClient
            categories={CATEGORIES}
            techsByCategory={techsByCategory}
            initialSlug={initialSector}
          />
        </Suspense>
      </div>
    </div>
  );
}
