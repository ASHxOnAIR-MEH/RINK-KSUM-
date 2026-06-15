import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { fetchAllTechnologies } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ExternalLink, Mail, Phone, Globe,
  FlaskConical, Layers, ArrowRight, Building2,
  Lightbulb, Zap, Shield, BarChart3, CheckCircle2,
  Tag, Microscope, FileText, MapPin, Factory, TrendingUp,
} from 'lucide-react';
import TechImage from '@/components/ui/TechImage';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJlFIqrK5Dzd5R-Voh19OvhUKxj7OzEqeW8XIdjJMNKxc8Eg/viewform';

// ── Helpers ───────────────────────────────────────────────────

function parseTechTypes(raw: string): string[] {
  if (!raw || raw === 'Not Specified' || raw === 'NA') return [];
  return raw.split(',').map(t => t.trim()).filter(t => t.length > 0 && t !== 'Not Specified');
}

function parseTRL(raw: string): number {
  if (!raw || raw === 'Not Specified' || raw === 'NA') return 0;
  const match = raw.match(/\d+/);
  return match ? Math.min(Math.max(parseInt(match[0]), 0), 9) : 0;
}

function getTRLLabel(level: number): string {
  if (level <= 0) return 'Not Specified';
  if (level <= 2) return 'Basic Research';
  if (level === 3) return 'Proof of Concept';
  if (level <= 5) return 'Lab Validated';
  if (level === 6) return 'Prototype Validated';
  if (level === 7) return 'Demonstration Ready';
  if (level === 8) return 'System Complete';
  return 'Production Ready';
}

function clean(val: string | undefined | null): string {
  if (!val) return '';
  const v = val.trim();
  if (['na', 'n/a', 'nil', 'none', 'not specified', 'not available', 'information being updated']
    .includes(v.toLowerCase())) return '';
  return v;
}

// ── Meta ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const techs = await getAllTechnologies();
  return techs.map(t => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) return { title: 'Technology Not Found — RINK' };
  return {
    title: `${tech.name} — RINK Technology Transfer Portal`,
    description: tech.problem_solved?.slice(0, 160),
    openGraph: {
      title: tech.name,
      description: tech.problem_solved?.slice(0, 160),
    },
  };
}

// ── TRL Bar ───────────────────────────────────────────────────

function TRLBar({ raw }: { raw: string }) {
  const level = parseTRL(raw);
  if (level === 0) return <span className="text-gray-400 text-sm italic">TRL Not Specified</span>;
  const label = getTRLLabel(level);
  const pct = Math.round((level / 9) * 100);
  const color = level <= 3 ? '#f59e0b' : level <= 6 ? '#3b82f6' : '#10b981';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
          TRL {level}/9
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">Basic Research</span>
        <span className="text-[10px] text-gray-400">Production Ready</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default async function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tech, allTechs] = await Promise.all([
    getTechnologyById(id),
    fetchAllTechnologies(),
  ]);
  if (!tech) notFound();

  const techTypes = parseTechTypes(tech.technology_type);

  const displayImage =
    tech.image_embed_url ||
    tech.technology_image_embed_url ||
    tech.image_url ||
    tech.technology_image ||
    null;

  const trlLevel = parseTRL(tech.trl);
  const trlLabel = getTRLLabel(trlLevel);

  const hasDesc = !!clean(tech.description);
  const hasProblem = !!clean(tech.problem_solved);
  const hasApps = tech.applications.length > 0 && clean(tech.applications[0]);
  const hasKeywords = tech.keywords.length > 0;

  // Related technologies: same sector, different ID, max 4
  const related = allTechs
    .filter(t => t.sector_slug === tech.sector_slug && t.id !== tech.id)
    .slice(0, 4);

  // Opportunity summary
  const opportunitySummary = hasProblem
    ? tech.problem_solved.slice(0, 150) + (tech.problem_solved.length > 150 ? '…' : '')
    : `Developed by ${tech.institution}, this technology offers commercial potential in the ${tech.sector} sector.`;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm"
          >
            <FileText className="w-4 h-4" />
            Request Licensing / Transfer
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </div>

      <div className="pb-28 lg:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO  (two-column clean layout)
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#F0F6FF 0%,#EEF4FF 50%,#F8FAFF 100%)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap mb-7 font-sans">
              <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href="/technologies" className="hover:text-[#2563EB] transition-colors">Technologies</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-[#2563EB] transition-colors">{tech.sector}</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-700 font-medium truncate max-w-[180px] sm:max-w-xs">{tech.name}</span>
            </nav>

            {/* Two-column hero */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

              {/* LEFT — 60% */}
              <div className="lg:col-span-3 flex flex-col gap-5">

                {/* Sector + Type badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2563EB] text-white">
                    <Layers className="w-3 h-3" /> {tech.sector}
                  </span>
                  {techTypes.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700">
                      <FlaskConical className="w-3 h-3 text-[#2563EB]" /> {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 leading-tight">
                  {tech.name}
                </h1>

                {/* Institution + ID */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/institutions/${tech.institution_slug}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    {tech.institution}
                  </Link>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500">
                    ID: {tech.id}
                  </span>
                </div>

                {/* Opportunity summary */}
                <p className="text-gray-600 text-base leading-relaxed font-sans max-w-xl">
                  {opportunitySummary}
                </p>

                {/* Startup potential badge */}
                {tech.startup_potential && clean(tech.startup_potential) && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold w-fit">
                    <TrendingUp className="w-4 h-4" />
                    Startup Potential: {tech.startup_potential}
                  </div>
                )}
              </div>

              {/* RIGHT — Technology Image (40%) */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 aspect-[16/9] w-full relative">
                  <TechImage src={displayImage} alt={tech.name} />
                </div>
                {/* Institution logo area below image */}
                <div className="mt-3 flex items-center gap-2 px-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-sans leading-tight">{tech.institution}</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — OPPORTUNITY SNAPSHOT (5 cards)
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-100 bg-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  icon: <Factory className="w-5 h-5 text-[#2563EB]" />,
                  label: 'Sector',
                  value: tech.sector,
                  bg: 'bg-blue-50 border-blue-100',
                },
                {
                  icon: <Tag className="w-5 h-5 text-purple-600" />,
                  label: 'Applications',
                  value: hasApps ? tech.applications.slice(0, 2).join(', ') : 'See details below',
                  bg: 'bg-purple-50 border-purple-100',
                },
                {
                  icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
                  label: 'Startup Potential',
                  value: clean(tech.startup_potential) || 'Evaluating',
                  bg: 'bg-amber-50 border-amber-100',
                },
                {
                  icon: <Zap className="w-5 h-5 text-emerald-600" />,
                  label: 'TRL Level',
                  value: trlLevel > 0 ? `TRL ${trlLevel} — ${trlLabel}` : 'Not Specified',
                  bg: 'bg-emerald-50 border-emerald-100',
                },
                {
                  icon: <Shield className="w-5 h-5 text-rose-600" />,
                  label: 'Patent Status',
                  value: clean(tech.patent_status) || 'Contact Institution',
                  bg: 'bg-rose-50 border-rose-100',
                },
              ].map(({ icon, label, value, bg }) => (
                <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                  <div className="mb-2">{icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-bold text-gray-800 leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — TWO COLUMN
        ══════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT (2/3) — Sections 3–6 ─────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* SECTION 3 — Problem & Description */}
              {hasProblem && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="font-heading font-bold text-gray-900">Problem Being Solved</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[15px] font-sans">{tech.problem_solved}</p>
                </div>
              )}

              {hasDesc && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Microscope className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <h2 className="font-heading font-bold text-gray-900">Technology Description</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[15px] font-sans">{tech.description}</p>
                </div>
              )}

              {/* SECTION 4 — Applications as tags */}
              {hasApps && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="font-heading font-bold text-gray-900">Applications & Use Cases</h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {tech.applications.map((app, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-sm font-semibold text-purple-800 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5 — Benefits */}
              {hasApps && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="font-heading font-bold text-gray-900">Key Benefits</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: '🏭', label: 'Commercial Scale Production', show: true },
                      { icon: '💰', label: 'High Value Addition', show: true },
                      { icon: '🌱', label: 'Sustainable Technology', show: true },
                      { icon: '🚀', label: 'Startup Friendly', show: ['high', 'featured', 'very high'].includes(tech.startup_potential?.toLowerCase() || '') },
                      { icon: '📈', label: 'Market Ready', show: trlLevel >= 6 },
                      { icon: '🔬', label: 'Research Backed', show: true },
                    ].filter(b => b.show).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="text-xl">{benefit.icon}</span>
                        <span className="text-sm font-semibold text-emerald-800">{benefit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6 — Market Opportunity */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h2 className="font-heading font-bold text-gray-900">Market Opportunity</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Target Sector', value: tech.sector },
                    { label: 'Technology Type', value: clean(tech.technology_type) || 'Innovative Technology' },
                    { label: 'Startup Potential', value: clean(tech.startup_potential) || 'High Potential' },
                    { label: 'Institution', value: tech.institution },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-[#F8FAFF] border border-gray-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
                      <div className="text-sm font-semibold text-gray-800 leading-snug">{value}</div>
                    </div>
                  ))}
                </div>
                {hasKeywords && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {tech.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600 font-medium">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 7 — Licensing & Commercialization */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-rose-600" />
                  </div>
                  <h2 className="font-heading font-bold text-gray-900">Technology Transfer & Licensing</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-2xl font-black text-[#2563EB] font-heading mb-1">
                      {trlLevel > 0 ? `TRL ${trlLevel}` : 'N/A'}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Readiness Level</div>
                    <div className="text-xs text-blue-600 mt-1 font-semibold">{trlLabel}</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Patent Status</div>
                    <div className="text-sm font-bold text-amber-800">
                      {clean(tech.patent_status) || 'Contact Institution'}
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Licensing</div>
                    <div className="text-sm font-bold text-emerald-800">
                      {clean(tech.commercialization_status) || 'Available via RINK'}
                    </div>
                  </div>
                </div>

                <TRLBar raw={tech.trl} />

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 font-sans leading-relaxed mb-4">
                    Interested in licensing or commercializing this technology? Submit an inquiry through RINK and
                    our team will connect you with <strong>{tech.institution}</strong>.
                  </p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="request-technology-btn"
                    className="hidden lg:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Request Licensing / Transfer
                    <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                  </a>
                </div>
              </div>

            </div>

            {/* ── RIGHT (1/3) — Sticky sidebar ──────────────── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">

                {/* SECTION 8 — Institution Card */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Partner Institution</div>

                  {/* Institution Logo */}
                  <div className="w-full h-20 rounded-xl bg-[#F8FAFF] border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                    {tech.institution_image_embed_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tech.institution_image_embed_url}
                        alt={tech.institution}
                        className="w-full h-full object-contain p-3"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-300" />
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1">
                    {tech.institution}
                  </h3>

                  {tech.institution_website && clean(tech.institution_website) && (
                    <a href={tech.institution_website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline mb-4 font-sans">
                      <Globe className="w-3 h-3" />
                      Visit Website
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  {(clean(tech.email) || clean(tech.phone)) && (
                    <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Contact</div>
                      {clean(tech.phone) && (
                        <a href={`tel:${tech.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#2563EB] transition-colors">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {tech.phone}
                        </a>
                      )}
                      {clean(tech.email) && (
                        <a href={`mailto:${tech.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#2563EB] transition-colors">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {tech.email}
                        </a>
                      )}
                    </div>
                  )}

                  <Link href={`/institutions/${tech.institution_slug}`}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] text-xs font-bold hover:bg-blue-50 transition-colors">
                    View Institution
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Quick Facts */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Facts</div>
                  <dl className="space-y-3">
                    {[
                      { label: 'Technology ID', value: tech.id },
                      { label: 'Sector', value: tech.sector },
                      { label: 'Type', value: clean(tech.technology_type) || '—' },
                      { label: 'TRL', value: trlLevel > 0 ? `TRL ${trlLevel}/9` : '—' },
                      { label: 'Patent', value: clean(tech.patent_status) || '—' },
                      { label: 'Licensing', value: clean(tech.commercialization_status) || 'Available via RINK' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2 text-xs">
                        <dt className="text-gray-400 font-medium flex-shrink-0">{label}</dt>
                        <dd className="text-gray-800 font-semibold text-right leading-snug">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* RINK Contact */}
                <div className="rounded-2xl border border-gray-100 bg-[#F8FAFF] p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">RINK Contact</div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">Research Innovation Network Kerala</div>
                  <div className="space-y-2">
                    <a href="mailto:rink@startupmission.in" className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#2563EB] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> rink@startupmission.in
                    </a>
                    <a href="tel:04712700270" className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#2563EB] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> 0471-2700270
                    </a>
                    <a href="https://startupmission.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#2563EB] hover:underline">
                      <Globe className="w-3.5 h-3.5" /> startupmission.in
                    </a>
                  </div>
                </div>

                {/* Desktop CTA */}
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" id="cta-sidebar-btn"
                  className="hidden lg:flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-colors">
                  <FileText className="w-4 h-4" />
                  Request Licensing / Transfer
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 9 — RELATED TECHNOLOGIES
        ══════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="border-t border-gray-100 bg-[#F8FAFF] py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-2">More from {tech.sector}</div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Related Technologies</h2>
                </div>
                <Link href={`/sectors/${tech.sector_slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map(rel => {
                  const relImg = rel.image_embed_url || rel.technology_image_embed_url || rel.image_url || rel.technology_image || null;
                  return (
                    <Link key={rel.id} href={`/technologies/${rel.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all">
                      <div className="aspect-[16/9] bg-gray-50 relative overflow-hidden">
                        {relImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={relImg} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Microscope className="w-8 h-8 text-gray-200" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{rel.institution.split(' ').slice(0, 3).join(' ')}</div>
                        <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                          {rel.name}
                        </h3>
                        <div className="mt-3 flex items-center gap-1 text-xs text-[#2563EB] font-semibold">
                          Explore <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
