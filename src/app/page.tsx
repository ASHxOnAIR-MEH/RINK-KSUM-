import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroSearch from '@/components/ui/HeroSearch';
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

export default async function HomePage() {
  const [featuredTechs, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(20),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const topSectors = sectors.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">

      {/* ══════════════════════════════════════════════════════════
          HERO — Search-first experience
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background cover image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          aria-hidden
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 hero-breathe"
          style={{ background: 'linear-gradient(rgba(7,20,40,0.80), rgba(7,20,40,0.75))' }}
          aria-hidden
        />
        {/* Research particles */}
        <ResearchParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
          {/* Portal identity heading */}
          <div
            className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] mb-8"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            RESEARCH INNOVATION NETWORK KERALA . TECHNOLOGY TRANSFER PORTAL
          </div>

          {/* Heading */}
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight max-w-5xl mb-10"
            style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            Discover Technologies from Kerala&apos;s Leading Research Institutions
          </h1>

          {/* Search — the centerpiece */}
          <div className="w-full hero-search-breathe">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          METRICS
      ══════════════════════════════════════════════════════════ */}
      <HeroMetrics />

      {/* ══════════════════════════════════════════════════════════
          FEATURED TECHNOLOGIES
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-slate-800/60" style={{ minHeight: '580px', background: 'linear-gradient(160deg, #061530 0%, #0a1f4e 35%, #0d2860 60%, #06122a 100%)' }}>

        {/* Subtle radial highlight — top-left */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,96,200,0.12) 0%, transparent 70%)' }}
        />
        {/* Subtle radial highlight — bottom-right */}
        <div
          aria-hidden
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(28,72,160,0.10) 0%, transparent 70%)' }}
        />

        {/* Floating background particles */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[
            { cx: '8%',  cy: '20%', r: 2.5 },
            { cx: '20%', cy: '75%', r: 1.5 },
            { cx: '35%', cy: '15%', r: 2   },
            { cx: '50%', cy: '85%', r: 1.5 },
            { cx: '65%', cy: '10%', r: 2   },
            { cx: '78%', cy: '70%', r: 1.5 },
            { cx: '90%', cy: '30%', r: 2.5 },
            { cx: '15%', cy: '50%', r: 1   },
            { cx: '55%', cy: '55%', r: 1   },
            { cx: '85%', cy: '88%', r: 2   },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: p.cx,
                top: p.cy,
                width: p.r * 2,
                height: p.r * 2,
                background: 'rgba(120,170,255,0.08)',
                animation: `float-particle ${14 + i * 3}s ease-in-out ${i * 1.5}s infinite alternate`,
              }}
            />
          ))}
          <style>{`
            @keyframes float-particle {
              0%   { transform: translate(0, 0) scale(1); opacity: 0.06; }
              50%  { opacity: 0.09; }
              100% { transform: translate(-6px, -8px) scale(1.3); opacity: 0.05; }
            }
          `}</style>
        </div>

        {/* Top curved divider */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-0" style={{ height: 56 }}>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-full" aria-hidden>
            <path d="M0,56 C360,0 1080,0 1440,56 L1440,0 L0,0 Z" fill="#F6F8FC" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-4">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300/80 mb-3">
              Innovation Showcase
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Innovation Opportunities
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto font-sans">
              Handpicked technologies ready for commercialization, licensing, and startup ventures.
            </p>
          </div>

          {/* Carousel */}
          <FeaturedCarousel technologies={featuredTechs} />
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 text-center py-10 px-4">
          <p className="text-sm text-slate-400 mb-4 font-sans">
            Ready to Discover Commercially Viable Technologies?
          </p>
          <Link
            href="/technologies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#0F172A] bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg hover:shadow-amber-400/30 transition-all duration-250 font-sans"
            id="browse-all-featured-cta"
          >
            Browse All Technologies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom curved divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-0" style={{ height: 56 }}>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-full" aria-hidden>
            <path d="M0,0 C360,56 1080,56 1440,0 L1440,56 L0,56 Z" fill="#F6F8FC" />
          </svg>
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
