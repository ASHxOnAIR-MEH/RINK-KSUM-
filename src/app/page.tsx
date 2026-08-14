import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroSearch from '@/components/ui/HeroSearch';
import HeroMetrics from '@/components/ui/HeroMetrics';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import ResearchParticles from '@/components/ui/ResearchParticles';
import Link from 'next/link';
import Image from 'next/image';
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
      {/* NOTE: overflow-hidden intentionally removed — the search dropdown
           must be able to float beyond this section boundary.            */}
      <section className="relative">
        {/*
          ── Hero Background Image ─────────────────────────────────────────────────
          Using next/image with priority so the browser:
          • Receives an AVIF or WebP version automatically (~80-90% smaller)
          • Gets a responsive srcset (mobile gets a ~640px image, not 1920px)
          • Sees fetchpriority="high" added by Next.js automatically
          • Does NOT block the main thread (no decoding="sync")
          The source file /images/hero-bg.png is unchanged — Next.js converts
          and caches the optimized version on first request.
        */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <Image
            src="/images/hero-bg.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={80}
            sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
            className="object-cover object-center"
          />
        </div>
        {/* Dark overlay */}
        <div
          className="absolute inset-0 hero-breathe"
          style={{ background: 'linear-gradient(rgba(7,20,40,0.80), rgba(7,20,40,0.75))', zIndex: 1 }}
          aria-hidden
        />
        {/* Research particles */}
        <ResearchParticles />


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36 lg:py-44 flex flex-col items-center text-center">
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
          (section background, curves, and CTA live inside FeaturedCarousel)
      ══════════════════════════════════════════════════════════ */}
      <FeaturedCarousel technologies={featuredTechs} />

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

          <Link href="/technologies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4D9B] hover:text-[#153E7C] transition-colors font-sans" id="all-sectors-link">
            Browse all technologies <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
