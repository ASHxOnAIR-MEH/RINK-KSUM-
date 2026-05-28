import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTechnologyById, getRelatedTechnologies } from '@/lib/db';
import TechnologyCard from '@/components/ui/TechnologyCard';
import ContactModal from '@/components/ui/ContactModal';
import ContactButton from './ContactButton';
import {
  Building2, MapPin, FlaskConical, ShieldCheck, Star,
  CheckCircle, Clock, ArrowRight, Download, Tag, Lightbulb,
  BarChart3, Cpu, BookOpen
} from 'lucide-react';
import clsx from 'clsx';
import { technologies } from '@/data/technologies';

// Static params for all technology IDs
export async function generateStaticParams() {
  return technologies.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) return { title: 'Technology Not Found' };
  return {
    title: `${tech.name} | RINK Technology Explorer`,
    description: tech.problem_solved,
  };
}

const statusConfig: Record<string, { label: string; className: string }> = {
  'Commercial Ready':              { label: 'Commercial Ready',       className: 'badge-green' },
  'Technology Transfer Available': { label: 'Transfer Available',     className: 'badge-blue' },
  'Pilot Stage':                   { label: 'Pilot Stage',            className: 'badge-gold' },
  'Lab Stage':                     { label: 'Lab Stage',              className: 'badge-gray' },
};

const patentConfig: Record<string, string> = {
  'Patented':       'badge-green',
  'Patent Applied': 'badge-blue',
  'Trade Secret':   'badge-gold',
  'Not Patented':   'badge-gray',
  'Open Source':    'badge-purple',
  'Copyright':      'badge-gray',
};

export default async function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tech, related] = await Promise.all([
    getTechnologyById(id),
    getTechnologyById(id).then(t => t ? getRelatedTechnologies(t) : []),
  ]);

  if (!tech) notFound();

  const status = statusConfig[tech.commercialization_status] ?? statusConfig['Lab Stage'];
  const trlHigh = tech.technology_readiness >= 7;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#F8FAFF] border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <Link href="/technologies" className="hover:text-[#003F8A]">Technologies</Link>
            <span>/</span>
            <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-[#003F8A]">{tech.sector}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{tech.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MAIN CONTENT ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero image + title */}
            <div className="card overflow-hidden">
              <div className="relative h-64 md:h-80">
                <Image
                  src={tech.image_url}
                  alt={tech.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={clsx('badge text-xs', status.className)}>{status.label}</span>
                    <span className="badge badge-blue text-xs">{tech.sector}</span>
                    <span className={clsx('badge text-xs', patentConfig[tech.patent_status] ?? 'badge-gray')}>
                      <ShieldCheck className="w-3 h-3" />
                      {tech.patent_status}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-heading font-black text-white leading-tight">
                    {tech.name}
                  </h1>
                </div>
              </div>

              <div className="p-6">
                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-[#003F8A]" />
                    <span className="font-semibold text-[#003F8A]">{tech.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lightbulb className="w-4 h-4 text-gray-400" />
                    <span>{tech.inventor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    <span>{tech.technology_type}</span>
                  </div>
                </div>

                {/* Description */}
                <h2 className="font-heading font-bold text-gray-900 text-lg mb-3">About This Technology</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{tech.description}</p>
              </div>
            </div>

            {/* Problem Solved */}
            <div className="card p-6">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <span className="text-sm">🎯</span>
                </div>
                Problem Solved
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm bg-red-50/50 rounded-xl p-4 border border-red-100">
                {tech.problem_solved}
              </p>
            </div>

            {/* Applications */}
            <div className="card p-6">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <span className="text-sm">🚀</span>
                </div>
                Startup Applications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tech.applications.map((app, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-[#F8FAFF] rounded-xl border border-blue-50">
                    <CheckCircle className="w-4 h-4 text-[#00875A] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TRL + Startup Potential */}
            <div className="card p-6">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#003F8A]" />
                Readiness & Potential
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* TRL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Technology Readiness (TRL)</span>
                    <span className={clsx('text-sm font-bold', trlHigh ? 'text-[#00875A]' : 'text-[#003F8A]')}>
                      TRL {tech.technology_readiness}/9
                    </span>
                  </div>
                  <div className="trl-bar mb-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          'trl-segment',
                          i < tech.technology_readiness ? (trlHigh ? 'high' : 'active') : ''
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {tech.technology_readiness >= 8 ? 'Production ready' :
                     tech.technology_readiness >= 6 ? 'Demonstration phase' :
                     tech.technology_readiness >= 4 ? 'Laboratory validated' : 'Research phase'}
                  </p>
                </div>
                {/* Startup Potential */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Startup Potential</span>
                    <span className="text-sm font-bold text-amber-500">{tech.startup_potential}/5</span>
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={clsx('w-5 h-5', i < tech.startup_potential ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {tech.startup_potential >= 5 ? 'Exceptional startup opportunity' :
                     tech.startup_potential >= 4 ? 'Strong commercial potential' :
                     tech.startup_potential >= 3 ? 'Good commercialization prospects' : 'Niche application potential'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="card p-6">
              <h2 className="font-heading font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#003F8A]" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tech.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/technologies?q=${encodeURIComponent(tag)}`}
                    className="badge badge-gray text-xs hover:badge-blue transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Contact / Request */}
            <div className="card p-6 border-2 border-[#003F8A]/20">
              <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#003F8A]" />
                Institution Contact
              </h3>
              <div className="space-y-2 mb-5">
                <div className="text-xs text-gray-500">Institution</div>
                <div className="font-semibold text-gray-900 text-sm">{tech.contact.institution}</div>
                <div className="text-xs text-gray-500 mt-2">Contact Person</div>
                <div className="text-sm text-gray-700">{tech.contact.name}</div>
                <div className="text-xs text-gray-400">{tech.contact.designation}</div>
              </div>
              <ContactButton contact={tech.contact} technologyName={tech.name} />
            </div>

            {/* Quick Info */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-gray-900 mb-4 text-sm">Technology Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Institution', value: tech.institution },
                  { label: 'Technology Type', value: tech.technology_type },
                  { label: 'Sector', value: tech.sector },
                  { label: 'Patent Status', value: tech.patent_status },
                  { label: 'TRL Level', value: `TRL ${tech.technology_readiness}/9` },
                  { label: 'Status', value: tech.commercialization_status },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
                    <span className="text-xs font-medium text-gray-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloads */}
            {tech.downloads.length > 0 && (
              <div className="card p-6">
                <h3 className="font-heading font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#003F8A]" />
                  Downloads
                </h3>
                <div className="space-y-2">
                  {tech.downloads.map((dl, i) => (
                    <a
                      key={i}
                      href={dl.url}
                      className="flex items-center gap-2 text-sm text-[#003F8A] hover:text-[#002D6B] hover:underline p-2 rounded-lg hover:bg-blue-50 transition-all"
                    >
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      {dl.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Institution quick link */}
            <Link href={`/institutions/${tech.institution_slug}`} className="block card p-4 hover:border-[#003F8A]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">View all from</div>
                  <div className="font-heading font-bold text-[#003F8A] text-sm">{tech.institution}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#003F8A]" />
              </div>
            </Link>
          </div>
        </div>

        {/* Related Technologies */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="section-header mb-6">
              <h2 className="text-xl font-heading font-bold text-gray-900">Related Technologies</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((t) => (
                <TechnologyCard key={t.id} technology={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
