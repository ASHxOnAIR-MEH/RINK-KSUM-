import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroAISearch from '@/components/ui/HeroAISearch';
import HeroMetrics from '@/components/ui/HeroMetrics';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import ResearchParticles from '@/components/ui/ResearchParticles';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Transfer Portal — Kerala Startup Mission',
  description:
    "Explore commercializable technologies developed by Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

const localFloatingAssets = [
  {
    id: 1, name: 'Patent Document', left: '4%', top: '15%', duration: '29s', delay: '0s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h5" /></svg>)
  },
  {
    id: 2, name: 'Research Paper', left: '88%', top: '12%', duration: '34s', delay: '-5s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 7h10M7 11h10" /></svg>)
  },
  {
    id: 3, name: 'Technology Blueprint', left: '75%', top: '60%', duration: '38s', delay: '-12s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-14 h-14" strokeWidth="0.8"><circle cx="12" cy="12" r="8" strokeDasharray="2 2" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>)
  },
  {
    id: 4, name: 'Innovation Node', left: '12%', top: '65%', duration: '27s', delay: '-8s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><line x1="7.5" y1="7.5" x2="16.5" y2="16.5" /></svg>)
  },
];

export default async function HomePage() {
  const [featuredTechs, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(20),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const topSectors = sectors.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background cover image */}
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          aria-hidden
        />
        {/* Contrast overlay for guaranteed text readability */}
        <div
          className="absolute inset-0 hero-breathe"
          style={{ background: 'linear-gradient(rgba(7,20,40,0.82), rgba(7,20,40,0.72))' }}
          aria-hidden
        />
        {/* Research particle system */}
        <ResearchParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            {/* Premium label badge */}
            <div
              className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-white/10 border border-white/20 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Research Innovation Network Kerala — Technology Transfer Portal
            </div>

            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight"
              style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
            >
              Browse and Adopt Technologies from Kerala&apos;s Leading Research Institutions
            </h1>

            {/* Subtext */}
            <p
              className="font-sans text-lg max-w-2xl mt-6 mb-8 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
            >
              Discover commercially viable technologies from Kerala&apos;s leading research institutions
              and explore opportunities for technology transfer, licensing, startup creation, and commercialization.
            </p>

            {/* AI Assistive Search */}
            <div className="hero-search-breathe">
              <HeroAISearch />
            </div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM METRICS ──────────────────────────────────── */}
      <HeroMetrics />

      {/* ── 2. FEATURED TECHNOLOGIES ─────────────────────────── */}
      <section className="relative py-20 bg-white dark:bg-[#071428] overflow-hidden border-b border-gray-100 dark:border-white/10">
        <style>{`
          @keyframes float-featured-asset {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-15px) translateX(8px) rotate(2deg); }
          }
          .animate-float-featured { animation: float-featured-asset 30s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .animate-float-featured { animation: none !important; } }
        `}</style>

        {/* Ambient assets */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {localFloatingAssets.map((asset) => (
            <div key={asset.id} className="absolute animate-float-featured blur-[1px] text-[#0A2164]"
              style={{ left: asset.left, top: asset.top, opacity: 0.025, animationDuration: asset.duration, animationDelay: asset.delay }}>
              {asset.svg}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Featured Technologies</h2>
          </div>
          <FeaturedCarousel technologies={featuredTechs} />
        </div>
      </section>

      {/* ── 3. BROWSE BY INSTITUTION ─────────────────────────── */}
      <BrowseByInstitution institutions={institutions} />

      {/* ── 4. EXPLORE BY SECTOR ─────────────────────────────── */}
      <section id="sectors" className="relative scroll-mt-20 py-20 bg-[#F8FAFF] dark:bg-[#0A1D37] overflow-hidden border-b border-gray-100 dark:border-white/10">
        {/* Hexagon grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 800 400" className="w-full max-w-4xl h-full text-[#0A2164]" fill="none">
            <polygon points="100,100 150,70 200,100 200,160 150,190 100,160" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="250,200 300,170 350,200 350,260 300,290 250,260" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="400,100 450,70 500,100 500,160 450,190 400,160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
            <polygon points="550,200 600,170 650,200 650,260 600,290 550,260" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#0A2164] dark:text-[#60A5FA] uppercase tracking-widest mb-3">Explore by Sector</div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Browse Technologies by Domain</h2>
            <p className="text-gray-600 dark:text-slate-300 text-base font-sans">Explore opportunities by industry domain and discover technologies ready for commercialization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link href="/sectors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2164] dark:text-[#60A5FA] hover:text-[#081A52] dark:hover:text-[#93C5FD] transition-colors font-sans" id="all-sectors-link">
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
