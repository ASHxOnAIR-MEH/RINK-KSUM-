import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { fetchAllTechnologies } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowRight, FileText, Microscope, Lightbulb, Building2 } from 'lucide-react';
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

  // Related technologies: same sector, different ID, max 4
  const related = allTechs
    .filter(t => t.sector_slug === tech.sector_slug && t.id !== tech.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-md bg-[#0A2164] text-white font-semibold text-sm"
          >
            <FileText className="w-4 h-4" />
            Submit Expression of Interest
          </a>
        </div>
      </div>

      <div className="pb-28 md:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mb-8">
              <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link href="/technologies" className="hover:text-[#0A2164] transition-colors">Technologies</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-[#0A2164] transition-colors">{tech.sector}</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-sm">{tech.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">

                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-50 border border-slate-200 text-slate-700 rounded-sm text-xs px-3 py-1 font-sans font-semibold">
                    {tech.sector}
                  </span>
                  {techTypes.map((t, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-sm text-xs px-3 py-1 font-sans">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2164] leading-tight">
                  {tech.name}
                </h1>

                {/* Institution + ID */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Link href={`/institutions/${tech.institution_slug}`} className="font-bold text-[#0A2164] hover:underline">
                    {tech.institution}
                  </Link>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-slate-500">ID: {tech.id}</span>
                </div>
              </div>

              {/* RIGHT COLUMN — Technology Image */}
              <div>
                <div className="rounded-md overflow-hidden border border-slate-200 shadow-sm aspect-[16/9] w-full relative bg-white">
                  <TechImage src={displayImage} alt={tech.name} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — TWO-COLUMN GRID
        ══════════════════════════════════════════════════════ */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── LEFT / MAIN COLUMN ── */}
              <div className="lg:col-span-2 space-y-8">

                {/* ── 💡 PROBLEM SOLVED CARD ── */}
                {hasProblem && (
                  <div className="relative rounded-xl overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/20 p-px">
                      <div className="h-full w-full rounded-xl bg-[#0A1D37]/5" />
                    </div>
                    {/* Soft glow */}
                    <div className="absolute -inset-1 bg-blue-500/10 blur-2xl rounded-2xl" />
                    {/* Card body */}
                    <div className="relative rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-200/50">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="font-serif text-lg font-bold text-blue-900 tracking-tight">
                          Problem Being Solved
                        </h2>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans text-[15px]">
                        {tech.problem_solved}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── TECHNOLOGY DESCRIPTION ── */}
                {hasDesc && (
                  <div className="space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0A2164]">Technology Description</h2>
                    <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                      {tech.description}
                    </p>
                  </div>
                )}

                {/* ── APPLICATIONS & INDUSTRIAL POTENTIAL ── */}
                {hasApps && (
                  <div className="space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0A2164]">Applications &amp; Industrial Potential</h2>
                    <ul className="space-y-2">
                      {tech.applications.map((app, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 font-sans text-[15px]">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A2164]" />
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* ── RIGHT SIDEBAR ── */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">

                  {/* Sidebar Card */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    {/* TRL */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Technology Readiness Level
                      </div>
                      {trlLevel > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0A2164]/10 flex items-center justify-center">
                            <span className="text-sm font-black text-[#0A2164]">{trlLevel}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">TRL {trlLevel}</div>
                            <div className="text-xs text-slate-500">{trlLabel}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 font-sans italic">Will be updated soon</div>
                      )}
                    </div>

                    {/* IP Status */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        IP / Patent Status
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {clean(tech.patent_status) || 'Not Specified'}
                      </span>
                    </div>

                    {/* Partner Institution */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Partner Institution
                      </div>
                      <Link
                        href={`/institutions/${tech.institution_slug}`}
                        className="group flex items-center gap-2 text-sm font-semibold text-[#0A2164] hover:underline font-sans"
                      >
                        <Building2 className="w-4 h-4 text-slate-400 group-hover:text-[#0A2164] transition-colors flex-shrink-0" />
                        {tech.institution}
                      </Link>
                    </div>

                    {/* ── CTA ── */}
                    <div className="p-5 bg-gradient-to-br from-[#0A2164] to-[#0d3285]">
                      <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#FFFFFF' }}>
                        Interested in this Technology?
                      </h3>
                      <p className="text-xs leading-relaxed font-sans mb-4" style={{ color: 'rgba(191,219,254,0.9)' }}>
                        Submit an Expression of Interest (EOI) through RINK to explore technology transfer, licensing, startup creation, and commercialization opportunities related to this technology.
                      </p>
                      <a
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#F5B400] hover:bg-yellow-400 text-slate-900 font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        Submit Expression of Interest
                      </a>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 9 — RELATED TECHNOLOGIES
        ══════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50/50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">More from {tech.sector}</div>
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">Related Technologies</h2>
                </div>
                <Link href={`/sectors/${tech.sector_slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A2164] hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(rel => {
                  const relImg = rel.image_embed_url || rel.technology_image_embed_url || rel.image_url || rel.technology_image || null;
                  return (
                    <Link key={rel.id} href={`/technologies/${rel.id}`}
                      className="group bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all">
                      <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                        {relImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={relImg} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Microscope className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{rel.institution.split(' ').slice(0, 3).join(' ')}</div>
                        <h3 className="font-heading font-bold text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {rel.name}
                        </h3>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#0A2164] font-semibold">
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
