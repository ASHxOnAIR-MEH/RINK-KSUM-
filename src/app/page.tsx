import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import SectorCard from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import InstitutionCard from '@/components/ui/InstitutionCard';
import FloatingParticles from '@/components/ui/FloatingParticles';
import EcosystemNetworkBackground from '@/components/ui/EcosystemNetworkBackground';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Explorer — Kerala Startup Mission',
  description:
    "Explore commercializable technologies developed by Kerala's leading research institutions and discover opportunities for innovation and entrepreneurship.",
};

export default async function HomePage() {
  const [featuredTechs, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(8),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const topSectors      = sectors.slice(0, 8);
  const topInstitutions = institutions.slice(0, 6); // Display top 6 institutions in the grid

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO & SEARCH SECTION ────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-24 border-b border-border animate-slow-mesh" style={{ background: 'var(--bg-hero)', backgroundSize: '200% 200%' }}>
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating particles - restricted to Hero and Institutions */}
        <FloatingParticles count={18} />

        {/* Ambient glow - neon emerald orb */}
        <div
          className="absolute animate-float-orb pointer-events-none"
          style={{
            top: '-80px', left: '10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,250,154,0.08) 0%, transparent 70%)',
            filter: 'blur(95px)',
          }}
        />
        {/* Ambient glow - warm gold orb */}
        <div
          className="absolute animate-float-orb-slow pointer-events-none"
          style={{
            bottom: '-100px', right: '15%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233,196,106,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

            {/* Label pill */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6 animate-fade-in"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Kerala Research Innovation Network
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-tight mb-8 text-heading tracking-tight"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.2s both' }}
            >
              Discover Technologies.<br/>
              <span className="text-accent">Build Startups.</span>
            </h1>

            {/* Search Box Container with Glassmorphism */}
            <div 
              className="w-full max-w-[900px] p-6 md:p-8 glass-search-container animate-slide-up mb-8"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.4s both' }}
            >
              <AIDiscoveryBar />
            </div>

            {/* Subtitle / Description below the Search Box */}
            <p
              className="text-text-primary text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.5s both' }}
            >
              Access market-ready technologies from Kerala's leading academic and research institutions.
              <span className="block mt-2 text-text-secondary text-sm md:text-base font-normal">
                Find the machinery, processes, products, patents, and innovations your startup needs to scale.
              </span>
            </p>

          </div>
        </div>

        {/* Section fade divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* ── FEATURED OPPORTUNITIES ─────────────────────────────── */}
      <section className="relative py-20 bg-background overflow-hidden border-b border-border">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                Featured Innovation
              </div>
              <h2 className="text-3xl font-heading font-bold text-heading">
                Startup Opportunities
              </h2>
            </div>
            <Link
              href="/technologies"
              className="flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-85 transition-opacity"
              id="all-technologies-link"
            >
              Explore Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredTechs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/technologies" className="btn-secondary text-sm" id="explore-all-btn">
              Explore Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section fade divider into card-secondary */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card-secondary to-transparent pointer-events-none z-10" />
      </section>

      {/* ── RESEARCH PARTNERS (INSTITUTIONS) ────────────────────────── */}
      <section className="relative py-20 bg-card-secondary overflow-hidden border-b border-border">
        {/* Innovation Network Graphic Backdrop */}
        <EcosystemNetworkBackground />

        {/* Floating particles - restricted to Hero and Institutions */}
        <FloatingParticles count={15} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                RESEARCH PARTNERS
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-3">
                Research Institutions
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Connecting Kerala's leading research organizations with startup founders and technology commercialization opportunities.
              </p>
            </div>
            <Link
              href="/institutions"
              className="flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-85 transition-opacity flex-shrink-0"
              id="all-institutions-link"
            >
              All Institutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInstitutions.map((inst) => (
              <InstitutionCard key={inst.slug} institution={inst} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/institutions" className="btn-secondary text-sm">
              All Institutions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section fade divider into background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* ── STARTUP DISCOVERY (SECTORS) ────────────────────────────── */}
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
              Startup Discovery
            </div>
            <h2 className="text-3xl font-heading font-bold text-heading mb-3">
              I want to build a startup in...
            </h2>
            <p className="text-text-secondary text-base">
              Explore startup opportunities by industry domain and discover technologies ready for commercialization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link
            href="/sectors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-85 transition-opacity"
            id="all-sectors-link"
          >
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
