import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, FlaskConical, Shield,
  Globe, CheckCircle, Layers, BookOpen, Lightbulb,
  ChevronRight, ExternalLink, Mail, Phone, FileText
} from 'lucide-react';
import TechImage from '@/components/ui/TechImage';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJlFIqrK5Dzd5R-Voh19OvhUKxj7OzEqeW8XIdjJMNKxc8Eg/viewform';

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

function InfoMissing() {
  return <span className="text-sm text-gray-400 italic">Information being updated</span>;
}

// Split a comma-separated Technology Type string into trimmed, non-empty, valid tags
function parseTechTypes(raw: string): string[] {
  if (!raw || raw === 'Not Specified' || raw === 'NA' || raw === 'Information being updated') return [];
  return raw.split(',').map(t => t.trim()).filter(t => t.length > 0 && t !== 'Not Specified' && t !== 'NA');
}

// Render technology type chips inline (for header pills)
function TechTypeChips({ value, size = 'sm' }: { value: string; size?: 'sm' | 'xs' }) {
  const types = parseTechTypes(value);
  if (types.length === 0) return null;
  return (
    <>
      {types.map((t, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-gray-50 text-gray-600 border border-gray-100 ${
            size === 'xs'
              ? 'px-2 py-1 text-[11px]'
              : 'px-3 py-1.5 text-xs'
          }`}
        >
          <FlaskConical className="w-3 h-3" /> {t}
        </span>
      ))}
    </>
  );
}

function DetailRow({ label, value, icon: Icon }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const missing = !value || value === 'Not Specified' || value === 'NA' || value === 'Information being updated';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <Icon className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
        <div className="text-sm text-gray-800 font-medium">
          {missing ? <InfoMissing /> : value}
        </div>
      </div>
    </div>
  );
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) notFound();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href="/technologies" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Technologies
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-600 line-clamp-1 font-medium">{tech.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Image */}
              <div className="relative h-56 md:h-64 bg-gray-100">
                <TechImage
                  src={tech.image_embed_url}
                  alt={tech.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div className="p-7">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Building2 className="w-4 h-4" />
                  <Link
                    href={`/institutions/${tech.institution_slug}`}
                    className="hover:text-[#003F8A] transition-colors font-medium"
                  >
                    {tech.institution}
                  </Link>
                </div>
                <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 leading-tight mb-4">
                  {tech.name}
                </h1>
                {/* Meta pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <Layers className="w-3 h-3" /> {tech.sector}
                  </span>
                  {/* Technology Type — split by comma into chips */}
                  <TechTypeChips value={tech.technology_type} />
                  {tech.patent_status && tech.patent_status !== 'Not Specified' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      <Shield className="w-3 h-3" /> {tech.patent_status}
                    </span>
                  )}
                  {tech.trl && tech.trl !== 'Not Specified' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      TRL {tech.trl}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Problem Solved */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#003F8A]/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-[#003F8A]" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Problem Being Solved</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {tech.problem_solved && tech.problem_solved !== 'Information being updated'
                  ? tech.problem_solved
                  : <InfoMissing />}
              </p>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Applications</h2>
              </div>
              {tech.applications[0] === 'Information being updated' ? (
                <InfoMissing />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tech.applications.map((app, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3.5 bg-gray-50 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{app}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="font-heading font-bold text-gray-900">Technology Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {tech.description && tech.description !== 'Information being updated'
                  ? tech.description
                  : <InfoMissing />}
              </p>
            </div>

            {/* Keywords */}
            {tech.keywords.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {tech.keywords.map((kw, i) => (
                    <Link
                      key={i}
                      href={`/technologies?q=${encodeURIComponent(kw)}`}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs rounded-full hover:border-[#003F8A]/30 hover:text-[#003F8A] transition-colors"
                    >
                      {kw}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">

            {/* ── REQUEST TECHNOLOGY CTA ── */}
            <div className="bg-[#003F8A] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-200" />
                <h2 className="font-heading font-bold text-base">Request This Technology</h2>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">
                For technology transfer and commercialization enquiries, submit a request through RINK.
              </p>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-white text-[#003F8A] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
                id="request-technology-btn"
              >
                Request This Technology
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* ── RINK CONTACT ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-gray-900 text-sm mb-4">RINK Contact</h2>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 leading-snug">
                  Research Innovation Network Kerala
                </div>
                <a
                  href="mailto:rink@startupmission.in"
                  className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#003F8A] transition-colors"
                >
                  <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  rink@startupmission.in
                </a>
                <a
                  href="tel:08047180470"
                  className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#003F8A] transition-colors"
                >
                  <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  080 4718 0470
                </a>
                <a
                  href="tel:04712700270"
                  className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#003F8A] transition-colors"
                >
                  <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  0471-2700270
                </a>
              </div>
            </div>

            {/* ── Technology Details ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Technology Details</h2>
              <DetailRow label="Institution"      value={tech.institution}      icon={Building2} />
              <DetailRow label="Sector"           value={tech.sector}           icon={Layers} />
              {/* Technology Type — comma-split chips in sidebar */}
              <div className="flex items-start gap-3 py-3 border-b border-gray-50">
                <FlaskConical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1.5">Technology Type</div>
                  {parseTechTypes(tech.technology_type).length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {parseTechTypes(tech.technology_type).map((t, i) => (
                        <span key={i} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <InfoMissing />
                  )}
                </div>
              </div>
              <DetailRow label="Patent Status"    value={tech.patent_status}    icon={Shield} />
              <DetailRow label="TRL Level"        value={tech.trl}              icon={ChevronRight} />
            </div>

            {/* ── Institution link ── */}
            {tech.institution_website && tech.institution_website !== 'Not Specified' && (
              <a
                href={tech.institution_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#003F8A]/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#003F8A] transition-colors">
                    Visit Institution Website
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#003F8A] transition-colors" />
              </a>
            )}

            {/* ── More from institution ── */}
            <Link
              href={`/institutions/${tech.institution_slug}`}
              className="flex items-center justify-between w-full p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#003F8A]/20 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#003F8A] transition-colors">
                  More from {tech.institution.split(' ').slice(0, 3).join(' ')}...
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#003F8A] transition-colors" />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
