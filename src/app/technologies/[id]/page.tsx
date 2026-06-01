import { getTechnologyById, getAllTechnologies, getAllSectors } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, FlaskConical, Shield, Phone, Mail,
  Globe, Zap, CheckCircle, Star, Layers, BookOpen, Lightbulb,
  ChevronRight, Users, ExternalLink
} from 'lucide-react';
import TechImage from '@/components/ui/TechImage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const techs = await getAllTechnologies();
  return techs.map(t => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) return { title: 'Technology Not Found — RINK' };
  return {
    title: `${tech.name} — RINK Technology Explorer`,
    description: tech.problem_solved.slice(0, 160),
  };
}

function PotentialBadge({ level }: { level: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    'High':   { cls: 'bg-green-100 text-green-700 border-green-200', label: '⭐ High Startup Potential' },
    'Medium': { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: '★ Medium Startup Potential' },
    'Low':    { cls: 'bg-gray-100 text-gray-600 border-gray-200', label: '○ Low Startup Potential' },
  };
  const c = cfg[level] ?? cfg['Medium'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${c.cls}`}>
      {c.label}
    </span>
  );
}

function InfoMissing() {
  return (
    <span className="text-sm text-gray-400 italic">Information being updated</span>
  );
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) notFound();

  const hasContact = tech.contact_person || tech.phone || tech.email;

  return (
    <div className="min-h-screen bg-[#F8FAFF]">

      {/* ── Back nav ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/technologies" className="flex items-center gap-1.5 text-gray-500 hover:text-[#003F8A] transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            All Technologies
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-400 line-clamp-1">{tech.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MAIN COLUMN ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-56 md:h-72">
                <TechImage
                  src={tech.image_embed_url}
                  alt={tech.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-blue text-xs shadow-sm">{tech.sector}</span>
                    {tech.technology_type && tech.technology_type !== 'Not Specified' && (
                      <span className="badge badge-gray text-xs shadow-sm">{tech.technology_type}</span>
                    )}
                  </div>
                  <span className="text-xs text-white/70 font-mono bg-black/30 px-2 py-1 rounded">
                    {tech.id}
                  </span>
                </div>
              </div>

              {/* Title section */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{tech.institution}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 leading-tight mb-4">
                  {tech.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <PotentialBadge level={tech.startup_potential} />
                  {tech.patent_status && tech.patent_status !== 'Not Specified' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-200 bg-blue-50 text-blue-700">
                      <Shield className="w-3.5 h-3.5" />
                      {tech.patent_status}
                    </span>
                  )}
                  {tech.trl && tech.trl !== 'Not Specified' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-purple-200 bg-purple-50 text-purple-700">
                      TRL: {tech.trl}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── FOUNDER-FIRST SECTION: Problem Solved ──────── */}
            <div className="bg-gradient-to-br from-[#003F8A]/5 to-[#00875A]/5 rounded-2xl border border-[#003F8A]/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#003F8A] flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Problem Being Solved</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {tech.problem_solved !== 'Information being updated' ? tech.problem_solved : <InfoMissing />}
              </p>
            </div>

            {/* ── Applications ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Startup Applications</h2>
              </div>
              {tech.applications[0] === 'Information being updated' ? (
                <InfoMissing />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tech.applications.map((app, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{app}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Description ──────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Technology Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {tech.description !== 'Information being updated' ? tech.description : <InfoMissing />}
              </p>
            </div>

            {/* ── Keywords ─────────────────────────────────── */}
            {tech.keywords.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-heading font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">
                  Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tech.keywords.map((kw, i) => (
                    <Link
                      key={i}
                      href={`/technologies?q=${encodeURIComponent(kw)}`}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-full hover:border-[#003F8A]/30 hover:text-[#003F8A] transition-colors"
                    >
                      {kw}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* ── CONTACT CARD ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#003F8A] flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Contact Institution</h2>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-sm text-blue-800">
                Please contact the institution directly for technology transfer and commercialization discussions.
              </div>

              <div className="space-y-3">
                {tech.contact_person && tech.contact_person !== 'Contact Institution' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Contact Person</div>
                      <div className="text-sm font-semibold text-gray-800">{tech.contact_person}</div>
                    </div>
                  </div>
                )}

                {tech.phone && (
                  <a
                    href={`tel:${tech.phone}`}
                    className="flex items-start gap-3 group hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Phone</div>
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-[#003F8A]">{tech.phone}</div>
                    </div>
                  </a>
                )}

                {tech.email && tech.email !== 'Not Specified' && tech.email !== 'NA' && (
                  <a
                    href={`mailto:${tech.email}`}
                    className="flex items-start gap-3 group hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Email</div>
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-[#003F8A] break-all">{tech.email}</div>
                    </div>
                  </a>
                )}

                {tech.institution_website && tech.institution_website !== 'Not Specified' && (
                  <a
                    href={tech.institution_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Website</div>
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-[#003F8A] flex items-center gap-1">
                        Visit Institution <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {!hasContact && <InfoMissing />}
            </div>

            {/* ── Tech Details ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-500">
                Technology Details
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Institution', value: tech.institution, icon: Building2 },
                  { label: 'Sector', value: tech.sector, icon: Layers },
                  { label: 'Technology Type', value: tech.technology_type, icon: FlaskConical },
                  { label: 'Patent Status', value: tech.patent_status, icon: Shield },
                  { label: 'TRL Level', value: tech.trl, icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">{label}</div>
                      <div className="text-sm text-gray-800 font-medium">
                        {value && value !== 'Not Specified' && value !== 'NA' ? value : <InfoMissing />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Startup Potential Stars ──────────────────── */}
            <div className="bg-gradient-to-br from-[#003F8A] to-[#002D6B] rounded-2xl p-6 text-white">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-blue-200">
                Startup Potential Score
              </h2>
              <div className="flex gap-1.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < tech.startup_potential_score ? 'text-amber-400 fill-amber-400' : 'text-white/20 fill-white/20'}`}
                  />
                ))}
              </div>
              <div className="text-2xl font-heading font-black text-white">
                {tech.startup_potential}
              </div>
              <p className="text-blue-200 text-xs mt-1">Commercialization readiness</p>
              <Link
                href={`/institutions/${tech.institution_slug}`}
                className="mt-4 flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                More from {tech.institution.split(' ').slice(0, 2).join(' ')}...
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
