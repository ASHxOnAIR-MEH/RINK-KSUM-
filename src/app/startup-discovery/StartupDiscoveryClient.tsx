'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Technology, Sector } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import { Rocket, ArrowRight, Zap, Search } from 'lucide-react';

interface Props {
  sectors: Sector[];
  initialTechs: Technology[];
  initialSectorSlug: string;
  activeSector: Sector | null;
}

export default function StartupDiscoveryClient({
  sectors, initialTechs, initialSectorSlug, activeSector
}: Props) {
  const router = useRouter();
  const [activeSectorSlug, setActiveSectorSlug] = useState(initialSectorSlug);
  const [displayedTechs, setDisplayedTechs] = useState(initialTechs);
  const [displayedSector, setDisplayedSector] = useState(activeSector);

  function handleSectorClick(sector: Sector) {
    setActiveSectorSlug(sector.slug);
    setDisplayedSector(sector);
    router.push(`/sectors/${sector.slug}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003F8A] to-[#002D6B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-semibold text-blue-200 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Startup Discovery
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
            I Want To Build A Startup In...
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm mb-8">
            Select your domain below to instantly discover commercializable technologies
            from Kerala&apos;s leading research institutions.
          </p>

          {/* Sector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {sectors.map((sector) => (
              <button
                key={sector.slug}
                id={`sector-btn-${sector.slug}`}
                onClick={() => handleSectorClick(sector)}
                className={`group p-4 rounded-xl border transition-all duration-200 text-center ${
                  activeSectorSlug === sector.slug
                    ? 'bg-white border-white shadow-lg scale-105'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-2xl mb-2">{sector.icon}</div>
                <div className={`font-heading font-semibold text-xs leading-snug ${
                  activeSectorSlug === sector.slug ? 'text-[#003F8A]' : 'text-white'
                }`}>
                  {sector.name}
                </div>
                <div className={`text-xs mt-1 ${
                  activeSectorSlug === sector.slug ? 'text-gray-500' : 'text-blue-300'
                }`}>
                  {sector.tech_count} tech{sector.tech_count !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {displayedSector && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${displayedSector.color}15` }}
              >
                {displayedSector.icon}
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900">
                  {displayedSector.name} Technologies
                </h2>
                <p className="text-sm text-gray-500">
                  {displayedTechs.length} technologies available for commercialization
                </p>
              </div>
            </div>
            <Link
              href={`/sectors/${displayedSector.slug}`}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!displayedSector && (
          <div className="mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-1">
              Recommended Technologies
            </h2>
            <p className="text-sm text-gray-500">
              Select a sector above to filter, or explore recommended technologies from the RINK database
            </p>
          </div>
        )}

        {displayedTechs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-gray-900 mb-2">No technologies in this sector yet</h3>
            <p className="text-gray-500 text-sm mb-4">Try another sector or browse all technologies</p>
            <Link href="/technologies" className="btn-primary">
              <Search className="w-4 h-4" />
              Browse All Technologies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTechs.map(tech => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
