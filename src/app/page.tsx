import { getFeaturedTechnologies, getAllSectors, getAllInstitutions, getPlatformStats } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import StatsSection from '@/components/ui/StatsSection';
import SectorCard from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2 } from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Explorer — Kerala Startup Mission',
  description:
    "Explore commercializable technologies developed by Kerala's leading research institutions and discover opportunities for innovation and entrepreneurship.",
};

export default async function HomePage() {
  const [featuredTechs, sectors, institutions, stats] = await Promise.all([
    getFeaturedTechnologies(6),
    getAllSectors(),
    getAllInstitutions(),
    getPlatformStats(),
  ]);

  const topSectors      = sectors.slice(0, 8);
  const topInstitutions = institutions.slice(0, 8);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero-section py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Logos */}
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="relative opacity-100" style={{ width: 130, height: 52 }}>
              <Image
                src="/images/ksum-logo.png"
                alt="Kerala Startup Mission"
                fill
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="relative" style={{ width: 90, height: 52 }}>
              <Image
                src="/images/rink-logo.png"
                alt="RINK"
                fill
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#003F8A] leading-tight mb-5">
              Discover Research.{' '}
              <span className="relative">
                <span className="text-[#00875A]">Build Startups.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="5" viewBox="0 0 300 5" preserveAspectRatio="none">
                  <path d="M0 2.5 Q75 0 150 2.5 Q225 5 300 2.5" stroke="#00875A" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Explore commercializable technologies developed by Kerala&apos;s leading research
              institutions and discover opportunities for innovation and entrepreneurship.
            </p>
          </div>

          {/* Discovery Bar */}
          <div className="max-w-3xl mx-auto">
            <AIDiscoveryBar />
          </div>
        </div>
      </section>

      {/* ── METRICS ──────────────────────────────────────────── */}
      <StatsSection />

      {/* ── STARTUP DISCOVERY ────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-10">
            <div className="text-xs font-semibold text-[#003F8A] uppercase tracking-widest mb-3">
              Startup Discovery
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
              I want to build a startup in...
            </h2>
            <p className="text-gray-500 text-base">
              Select a sector to explore technologies available for commercialization and startup creation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link
            href="/sectors"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003F8A] hover:underline"
            id="all-sectors-link"
          >
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── FEATURED TECHNOLOGIES ─────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold text-[#003F8A] uppercase tracking-widest mb-3">
                Featured Technologies
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
                Ready for Commercialization
              </h2>
            </div>
            <Link
              href="/technologies"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#003F8A] transition-colors"
              id="all-technologies-link"
            >
              Browse all {stats.technology_count}+ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTechs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/technologies" className="btn-secondary text-sm" id="explore-all-btn">
              Browse All Technologies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONS ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold text-[#003F8A] uppercase tracking-widest mb-3">
                Research Institutions
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
                Explore by Institution
              </h2>
            </div>
            <Link
              href="/institutions"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#003F8A] transition-colors"
              id="all-institutions-link"
            >
              All Institutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topInstitutions.map((inst) => (
              <Link key={inst.slug} href={`/institutions/${inst.slug}`} id={`inst-card-${inst.slug}`}>
                <div className="group p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#003F8A]/15 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5 text-gray-300" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-800 text-sm leading-snug mb-1 group-hover:text-[#003F8A] transition-colors line-clamp-2">
                    {inst.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/institutions" className="btn-secondary text-sm">
              All Institutions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
