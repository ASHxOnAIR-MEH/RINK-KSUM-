import { getFeaturedTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import SearchBar from '@/components/ui/SearchBar';
import StatsSection from '@/components/ui/StatsSection';
import SectorCard from '@/components/ui/SectorCard';
import InstitutionCard from '@/components/ui/InstitutionCard';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Lightbulb, Rocket, Search, Zap } from 'lucide-react';

export default async function HomePage() {
  const [featuredTechs, sectors, institutions] = await Promise.all([
    getFeaturedTechnologies(),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  const startupCategories = [
    { label: 'Food Processing', slug: 'food-processing', icon: '🍽️', examples: ['Cassava Chipping Machine', 'Coconut Chips', 'Functional Noodles', 'Functional Pasta'] },
    { label: 'Agriculture',     slug: 'agriculture',     icon: '🌾', examples: ['Electronic Crop Monitor', 'Coir Root Trainers', 'Super Absorbent Polymer', 'COCONURTURE'] },
    { label: 'Water Technology',slug: 'water-technology',icon: '💧', examples: ['Nitrate Removal Nanocomposite', 'Smart Rainwater Sampler'] },
    { label: 'Renewable Energy',slug: 'renewable-energy',icon: '⚡', examples: ['PEATKOL Bio Briquettes', 'Coconut Biochar'] },
    { label: 'Manufacturing',   slug: 'manufacturing',   icon: '⚙️', examples: ['Essential Oil Extractor', 'Coconut Processing Machinery', 'Dehumidified Dryer'] },
    { label: 'Sustainable Materials', slug: 'sustainable-materials', icon: '♻️', examples: ['Ecoir Bag', 'Wheat Bran Plates', 'Natural Fibre Extraction'] },
  ];

  return (
    <div className="page-enter">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero-section py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full text-xs font-semibold text-[#003F8A] shadow-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Kerala Startup Mission · RINK Technology Explorer
            </span>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#003F8A] leading-tight mb-4">
              Discover Research.{' '}
              <span className="relative">
                <span className="text-[#00875A]">Build Startups.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                  <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#00875A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Explore 150+ commercializable technologies developed by Kerala's top research
              institutions — one platform for startup founders, innovators, and entrepreneurs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar size="lg" />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['Coconut', 'Cassava', 'Biochar', 'Water Filter', 'Essential Oil', 'Biodegradable'].map((tag) => (
              <Link
                key={tag}
                href={`/technologies?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full text-xs font-medium text-[#003F8A] hover:bg-white hover:shadow-sm transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/technologies" className="btn-primary text-base px-8 py-3">
              <Search className="w-4 h-4" />
              Explore All Technologies
            </Link>
            <Link href="/startup-discovery" className="btn-secondary text-base px-8 py-3">
              <Rocket className="w-4 h-4" />
              Startup Discovery
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              How RINK Technology Explorer Works
            </h2>
            <p className="text-gray-500 text-sm">From research discovery to startup launch in 3 steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Search, title: 'Search & Discover', desc: 'Browse 150+ technologies across 10 sectors from 15+ Kerala research institutions.', color: '#003F8A' },
              { step: '02', icon: Lightbulb, title: 'Evaluate Potential', desc: 'Review startup potential, TRL level, patent status, and commercial readiness of each technology.', color: '#00875A' },
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

      {/* ── BROWSE BY SECTOR ─────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Browse by Sector</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">Find technologies matching your startup domain</p>
            </div>
            <Link href="/sectors" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors">
              All Sectors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {sectors.slice(0, 10).map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/sectors" className="btn-secondary text-sm">
              View All Sectors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED TECHNOLOGIES ────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Featured Technologies</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">High-potential technologies ready for commercialization</p>
            </div>
            <Link href="/technologies" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTechs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/technologies" className="btn-primary">
              Explore All 25+ Technologies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STARTUP DISCOVERY ────────────────────────────────── */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {startupCategories.map((cat) => (
              <Link key={cat.slug} href={`/startup-discovery?sector=${cat.slug}`}>
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer">
                  <div className="text-2xl mb-3">{cat.icon}</div>
                  <h3 className="font-heading font-bold text-white text-sm mb-2">{cat.label}</h3>
                  <ul className="space-y-1">
                    {cat.examples.slice(0, 2).map((ex) => (
                      <li key={ex} className="text-xs text-blue-200 flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        {ex}
                      </li>
                    ))}
                    {cat.examples.length > 2 && (
                      <li className="text-xs text-blue-300 opacity-70">
                        +{cat.examples.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/startup-discovery" className="btn-green text-base px-8 py-3">
              <Rocket className="w-4 h-4" />
              Open Startup Discovery
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY INSTITUTION ────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-header">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Browse by Institution</h2>
              </div>
              <p className="text-gray-500 text-sm -mt-4">Technologies from Kerala's leading research institutions</p>
            </div>
            <Link href="/institutions" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003F8A] hover:text-[#002D6B] transition-colors">
              All Institutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {institutions.filter(i => i.tech_count > 0).map((inst) => (
              <InstitutionCard key={inst.id} institution={inst} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
