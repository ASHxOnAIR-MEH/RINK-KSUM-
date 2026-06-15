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
  const hasProblem = !!clean(tech.problem_solved);
  const hasApps = tech.applications.length > 0 && clean(tech.applications[0]);

  // Related technologies: same sector, different ID, max 4
  const related = allTechs
    .filter(t => t.sector_slug === tech.sector_slug && t.id !== tech.id)
    .slice(0, 4);

  // Opportunity summary (used in hero)
  const opportunitySummary = hasProblem
    ? tech.problem_solved.slice(0, 150) + (tech.problem_solved.length > 150 ? '…' : '')
    : `Developed by ${tech.institution}, this technology offers commercial potential in the ${tech.sector} sector.`;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded bg-blue-600 text-white font-semibold text-sm"
          >
            <FileText className="w-4 h-4" />
            Request Licensing
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </div>

      <div className="pb-28 md:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-200 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap mb-8">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href="/technologies" className="hover:text-blue-600 transition-colors">Technologies</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-blue-600 transition-colors">{tech.sector}</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-sm">{tech.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-6">
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider">
                    {tech.sector}
                  </span>
                  {techTypes.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded border border-gray-300 text-gray-600 text-xs font-semibold">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight font-heading">
                  {tech.name}
                </h1>

                {/* Institution + ID */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Link href={`/institutions/${tech.institution_slug}`} className="font-bold text-blue-600 hover:underline">
                    {tech.institution}
                  </Link>
                  <span className="text-gray-300">|</span>
                  <span className="font-mono text-gray-500">ID: {tech.id}</span>
                </div>

                {/* Short Summary (Problem Being Solved) */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  {opportunitySummary}
                </p>
              </div>

              {/* RIGHT COLUMN — Technology Image */}
              <div>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-[16/9] w-full relative bg-white">
                  <TechImage src={displayImage} alt={tech.name} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — SINGLE COLUMN PROFILE
        ══════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

            {/* TECHNOLOGY OVERVIEW */}
            <div className="border-b border-gray-200 pb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Technology Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/80 p-8 rounded-xl border border-gray-100">
                <div className="space-y-8">
                  {hasProblem && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Problem Being Solved</h3>
                      <p className="text-gray-800 text-sm leading-relaxed">{tech.problem_solved}</p>
                    </div>
                  )}
                  {hasApps && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Applications</h3>
                      <ul className="list-disc list-inside text-gray-800 text-sm space-y-1.5">
                        {tech.applications.map((app, i) => (
                          <li key={i}>{app}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Institution</h3>
                    <p className="text-gray-800 text-sm font-medium">{tech.institution}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Technology ID</h3>
                    <p className="text-gray-800 text-sm font-mono inline-block bg-white border border-gray-200 px-2 py-1 rounded">{tech.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            {hasDesc && (
              <div className="border-b border-gray-200 pb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Description</h2>
                <div className="prose prose-gray max-w-none prose-p:leading-relaxed prose-p:text-gray-700">
                  <p>{tech.description}</p>
                </div>
              </div>
            )}

            {/* COMMERCIALIZATION STATUS */}
            {(trlLevel > 0 || clean(tech.patent_status) || clean(tech.commercialization_status)) && (
              <div className="border-b border-gray-200 pb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Commercialization Status</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {trlLevel > 0 && (
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">TRL Level</div>
                      <div className="text-xl font-bold text-gray-900">TRL {trlLevel}</div>
                      <div className="text-sm text-gray-600 mt-1">{trlLabel}</div>
                    </div>
                  )}
                  {clean(tech.patent_status) && (
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Patent Status</div>
                      <div className="text-base font-semibold text-gray-900 mt-1 leading-snug">{clean(tech.patent_status)}</div>
                    </div>
                  )}
                  {clean(tech.commercialization_status) && (
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Licensing</div>
                      <div className="text-base font-semibold text-gray-900 mt-1 leading-snug">{clean(tech.commercialization_status)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CALL TO ACTION */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 md:p-12 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">Interested in this technology?</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
                Submit an inquiry through RINK to explore licensing, technology transfer, or commercialization opportunities with <strong>{tech.institution}</strong>.
              </p>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Request Licensing / Transfer
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
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
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(rel => {
                  const relImg = rel.image_embed_url || rel.technology_image_embed_url || rel.image_url || rel.technology_image || null;
                  return (
                    <Link key={rel.id} href={`/technologies/${rel.id}`}
                      className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all">
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
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
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
