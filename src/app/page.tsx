import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import TechTransferPathway from '@/components/ui/TechTransferPathway';
import PartnerInstitutionsSection from '@/components/ui/PartnerInstitutionsSection';
import HeroSearch from '@/components/ui/HeroSearch';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

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
      <section className="relative overflow-hidden bg-[#0A2164]">
        {/* Subtle geometric network motif */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '34px 34px' }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-end">
          <svg viewBox="0 0 600 600" fill="none" stroke="#FFFFFF" strokeWidth="0.6" className="h-full w-auto">
            <circle cx="300" cy="300" r="120" />
            <circle cx="300" cy="300" r="200" strokeDasharray="6 6" />
            <circle cx="300" cy="300" r="280" strokeDasharray="10 10" />
            <line x1="300" y1="20" x2="300" y2="580" />
            <line x1="20" y1="300" x2="580" y2="300" />
            <circle cx="300" cy="100" r="4" fill="#F5B400" stroke="none" />
            <circle cx="480" cy="300" r="4" fill="#F5B400" stroke="none" />
            <circle cx="300" cy="500" r="4" fill="#F5B400" stroke="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white/90 text-[11px] sm:text-xs font-semibold tracking-wide font-sans mb-6 uppercase">
              Research Innovation Network Kerala · Technology Transfer Portal
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.14] tracking-tight mb-5">
              Find the Right Technology
            </h1>

            {/* Subheading */}
            <p className="text-blue-100/85 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans mb-8">
              Browse innovations developed by Kerala&apos;s research institutions and identify
              technologies aligned with your business or startup needs.
            </p>

            {/* Search */}
            <HeroSearch />
          </div>

          {/* Live Metrics Card */}
          <div className="mt-10 max-w-3xl mx-auto bg-white border border-slate-200 rounded-md p-5 sm:p-6">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              {[
                { num: '160+', label: 'Technologies' },
                { num: '10+', label: 'Research Institutions' },
                { num: '11+', label: 'Sectors' },
              ].map((m) => (
                <div key={m.label} className="px-2 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2164] leading-none">
                    {m.num}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-sans mt-1.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-red-dot flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-500 font-sans">
                Prototype stage continuously updated
              </span>
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

      {/* ── 5. ABOUT RINK (minimalist) ───────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-4">About RINK</div>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
            The RINK Technology Transfer Portal, an initiative of Research Innovation Network Kerala (RINK)
            under Kerala Startup Mission (KSUM), showcases commercially viable technologies from Kerala&apos;s
            leading research institutions. As a single platform for technology discovery, technology transfer,
            and startup creation, it enables startups, entrepreneurs, and industry stakeholders to identify and
            adopt research-backed innovations, accelerating technology commercialization and innovation-driven
            entrepreneurship across Kerala.
          </p>
          <a
            href="https://rink.startupmission.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-md bg-[#0A2164] text-white text-sm font-bold font-sans hover:bg-[#081A52] transition-colors"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── 6. CONTACT RINK ──────────────────────────────────── */}
      <section id="contact" className="py-16 bg-[#F4F6F9] border-b border-slate-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">Contact RINK</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Connect With Kerala&apos;s Research Ecosystem
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl font-sans mb-6">
            Research Innovation Network Kerala (RINK) connects startups, industry, investors and innovators
            with Kerala&apos;s leading research and academic institutions.
          </p>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0A2164] mt-0.5 flex-shrink-0" />
            <address className="not-italic text-sm md:text-base text-slate-700 leading-relaxed font-sans">
              Kerala Startup Mission<br />
              G3B, Thejaswini, Technopark Campus<br />
              Kariyavattom, Thiruvananthapuram<br />
              Kerala 695581
            </address>
          </div>
        </div>
      </section>

      {/* ── 7. PARTNER INSTITUTIONS + MAP ────────────────────── */}
      <PartnerInstitutionsSection institutions={institutions} />

    </div>
  );
}
