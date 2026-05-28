import type { Metadata } from 'next';
import Link from 'next/link';
import { Lightbulb, Target, Users, Building2, ArrowRight, CheckCircle, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About RINK Technology Explorer | Kerala Startup Mission',
  description: 'Learn about RINK — Research Innovation Network Kerala — and how this platform helps startup founders discover and commercialize research technologies.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#F0F6FF] via-[#EEF5FF] to-[#F0FAF7] border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 justify-center">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">About</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#003F8A]/10 rounded-full text-xs font-semibold text-[#003F8A] mb-5">
            <Lightbulb className="w-3.5 h-3.5" />
            About RINK Technology Explorer
          </div>
          <h1 className="text-4xl font-heading font-black text-gray-900 mb-4">
            Bridging Research &amp; Entrepreneurship
          </h1>
          <p className="text-gray-600 leading-relaxed text-base max-w-2xl mx-auto">
            RINK Technology Explorer is a sub-portal of the Research Innovation Network Kerala (RINK),
            an initiative by the Kerala Startup Mission (KSUM) to connect research institutions
            with startup founders and entrepreneurs.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-16">

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-7">
            <div className="text-3xl mb-4">🔍</div>
            <h2 className="font-heading font-bold text-gray-900 text-xl mb-3">The Problem</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Kerala's research institutions have developed hundreds of commercializable technologies.
              These remain locked in research papers, PDFs, and institutional documents — invisible
              to the startup ecosystem.
            </p>
            <ul className="space-y-2">
              {[
                'Founders don\'t know what technologies exist',
                'No single discovery platform exists',
                'Institution contacts are hard to find',
                'Startup potential is not communicated',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-7 border-[#003F8A]/20">
            <div className="text-3xl mb-4">💡</div>
            <h2 className="font-heading font-bold text-[#003F8A] text-xl mb-3">Our Solution</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              RINK Technology Explorer is a searchable, categorized platform that presents each
              technology with startup context — problem solved, applications, startup potential,
              and direct institution contact information.
            </p>
            <ul className="space-y-2">
              {[
                'Searchable database of 150+ technologies',
                'Startup potential rated for each technology',
                'Direct institution contact for licensing',
                '100% free, public access',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#00875A] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Who It's For */}
        <div>
          <div className="section-header mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Who Is This For?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Target, label: 'Startup Founders', desc: 'Find technologies ready for commercialization', color: '#003F8A' },
              { icon: Users, label: 'Student Entrepreneurs', desc: 'Identify research-based startup ideas', color: '#00875A' },
              { icon: Building2, label: 'MSMEs & Industries', desc: 'License technologies to improve products', color: '#7C3AED' },
              { icon: Globe, label: 'Incubators & Investors', desc: 'Discover research-backed startups', color: '#EA580C' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="card p-5 text-center">
                <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About KSUM / RINK */}
        <div className="bg-[#F8FAFF] rounded-2xl border border-blue-100 p-8">
          <h2 className="font-heading font-bold text-gray-900 text-2xl mb-4">
            About Kerala Startup Mission &amp; RINK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#003F8A] mb-2 text-sm">Kerala Startup Mission (KSUM)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                KSUM is the nodal agency of the Government of Kerala for entrepreneurship development
                and incubation activities in the state. KSUM provides support to startups through
                funding, mentoring, incubation, and market access programs.
              </p>
              <a
                href="https://startupmission.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#003F8A] font-semibold mt-3 hover:underline"
              >
                startupmission.in <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-[#003F8A] mb-2 text-sm">Research Innovation Network Kerala (RINK)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                RINK is KSUM's initiative to create a strong research-startup linkage ecosystem
                in Kerala. It connects research institutions with startup founders, facilitates
                technology transfer, and promotes commercialization of research innovations.
              </p>
            </div>
          </div>
        </div>

        {/* Institutions */}
        <div>
          <div className="section-header mb-4">
            <h2 className="text-xl font-heading font-bold text-gray-900">Partner Institutions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['CTCRI', 'CPCRI', 'NIIST', 'NCRMI', 'KSCSTE', 'KFRI', 'CWRDM', 'JNTBGRI'].map((inst) => (
              <Link
                key={inst}
                href={`/institutions/${inst.toLowerCase()}`}
                className="px-4 py-2 bg-[#003F8A]/5 border border-[#003F8A]/20 rounded-lg text-sm font-bold text-[#003F8A] hover:bg-[#003F8A]/10 transition-colors"
              >
                {inst}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="font-heading font-bold text-gray-900 text-2xl mb-3">
            Ready to Discover Your Next Startup Idea?
          </h2>
          <p className="text-gray-500 text-sm mb-6">Browse 150+ technologies across 10 sectors from Kerala's top research institutions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/technologies" className="btn-primary">
              Explore Technologies <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/startup-discovery" className="btn-secondary">
              Startup Discovery Tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
