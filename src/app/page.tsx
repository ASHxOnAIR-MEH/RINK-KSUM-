import { getFeaturedTechnologies, getRecentTechnologies, getPlatformStats, getAllSectors } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import SectorCard, { SectorIllustration, SECTOR_ACCENTS } from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import FloatingResearchAssets from '@/components/ui/FloatingResearchAssets';
import StatsSection from '@/components/ui/StatsSection';
import EcosystemNetworkBackground from '@/components/ui/EcosystemNetworkBackground';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import TechTransferPathway from '@/components/ui/TechTransferPathway';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  {
    id: 5, name: 'Licensing Document', left: '46%', top: '18%', duration: '31s', delay: '-15s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1"><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M8 12l2.5 2.5 5.5-5.5" /></svg>)
  },
  {
    id: 6, name: 'Research Network Path', left: '50%', top: '72%', duration: '36s', delay: '-3s',
    svg: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1"><path d="M12 2v20M2 12h20" strokeDasharray="3 3" /></svg>)
  }
];

export default async function HomePage() {
  const [featuredTechs, recentTechs, platformStats, sectors] = await Promise.all([
    getFeaturedTechnologies(20),
    getRecentTechnologies(4),
    getPlatformStats(),
    getAllSectors(),
  ]);

  const topSectors = sectors.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. HERO & SEARCH ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-8 sm:py-16 md:py-24 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #F0F6FF 0%, #EEF4FF 40%, #F8FAFF 100%)' }}>
        <EcosystemNetworkBackground />
        <FloatingResearchAssets />

        {/* Blueprint grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] flex items-center justify-center">
          <svg viewBox="0 0 800 800" fill="none" stroke="#2563EB" strokeWidth="0.5" className="w-[120%] h-[120%] object-cover transform -rotate-12">
            <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563EB" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
            <circle cx="400" cy="400" r="200" strokeDasharray="5 5" />
            <circle cx="400" cy="400" r="300" strokeDasharray="10 10" />
            <path d="M0,400 L800,400 M400,0 L400,800" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Ambient orbs */}
        <div className="absolute animate-float-orb pointer-events-none" style={{ top: '-80px', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute animate-float-orb-slow pointer-events-none" style={{ bottom: '-60px', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5, 150, 105, 0.03) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

            {/* Label pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6 animate-fade-in font-sans leading-tight">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
              <span>Research Innovation Network Kerala · Technology Transfer Portal</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black leading-tight mb-4 sm:mb-8 text-gray-900 tracking-tight" style={{ animation: 'slide-fade-in 0.6s ease-out 0.2s both' }}>
              Discover Technologies.<br/>
              <span className="text-[#2563EB]">Build Startups.</span>
            </h1>

            {/* Search Box */}
            <div className="w-full max-w-[900px] p-3 sm:p-5 md:p-7 bg-white rounded-2xl border border-gray-200 shadow-md mb-4" style={{ animation: 'slide-fade-in 0.6s ease-out 0.4s both' }}>
              <AIDiscoveryBar />
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl font-sans" style={{ animation: 'slide-fade-in 0.6s ease-out 0.5s both' }}>
              Access market-ready technologies from Kerala&apos;s leading academic and research institutions.
            </p>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>

      {/* ── 2. LIVE STATISTICS ───────────────────────────────── */}
      <StatsSection
        totalCount={platformStats.technology_count}
        sectorsCount={platformStats.sector_count}
        institutionsCount={platformStats.institution_count}
      />

      {/* ── 3. FEATURED TECHNOLOGIES ─────────────────────────── */}
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
            <div key={asset.id} className="absolute animate-float-featured blur-[1px] text-[#2563EB]"
              style={{ left: asset.left, top: asset.top, opacity: 0.025, animationDuration: asset.duration, animationDelay: asset.delay }}>
              {asset.svg}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">Featured Technologies</div>
              <h2 className="text-3xl font-heading font-bold text-gray-900">Technologies Ready for Commercialization</h2>
            </div>
          </div>
          <FeaturedCarousel technologies={featuredTechs} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>

      {/* ── 4. STARTUP SECTORS ───────────────────────────────── */}
      <section className="relative py-20 bg-[#F8FAFF] overflow-hidden border-b border-gray-100">
        {/* Hexagon grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 800 400" className="w-full max-w-4xl h-full text-[#2563EB]" fill="none">
            <polygon points="100,100 150,70 200,100 200,160 150,190 100,160" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="250,200 300,170 350,200 350,260 300,290 250,260" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="400,100 450,70 500,100 500,160 450,190 400,160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
            <polygon points="550,200 600,170 650,200 650,260 600,290 550,260" stroke="currentColor" strokeWidth="1.2" />
            <line x1="200" y1="130" x2="250" y2="230" stroke="currentColor" strokeWidth="1" />
            <line x1="350" y1="230" x2="400" y2="130" stroke="currentColor" strokeWidth="1" />
            <line x1="500" y1="130" x2="550" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">Explore by Sector</div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">I want to build a startup in...</h2>
            <p className="text-gray-600 text-base font-sans">Explore startup opportunities by industry domain and discover technologies ready for commercialization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>

          <Link href="/sectors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors font-sans" id="all-sectors-link">
            Browse all {sectors.length} sectors <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 5. RECENTLY ADDED TECHNOLOGIES ───────────────────── */}
      <section className="relative py-20 bg-white overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 800 500" className="w-full max-w-4xl h-full text-[#2563EB]" fill="none">
            <line x1="100" y1="250" x2="700" y2="250" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="250" r="5" fill="currentColor" />
            <circle cx="400" cy="250" r="5" fill="currentColor" />
            <circle cx="600" cy="250" r="5" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">Newly Added</div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Recent Technologies</h2>
              <p className="text-sm text-gray-600 max-w-xl font-sans">Latest technologies added to the Kerala Research Innovation Network.</p>
            </div>
            <Link href="/technologies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors" id="all-recent-link">
              All Technologies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentTechs.map((tech) => {
              const displayImage = tech.technology_image_embed_url || tech.technology_image || tech.image_embed_url;
              const hasImage = !!displayImage;
              return (
                <div key={tech.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-250 h-full">
                  <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-gray-50 border-b border-gray-100">
                    {hasImage ? (
                      <>
                        <img src={displayImage} alt={tech.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" referrerPolicy="no-referrer" loading="lazy" />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                      </>
                    ) : (
                      <div className="absolute inset-0 w-full h-full opacity-25">
                        <SectorIllustration slug={tech.sector_slug} accentColor={SECTOR_ACCENTS[tech.sector_slug] || '#2563EB'} />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.40) 0%, transparent 60%)' }} />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-gray-800 border border-gray-200 backdrop-blur-sm uppercase tracking-wider shadow-sm">{tech.sector}</span>
                    </div>
                    {tech.last_updated && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">NEW</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex-shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#2563EB]"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /></svg>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider line-clamp-1 truncate">{tech.institution}</span>
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-[15px] leading-snug mb-2 line-clamp-2 min-h-[40px]">{tech.name}</h3>
                    {tech.last_updated && (
                      <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-4">Added: {tech.last_updated}</div>
                    )}
                    <Link href={`/technologies/${tech.id}`} className="mt-auto w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-bold text-xs transition-all border border-blue-200 hover:border-transparent cursor-pointer font-heading">
                      View Technology
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>

      {/* ── 6. TECHNOLOGY TRANSFER PATHWAY ───────────────────── */}
      <TechTransferPathway compact={true} />

      {/* ── 7. ABOUT RINK PREVIEW ────────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Text */}
            <div className="flex-1">
              <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">About RINK</div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                Kerala&apos;s Research-to-Startup Network
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base font-sans max-w-xl">
                Research Innovation Network Kerala (RINK) connects research institutions, innovators, startups and industry partners to accelerate technology commercialization and innovation-driven entrepreneurship across Kerala.
              </p>
              <Link href="/about" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors font-heading" id="about-rink-learn-more">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats cards */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full md:w-72">
              {[
                { num: '23', label: 'Institutions', sub: 'Partner research institutes' },
                { num: '11+', label: 'Sectors', sub: 'Technology domains' },
                { num: '100%', label: 'Free Access', sub: 'Open to all innovators' },
                { num: '160+', label: 'Technologies', sub: 'Ready for commercialization' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="text-2xl font-black text-[#2563EB] font-heading">{s.num}</div>
                  <div className="text-sm font-bold text-gray-800 font-heading">{s.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 font-sans">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
