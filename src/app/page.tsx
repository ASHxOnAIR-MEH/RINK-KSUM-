import { getFeaturedTechnologies, getRecentTechnologies, getPlatformStats, getAllSectors, getAllInstitutions } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import SectorCard, { SectorIllustration, SECTOR_ACCENTS } from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import InstitutionCard from '@/components/ui/InstitutionCard';
import FloatingResearchAssets from '@/components/ui/FloatingResearchAssets';
import KeralaInnovationMap from '@/components/ui/KeralaInnovationMap';
import StatsSection from '@/components/ui/StatsSection';
import EcosystemNetworkBackground from '@/components/ui/EcosystemNetworkBackground';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Transfer Portal — Kerala Startup Mission',
  description:
    "Explore commercializable technologies developed by Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

const localFloatingAssets = [
  {
    id: 1,
    name: 'Patent Document',
    left: '4%',
    top: '15%',
    duration: '29s',
    delay: '0s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8M8 10h8M8 14h5" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'Research Paper',
    left: '88%',
    top: '12%',
    duration: '34s',
    delay: '-5s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 7h10M7 11h10" />
      </svg>
    )
  },
  {
    id: 3,
    name: 'Technology Blueprint',
    left: '75%',
    top: '60%',
    duration: '38s',
    delay: '-12s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-14 h-14" strokeWidth="0.8">
        <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    )
  },
  {
    id: 4,
    name: 'Innovation Node',
    left: '12%',
    top: '65%',
    duration: '27s',
    delay: '-8s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" />
      </svg>
    )
  },
  {
    id: 5,
    name: 'Licensing Document',
    left: '46%',
    top: '18%',
    duration: '31s',
    delay: '-15s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1">
        <rect x="4" y="4" width="16" height="16" rx="1.5" />
        <path d="M8 12l2.5 2.5 5.5-5.5" />
      </svg>
    )
  },
  {
    id: 6,
    name: 'Research Network Path',
    left: '50%',
    top: '72%',
    duration: '36s',
    delay: '-3s',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1">
        <path d="M12 2v20M2 12h20" strokeDasharray="3 3" />
      </svg>
    )
  }
];

export default async function HomePage() {
  const [featuredTechs, recentTechs, platformStats, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(20),
    getRecentTechnologies(4),
    getPlatformStats(),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const topSectors      = sectors.slice(0, 8);
  const topInstitutions = institutions.slice(0, 6); // Display top 6 institutions in the grid

  // Map institutions to their logos/images for the Newly Added section
  const institutionLogoMap = new Map<string, string>();
  institutions.forEach((inst) => {
    const logoUrl = inst.institution_image_embed_url || inst.institution_image;
    if (logoUrl) {
      institutionLogoMap.set(inst.slug, logoUrl);
    }
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO & SEARCH SECTION ────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-24 border-b border-border animate-slow-mesh" style={{ background: 'var(--bg-hero)', backgroundSize: '200% 200%' }}>
        
        {/* Innovation Network graph backdrop behind Hero */}
        <EcosystemNetworkBackground />

        {/* Ambient floating research assets icons */}
        <FloatingResearchAssets />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient KSUM Navy Orb */}
        <div
          className="absolute animate-float-orb pointer-events-none"
          style={{
            top: '-80px', left: '10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29, 20, 81, 0.04) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        {/* Ambient Emerald Orb */}
        <div
          className="absolute animate-float-orb-slow pointer-events-none"
          style={{
            bottom: '-60px', left: '30%',
            width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 250, 154, 0.04) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        {/* Ambient Warm Gold Orb */}
        <div
          className="absolute animate-float-orb-slow pointer-events-none"
          style={{
            bottom: '-100px', right: '15%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233, 196, 106, 0.04) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

            {/* Label pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6 animate-fade-in"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-[pulse_3s_infinite]" />
              Research Innovation Network Kerala • Connecting Research • Innovation • Commercialization
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
              className="w-full max-w-[900px] p-6 md:p-8 glass-search-container animate-slide-up mb-4"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.4s both' }}
            >
              <AIDiscoveryBar />
            </div>

            {/* Central CTA button directly under search box with Emerald Gradient & Glow */}
            <div className="mb-8 animate-fade-in font-sans" style={{ animation: 'slide-fade-in 0.6s ease-out 0.5s both' }}>
              <Link 
                href="/technologies" 
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00FA9A] to-[#00C875] text-[#0A0820] font-heading font-extrabold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,250,154,0.45)] active:scale-[0.98]"
              >
                Explore All Technologies →
              </Link>
            </div>

            {/* Subtitle / Description below the Search Box */}
            <p
              className="text-text-primary text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.55s both' }}
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

      {/* ── TRUST & CREDIBILITY STATS STRIP ─────────────────── */}
      <StatsSection 
        totalCount={platformStats.technology_count} 
        sectorsCount={platformStats.sector_count} 
        institutionsCount={platformStats.institution_count} 
      />

      {/* ── FEATURED TECHNOLOGIES ─────────────────────────────── */}
      <section className="relative py-20 bg-background overflow-hidden border-b border-border">
        <style>{`
          @keyframes float-featured-asset {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) translateX(8px) rotate(2deg);
            }
          }
          .animate-float-featured {
            animation: float-featured-asset 30s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-float-featured {
              animation: none !important;
            }
          }
        `}</style>
        
        {/* Subtle innovation-themed ambient background layer (2.5% opacity) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {localFloatingAssets.map((asset) => (
            <div
              key={asset.id}
              className="absolute animate-float-featured blur-[1px] text-accent"
              style={{
                left: asset.left,
                top: asset.top,
                opacity: 0.025, // Strictly 2.5% opacity (range 2% - 4%)
                animationDuration: asset.duration,
                animationDelay: asset.delay,
              }}
              title={asset.name}
            >
              {asset.svg}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                FEATURED TECHNOLOGIES
              </div>
              <h2 className="text-3xl font-heading font-bold text-heading">
                Grab Featured Technologies Easily
              </h2>
            </div>
          </div>

          <FeaturedCarousel technologies={featuredTechs} />

          <div className="mt-12 text-center sm:hidden">
            <Link href="/technologies" className="btn-secondary text-sm" id="explore-all-btn">
              Explore All Technologies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section fade divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* ── RESEARCH PARTNERS (INSTITUTIONS) ────────────────────────── */}
      <section className="relative py-20 bg-background overflow-hidden border-b border-border">
        {/* Kerala outline map backdrop with connected pulsing nodes */}
        <KeralaInnovationMap />

        {/* Ambient floating research assets icons */}
        <FloatingResearchAssets />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                FIND AN INSTITUTION
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-3">
                Research Institutions
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Explore Kerala&apos;s leading research institutions and discover technologies available for transfer, licensing, and commercialization.
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

      {/* ── EXPLORE STARTUP SECTORS ────────────────────────────── */}
      <section className="relative py-20 bg-bg-section-b overflow-hidden border-b border-border">
        {/* Subtle Sectors Illustration background at 2% opacity */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 800 400" className="w-full max-w-4xl h-full text-accent" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
              Explore Startup Sectors
            </div>
            <h2 className="text-3xl font-heading font-bold text-heading mb-3">
              I want to build a startup in...
            </h2>
            <p className="text-text-secondary text-base">
              Explore startup opportunities by industry domain and discover technologies ready for commercialization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
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

      {/* ── NEWLY ADDED TECHNOLOGIES ───────────────────────── */}
      <section className="relative py-20 bg-background overflow-hidden border-b border-border">
        {/* Subtle decorative grid/nodes background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 800 500" className="w-full max-w-4xl h-full text-accent" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="100" y1="100" x2="700" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
            <line x1="100" y1="250" x2="700" y2="250" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="400" x2="700" y2="400" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="200" cy="250" r="5" fill="currentColor" />
            <circle cx="400" cy="250" r="5" fill="currentColor" />
            <circle cx="600" cy="250" r="5" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                NEWLY ADDED TECHNOLOGIES
              </div>
              <h2 className="text-3xl font-heading font-bold text-heading mb-2">
                New Technologies
              </h2>
              <p className="text-sm text-text-secondary max-w-xl">
                Latest technologies recently added to the Kerala Research Innovation Network.
              </p>
            </div>
            <Link
              href="/technologies"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:opacity-85 transition-opacity"
              id="all-recent-link"
            >
              Explore All Technologies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentTechs.map((tech) => {
              const instLogo = institutionLogoMap.get(tech.institution_slug);
              const displayImage = tech.technology_image_embed_url || tech.technology_image || tech.image_embed_url;
              const hasImage = !!displayImage;
              
              return (
                <div key={tech.id} className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Technology Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-[#0A0820] border-b border-border">
                    {hasImage ? (
                      <>
                        <img
                          src={displayImage}
                          alt={tech.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none z-1"
                          style={{
                            background: 'linear-gradient(to top, rgba(11, 8, 32, 0.8) 0%, rgba(11, 8, 32, 0.1) 100%)',
                          }}
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 w-full h-full opacity-45 z-0">
                        <SectorIllustration slug={tech.sector_slug} accentColor={SECTOR_ACCENTS[tech.sector_slug] || '#10B981'} />
                        <div
                          className="absolute inset-0 pointer-events-none z-1"
                          style={{
                            background: 'linear-gradient(to top, rgba(11, 8, 32, 0.9) 0%, rgba(11, 8, 32, 0.3) 100%)',
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Sector badge overlay */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0A0820]/90 text-text-primary border border-border backdrop-blur-sm uppercase tracking-wider">
                        {tech.sector}
                      </span>
                    </div>

                    {/* NEW badge overlay */}
                    {tech.last_updated && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-[#112920] uppercase tracking-wide">
                          NEW
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Institution Row with Logo */}
                    <div className="flex items-center gap-2 mb-2.5 min-w-0">
                      {instLogo ? (
                        <div className="w-7 h-7 rounded-md overflow-hidden bg-white border border-border flex-shrink-0 flex items-center justify-center">
                          <img src={instLogo} alt={tech.institution} className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/20 flex-shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-accent">
                            <rect x="4" y="2" width="16" height="20" rx="2" />
                            <path d="M9 22V12h6v10" />
                          </svg>
                        </div>
                      )}
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider line-clamp-1 truncate">
                        {tech.institution}
                      </span>
                    </div>

                    {/* Tech Title */}
                    <h3 className="font-heading font-bold text-heading text-[15px] leading-snug mb-2 line-clamp-2 min-h-[40px]">
                      {tech.name}
                    </h3>

                    {/* Added Date */}
                    {tech.last_updated && (
                      <div className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider mb-4">
                        Added: {tech.last_updated}
                      </div>
                    )}

                    {/* View Technology CTA Button (min-height 44px) */}
                    <Link
                      href={`/technologies/${tech.id}`}
                      className="mt-auto w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-[#0A0820] font-bold text-xs transition-all border border-accent/20 hover:border-transparent cursor-pointer"
                    >
                      View Technology
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section fade divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* ── TECHNOLOGY TRANSFER PIPELINE (BACKGROUND VISUALIZATION) ────────────────── */}
      <div className="w-full bg-[#0B0820] py-12 relative overflow-hidden flex items-center justify-center">
        {/* Subtle animated pipeline background at 2% opacity */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
          <svg viewBox="0 0 1000 80" className="w-full max-w-5xl h-20 text-[#00FA9A]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 40 L 950 40" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round" />
            <path d="M 50 40 L 950 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="16 24" className="animate-[pipeline-flow_10s_linear_infinite]" />
            
            <circle cx="50" cy="40" r="5.5" fill="currentColor" />
            <text x="50" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">RESEARCH</text>
            
            <circle cx="230" cy="40" r="5.5" fill="currentColor" />
            <text x="230" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">PROTOTYPE</text>
            
            <circle cx="410" cy="40" r="5.5" fill="currentColor" />
            <text x="410" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">PATENT</text>
            
            <circle cx="590" cy="40" r="5.5" fill="currentColor" />
            <text x="590" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">LICENSING</text>
            
            <circle cx="770" cy="40" r="5.5" fill="currentColor" />
            <text x="770" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">STARTUP</text>
            
            <circle cx="950" cy="40" r="5.5" fill="currentColor" />
            <text x="950" y="66" textAnchor="middle" fill="currentColor" fontSize="10.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">COMMERCIALIZATION</text>
          </svg>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4 pointer-events-none">
          <span className="text-[10px] font-black tracking-widest text-[#E9C46A] uppercase">
            KSUM Technology Commercialization Pathway
          </span>
        </div>
      </div>

    </div>
  );
}
