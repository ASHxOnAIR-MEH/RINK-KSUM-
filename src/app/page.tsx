import { getFeaturedTechnologies, getAllSectors, getAllInstitutions, getRecentTechnologies, getPlatformStats } from '@/lib/db';
import AIDiscoveryBar from '@/components/ui/AIDiscoveryBar';
import StatsSection from '@/components/ui/StatsSection';
import SectorCard from '@/components/ui/SectorCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Lightbulb, Rocket, Sparkles, Zap,
  Clock, TrendingUp, Building2, Shield
} from 'lucide-react';

export const metadata = {
  title: 'RINK Technology Explorer — Kerala Startup Mission',
  description: 'Discover 150+ commercializable technologies from Kerala research institutions. Find your next startup opportunity on the RINK platform by Kerala Startup Mission (KSUM).',
};

export default async function HomePage() {
  const [featuredTechs, recentTechs, sectors, institutions, stats] = await Promise.all([
    getFeaturedTechnologies(6),
    getRecentTechnologies(4),
    getAllSectors(),
    getAllInstitutions(),
    getPlatformStats(),
  ]);

  const topSectors = sectors.slice(0, 10);
  const topInstitutions = institutions.slice(0, 8);

  return (
    <div className="page-enter">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-section py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full text-xs font-semibold text-[#003F8A] shadow-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Kerala Startup Mission · RINK Technology Explorer
            </span>
          </div>

          {/* Logos — mix-blend-mode: multiply makes white bg invisible on light backgrounds */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="relative opacity-100" style={{ width: '140px', height: '56px' }}>
              <Image
                src="/images/ksum-logo.png"
                alt="Kerala Startup Mission"
                fill
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className="w-px h-10 bg-gray-300" />
            <div className="relative opacity-100" style={{ width: '100px', height: '56px' }}>
              <Image
                src="/images/rink-logo.png"
                alt="RINK — Research Innovation Network Kerala"
                fill
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>


          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: 'rgba(0,63,138,0.08)', color: '#003F8A' }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Technology Discovery
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#003F8A] leading-tight mb-4">
              Discover Research.{' '}
              <span className="relative">
                <span className="text-[#00875A]">Build Startups.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                  <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#00875A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Describe your startup idea in plain language — AI will find matching technologies
              from {stats.technology_count}+ records across Kerala&apos;s leading research institutions.
            </p>
          </div>

          {/* AI Discovery Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <AIDiscoveryBar />
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link href="/technologies" className="btn-secondary text-sm px-6 py-2.5" id="hero-explore-btn">
              <ArrowRight className="w-4 h-4" />
              Browse All Technologies
            </Link>
            <Link href="/startup-discovery" className="btn-secondary text-sm px-6 py-2.5" id="hero-discover-btn">
              <Rocket className="w-4 h-4" />
              Startup Discovery
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROTOTYPE BANNER ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="flex-shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase tracking-wider">
            Prototype
          </span>
          <p className="text-sm text-amber-800">
            This platform currently contains{' '}
            <strong>{stats.technology_count} technology records</strong> and is continuously
            expanding through the RINK innovation ecosystem.
          </p>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              From Research to Startup in 3 Steps
            </h2>
            <p className="text-gray-500 text-sm">Designed for Kerala entrepreneurs and founders</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Sparkles, title: 'Describe & Discover', desc: `Tell the AI your startup idea. It searches ${stats.technology_count}+ technologies across ${stats.sector_count} sectors instantly — no browsing needed.`, color: '#003F8A' },
              { step: '02', icon: Lightbulb, title: 'Evaluate Potential', desc: 'Review startup potential, TRL level, patent status, and applications for each technology.', color: '#00875A' },
              { step: '03', icon: Rocket, title: 'Connect & Build', desc: 'Contact the institution directly to discuss technology transfer and licensing for your startup.', color: '#7C3AED' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="absolute -top-3 left-6 text-5xl font-black opacity-5 font-heading select-none">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}15` }}>
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STARTUP DISCOVERY ─────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-br from-[#003F8A] to-[#002D6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-semibold text-blue-200 mb-4">
              <Zap className="w-3.5 h-3.5" />
              Startup Discovery Tool
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-3">
              I Want To Build A Startup In...
            </h2>
            <p className="text-blue-200 text-sm max-w-xl mx-auto">
              Select your domain to instantly discover relevant technologies from Kerala research institutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
            {topSectors.slice(0, 8).map((sector) => (
              <Link key={sector.slug} href={`/startup-discovery?sector=${sector.slug}`} id={`discovery-${sector.slug}`}>
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer text-center">
                  <div className="text-2xl mb-2">{sector.icon}</div>
                  <h3 className="font-heading font-semibold text-white text-sm mb-1">{sector.name}</h3>
                  <span className="text-xs text-blue-300">
                    {sector.tech_count} technologies
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/startup-discovery" className="btn-green text-base px-8 py-3" id="open-discovery-btn">
              <Rocket className="w-4 h-4" />
              Open Full Startup Discovery
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY SECTOR ──────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Browse by Sector</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">Find technologies matching your startup domain</p>
            </div>
            <Link href="/sectors" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors" id="all-sectors-link">
              All Sectors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topSectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/sectors" className="btn-secondary text-sm">
              View All Sectors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED TECHNOLOGIES ─────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Featured Technologies</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">High-potential technologies ready for commercialization</p>
            </div>
            <Link href="/technologies?potential=High" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTechs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/technologies" className="btn-primary" id="explore-all-btn">
              Explore All {stats.technology_count}+ Technologies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECENTLY ADDED ────────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Recently Added</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">Latest technologies added to the RINK platform</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              Auto-updates from Google Sheets
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentTechs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY INSTITUTION ─────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Browse by Institution</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">Technologies from Kerala&apos;s leading research institutions</p>
            </div>
            <Link href="/institutions" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors" id="all-institutions-link">
              All Institutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topInstitutions.map((inst) => (
              <Link key={inst.slug} href={`/institutions/${inst.slug}`} id={`inst-card-${inst.slug}`}>
                <div className="group p-5 rounded-xl border border-gray-100 bg-white hover:border-[#003F8A]/20 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#003F8A]/8 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-[#003F8A]/50" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#003F8A] transition-colors line-clamp-2">
                    {inst.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/institutions" className="btn-secondary text-sm" id="view-all-institutions-btn">
              View All Institutions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-br from-[#003F8A] to-[#002D6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: TrendingUp, title: 'Growing Database', desc: `${stats.technology_count}+ technologies and expanding` },
              { icon: Building2, title: 'Top Institutions', desc: `${stats.institution_count} ICAR, CSIR & state institutes` },
              { icon: Shield, title: 'IP Protected', desc: 'Patented and patent-applied technologies' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-sm">{item.title}</h3>
                  <p className="text-blue-200 text-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
