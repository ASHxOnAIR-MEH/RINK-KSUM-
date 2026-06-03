import { getFeaturedTechnologies, getAllSectors, getAllInstitutions, getPlatformStats } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import StatsSection from '@/components/ui/StatsSection';
import SectorCard from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, Sparkles, FlaskConical, Leaf } from 'lucide-react';

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
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071018 0%, #0a1628 45%, #0d2040 80%, #071018 100%)' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating orb — indigo top-left */}
        <div
          className="absolute animate-float-orb pointer-events-none"
          style={{
            top: '-100px', left: '-80px',
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Floating orb — emerald bottom-center */}
        <div
          className="absolute animate-float-orb-slow pointer-events-none"
          style={{
            bottom: '-80px', left: '25%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px] items-center">

            {/* ── LEFT: Text + Search ── */}
            <div className="py-16 md:py-20 lg:py-24 pr-0 lg:pr-10">

              {/* Logos */}
              <div className="flex items-center gap-4 mb-10">
                <div className="relative" style={{ width: 110, height: 44 }}>
                  <Image
                    src="/images/ksum-logo.png"
                    alt="Kerala Startup Mission"
                    fill
                    className="object-contain brightness-0 invert opacity-90"
                    priority
                  />
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="relative" style={{ width: 76, height: 44 }}>
                  <Image
                    src="/images/rink-logo.png"
                    alt="RINK"
                    fill
                    className="object-contain brightness-0 invert opacity-90"
                    priority
                  />
                </div>
              </div>

              {/* Label pill */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold mb-6"
                style={{ animation: 'slide-fade-in 0.5s ease-out 0.1s both' }}
              >
                <Sparkles className="w-3 h-3" />
                Kerala Research Innovation Network
              </div>

              {/* Headline */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight mb-5"
                style={{
                  animation: 'slide-fade-in 0.6s ease-out 0.2s both',
                  textShadow: '0 0 60px rgba(79,70,229,0.3), 0 2px 24px rgba(0,0,0,0.5)',
                }}
              >
                Discover Research.{' '}
                <span className="relative">
                  <span style={{ color: '#34d399' }}>Build Startups.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="5" viewBox="0 0 300 5" preserveAspectRatio="none">
                    <path d="M0 2.5 Q75 0 150 2.5 Q225 5 300 2.5" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/60 text-lg leading-relaxed max-w-xl mb-8"
                style={{ animation: 'slide-fade-in 0.6s ease-out 0.3s both' }}
              >
                Explore commercializable technologies from Kerala&apos;s leading research
                institutions and turn deep-tech patents into startups.
              </p>

              {/* Quick stats pills */}
              <div
                className="flex flex-wrap gap-3 mb-8"
                style={{ animation: 'slide-fade-in 0.5s ease-out 0.4s both' }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-sm">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-white">{stats.technology_count}+</span>&nbsp;Technologies
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-sm">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">{stats.sector_count}</span>&nbsp;Sectors
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-sm">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-white">{stats.institution_count}</span>&nbsp;Institutions
                </div>
              </div>

              {/* Discovery Bar */}
              <div style={{ animation: 'slide-fade-in 0.6s ease-out 0.45s both' }}>
                <AIDiscoveryBar />
              </div>
            </div>

            {/* ── RIGHT: Hero Image ── */}
            <div className="hidden lg:flex items-center justify-end relative h-full py-10">
              <div className="relative w-full max-w-lg">
                {/* Ambient glow behind image */}
                <div
                  className="absolute inset-0 animate-hero-glow pointer-events-none"
                  style={{
                    borderRadius: '24px',
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.3) 0%, rgba(5,150,105,0.15) 50%, transparent 75%)',
                    filter: 'blur(32px)',
                    transform: 'scale(1.15)',
                  }}
                />
                {/* Image frame */}
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.6)',
                  }}
                >
                  <Image
                    src="/images/hero-innovation-v2.png"
                    alt="Kerala Technology Innovation — Research meets Startups"
                    width={560}
                    height={420}
                    className="w-full h-auto object-cover"
                    priority
                    style={{ display: 'block' }}
                  />
                  {/* Gradient fade at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(7,16,24,0.85) 0%, transparent 100%)' }}
                  />
                  {/* Caption bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs text-white/55 font-medium">
                      Research → Innovation → Startup
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Database
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
