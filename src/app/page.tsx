import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import TechnologiesHero from '@/components/ui/TechnologiesHero';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Transfer Portal — Kerala Startup Mission',
  description:
    "Explore commercializable technologies developed by Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

export default async function HomePage() {
  const [featuredTechs, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(20),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const topSectors = sectors.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <TechnologiesHero />

      {/* ══════════════════════════════════════════════════════════
          FEATURED TECHNOLOGIES
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-[#0F172A]">Featured Technologies</h2>
          </div>
          <FeaturedCarousel technologies={featuredTechs} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BROWSE BY INSTITUTION
      ══════════════════════════════════════════════════════════ */}
      <BrowseByInstitution institutions={institutions} />

      {/* ══════════════════════════════════════════════════════════
          BROWSE BY SECTOR
      ══════════════════════════════════════════════════════════ */}
      <section id="sectors" className="relative scroll-mt-20 py-20 bg-[#F6F8FC] overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Explore by Sector</div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-3">Browse Technologies by Domain</h2>
            <p className="text-[#475569] text-base font-sans">Explore opportunities by industry domain and discover technologies ready for commercialization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link href="/sectors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4D9B] hover:text-[#153E7C] transition-colors font-sans" id="all-sectors-link">
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
