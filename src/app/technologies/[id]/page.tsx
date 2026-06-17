import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { fetchAllTechnologies } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowRight, FileText, Microscope } from 'lucide-react';
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
  const hasApps = tech.applications.length > 0 && clean(tech.applications[0]);

  // Related technologies: same sector, different ID, max 4
  const related = allTechs
    .filter(t => t.sector_slug === tech.sector_slug && t.id !== tech.id)
    .slice(0, 4);

  // Opportunity summary (used in hero)
  const opportunitySummary = `Developed by ${tech.institution}, this technology offers commercial potential in the ${tech.sector} sector.`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#071428] text-gray-900 dark:text-white font-sans">

      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white dark:bg-[#0A1D37] border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-md bg-[#0A2164] dark:bg-[#3B82F6] text-white font-semibold text-sm"
          >
            <FileText className="w-4 h-4" />
            Start Transfer Process
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </div>

      <div className="pb-28 md:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#071428]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap mb-8">
              <Link href="/" className="hover:text-[#0A2164] dark:hover:text-[#60A5FA] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <Link href="/technologies" className="hover:text-[#0A2164] dark:hover:text-[#60A5FA] transition-colors">Technologies</Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-[#0A2164] dark:hover:text-[#60A5FA] transition-colors">{tech.sector}</Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-sm">{tech.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">

                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-sm text-xs px-3 py-1 font-sans font-semibold">
                    {tech.sector}
                  </span>
                  {techTypes.map((t, i) => (
                    <span key={i} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-sm text-xs px-3 py-1 font-sans">
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
                  <Link href={`/institutions/${tech.institution_slug}`} className="font-bold text-[#0A2164] dark:text-[#60A5FA] hover:underline">
                    {tech.institution}
                  </Link>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">ID: {tech.id}</span>
                </div>

                {/* Short Summary */}
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-sans">
                  {opportunitySummary}
                </p>
              </div>

              {/* RIGHT COLUMN — Technology Image */}
              <div>
                <div className="rounded-md overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm aspect-[16/9] w-full relative bg-white dark:bg-[#102B52]">
                  <TechImage src={displayImage} alt={tech.name} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — TWO-COLUMN GRID
        ══════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT / MAIN COLUMN */}
              <div className="lg:col-span-2 space-y-8">

                {/* Description */}
                {hasDesc && (
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#0A2164] mb-4">Technology Description</h2>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {tech.description}
                    </p>
                  </div>
                )}

                {/* Applications & Industrial Potential */}
                {hasApps && (
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#0A2164] mb-4">Applications &amp; Industrial Potential</h2>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                      {tech.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-slate-50 dark:bg-[#0A1D37] border border-slate-200 dark:border-white/10 rounded-md p-8 text-center">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">Interested in this Technology?</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto text-sm leading-relaxed font-sans">
                    Submit a request through RINK to initiate technology transfer, licensing discussions,
                    startup creation opportunities, or commercialization pathways related to this technology.
                  </p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-[#0A2164] dark:bg-[#3B82F6] text-white font-semibold text-sm hover:bg-[#081A52] dark:hover:bg-[#2563EB] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Start Technology Transfer Process
                    <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                  </a>
                </div>

              </div>

              {/* RIGHT SIDE-CARD COLUMN */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#0A1D37] border border-slate-200 dark:border-white/10 p-5 rounded-md space-y-6">
                  {/* TRL */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Technology Readiness Level (TRL)
                    </div>
                    {trlLevel > 0 ? (
                      <>
                        <div className="text-lg font-bold text-[#0A2164] dark:text-[#60A5FA]">TRL {trlLevel}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 font-sans">{trlLabel}</div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-600 dark:text-slate-300 font-sans">TRL level will be updated soon</div>
                    )}
                  </div>

                  {/* IP Status */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      IP Status
                    </div>
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                      {clean(tech.patent_status) || 'Not Specified'}
                    </span>
                  </div>

                  {/* Partner Institution */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Partner Institution
                    </div>
                    <Link
                      href={`/institutions/${tech.institution_slug}`}
                      className="text-sm font-semibold text-[#0A2164] dark:text-[#60A5FA] hover:underline font-sans"
                    >
                      {tech.institution}
                    </Link>
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
          <section className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0A1D37] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">More from {tech.sector}</div>
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">Related Technologies</h2>
                </div>
                <Link href={`/sectors/${tech.sector_slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A2164] dark:text-[#60A5FA] hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(rel => {
                  const relImg = rel.image_embed_url || rel.technology_image_embed_url || rel.image_url || rel.technology_image || null;
                  return (
                    <Link key={rel.id} href={`/technologies/${rel.id}`}
                      className="group bg-white dark:bg-[#102B52] rounded-md border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-[#3B82F6]/50 transition-all">
                      <div className="aspect-[16/9] bg-gray-100 dark:bg-[#0A1D37] relative overflow-hidden">
                        {relImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={relImg} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Microscope className="w-8 h-8 text-gray-300 dark:text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">{rel.institution.split(' ').slice(0, 3).join(' ')}</div>
                        <h3 className="font-heading font-bold text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-[#60A5FA] transition-colors">
                          {rel.name}
                        </h3>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#0A2164] dark:text-[#60A5FA] font-semibold">
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
