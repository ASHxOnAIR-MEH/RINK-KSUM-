import { getFeaturedTechnologies, getAllSectors } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import TechTransferPathway from '@/components/ui/TechTransferPathway';
import HeroSearch from '@/components/ui/HeroSearch';
import Link from 'next/link';
import Image from 'next/image';
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
  const [featuredTechs, sectors] = await Promise.all([
    getFeaturedTechnologies(20),
    getAllSectors(),
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
        {/* Solid dark blue tint overlay */}
        <div className="absolute inset-0 bg-[#0A2164]/75" aria-hidden />
        {/* Progressive scrim fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2164] via-[#0A2164]/90 to-transparent" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-in">
            {/* RINK Logo */}
            <div className="relative h-12 sm:h-14 w-56 sm:w-72 mb-8">
              <Image
                src="/images/rink_logo.png"
                alt="Research Innovation Network Kerala"
                fill
                className="object-contain object-left brightness-0 invert"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-[1.12] tracking-tight">
              Find the Right Technology
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-lg text-slate-300 max-w-2xl mt-5 mb-8 leading-relaxed">
              Browse innovations developed by Kerala&apos;s research institutions and identify
              technologies aligned with your business or startup needs.
            </p>

            {/* Search */}
            <HeroSearch />
          </div>

          {/* Integrated Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 max-w-4xl mt-12 bg-white/5 border border-white/10 backdrop-blur-sm rounded-md divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { num: '160+', label: 'Technologies' },
              { num: '10+', label: 'Research Institutions' },
              { num: '11+', label: 'Sectors' },
            ].map((m) => (
              <div key={m.label} className="p-6 text-center">
                <div className="font-serif text-3xl font-bold text-white leading-none">{m.num}</div>
                <div className="text-sm text-slate-300 font-sans mt-2">{m.label}</div>
              </div>
            ))}
            {/* Live status cell */}
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-red-dot flex-shrink-0" />
                <span className="font-serif text-lg font-bold text-white leading-none">Live</span>
              </div>
              <div className="text-xs text-slate-300 font-sans mt-2 leading-snug">
                Prototype stage<br />continuously updated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED TECHNOLOGIES ─────────────────────────── */}
      <section className="relative py-20 bg-white overflow-hidden border-b border-gray-100">
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">Featured Technologies</div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">Technologies Ready for Commercialization</h2>
            </div>
          </div>
          <FeaturedCarousel technologies={featuredTechs} />
        </div>
      </section>

      {/* ── 3. EXPLORE BY SECTOR ─────────────────────────────── */}
      <section className="relative py-20 bg-[#F8FAFF] overflow-hidden border-b border-gray-100">
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
            <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">Explore by Sector</div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Browse Technologies by Domain</h2>
            <p className="text-gray-600 text-base font-sans">Explore opportunities by industry domain and discover technologies ready for commercialization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link href="/sectors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2164] hover:text-[#081A52] transition-colors font-sans" id="all-sectors-link">
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 4. TECHNOLOGY TRANSFER PATHWAY ───────────────────── */}
      <TechTransferPathway compact={true} />

    </div>
  );
}
