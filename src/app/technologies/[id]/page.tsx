import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Shield, ChevronRight, ExternalLink,
  Mail, Phone, BookOpen, Lightbulb, Zap,
  Globe, FlaskConical, Layers, FileText, ArrowRight
} from 'lucide-react';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJlFIqrK5Dzd5R-Voh19OvhUKxj7OzEqeW8XIdjJMNKxc8Eg/viewform';

// ── Helpers ──────────────────────────────────────────────────

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

function InfoMissing() {
  return <span className="text-sm text-slate-400 italic">Information being updated</span>;
}

// ── TRL Meter ────────────────────────────────────────────────

function TRLMeter({ raw }: { raw: string }) {
  const level = parseTRL(raw);
  if (level === 0) return <InfoMissing />;
  const label = getTRLLabel(level);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          TRL {level}/9
        </span>
      </div>
      {/* Progress segments */}
      <div className="flex gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i < level
                ? i < 3 ? 'bg-amber-400'
                  : i < 6 ? 'bg-emerald-400'
                  : 'bg-emerald-600'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-slate-400 font-medium">Research</span>
        <span className="text-[10px] text-slate-400 font-medium">Market Ready</span>
      </div>
    </div>
  );
}

// ── Meta ─────────────────────────────────────────────────────

export async function generateStaticParams() {
  const techs = await getAllTechnologies();
  return techs.map(t => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) return { title: 'Technology Not Found — RINK' };
  return {
    title: `${tech.name} — RINK Technology Explorer`,
    description: tech.problem_solved?.slice(0, 160),
  };
}

// ── Page ─────────────────────────────────────────────────────

export default async function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tech = await getTechnologyById(id);
  if (!tech) notFound();

  const techTypes = parseTechTypes(tech.technology_type);
  const hasApps = tech.applications.length > 0 && tech.applications[0] !== 'Information being updated';
  const hasDesc = tech.description && tech.description !== 'Information being updated';
  const hasKeywords = tech.keywords.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── MOBILE STICKY BOTTOM CTA ─────────────────────────── */}
      {/* Shown only on mobile (lg:hidden). Desktop CTA is inside the right column panel. */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="mobile-request-btn"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm active:scale-95 transition-all duration-150"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            Request This Technology
            <ExternalLink className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
          </a>
          <p className="text-center text-[11px] text-slate-400 mt-2 leading-snug">
            Submit a request through RINK and our team will connect you with the relevant institution.
          </p>
        </div>
      </div>

      {/* Extra bottom padding on mobile so content isn't hidden by fixed CTA */}
      <div className="pb-36 lg:pb-0">

        {/* ── BREADCRUMB ───────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link href="/startup-discovery" className="hover:text-slate-700 transition-colors">
                Startup Discovery
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link
                href={`/sectors/${tech.sector_slug}`}
                className="hover:text-slate-700 transition-colors"
              >
                {tech.sector}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-slate-600 font-medium truncate max-w-[180px] sm:max-w-xs">
                {tech.name}
              </span>
            </nav>
          </div>
        </div>

        {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

            {/* ═══════════════════════════════════════════════════
                LEFT COLUMN — 70% — Narrative & Value Proposition
            ═══════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-6">

              {/* ── Title Block ── */}
              <div>
                {/* Sector + Technology Type chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    <Layers className="w-3 h-3" /> {tech.sector}
                  </span>
                  {techTypes.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      <FlaskConical className="w-3 h-3" /> {t}
                    </span>
                  ))}
                </div>

                {/* Main title */}
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-5 tracking-tight font-heading">
                  {tech.name}
                </h1>

                {/* Institution strip */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <Link
                      href={`/institutions/${tech.institution_slug}`}
                      className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors"
                    >
                      {tech.institution}
                    </Link>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tracking-wider bg-slate-100 px-2.5 py-1.5 rounded-md">
                    {tech.id}
                  </span>
                </div>
              </div>

              {/* ── Problem Solved — Callout Card (pain point tint) ── */}
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6"
                style={{ boxShadow: '0 2px 12px rgba(245,158,11,0.08)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                      Problem Being Solved
                    </h2>
                    <p className="text-slate-800 leading-relaxed text-[15px]">
                      {tech.problem_solved && tech.problem_solved !== 'Information being updated'
                        ? tech.problem_solved
                        : <InfoMissing />}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Technology Description ── */}
              {hasDesc && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="font-bold text-slate-900 font-heading">Technology Description</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    {tech.description}
                  </p>
                </div>
              )}

              {/* ── Applications — Monetization Pathways ── */}
              {hasApps && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 font-heading">Monetization Pathways</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Market verticals where this technology can be commercialized
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tech.applications.map((app, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-colors cursor-default"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Keywords ── */}
              {hasKeywords && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tech.keywords.map((kw, i) => (
                      <Link
                        key={i}
                        href={`/technologies?q=${encodeURIComponent(kw)}`}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-full hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        {kw}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════
                RIGHT COLUMN — 30% — Sticky Glassmorphic Panel
            ═══════════════════════════════════════════════════ */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">

                {/* ── Floating Glassmorphic Action Card ── */}
                <div
                  className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 p-6"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset',
                  }}
                >

                  {/* TRL Readiness Level */}
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Technology Readiness
                      </span>
                    </div>
                    <TRLMeter raw={tech.trl} />
                  </div>

                  {/* Patent / IP Status */}
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        IP Status
                      </span>
                    </div>
                    {tech.patent_status && tech.patent_status !== 'Not Specified' && tech.patent_status !== 'NA' ? (
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-blue-900">{tech.patent_status}</span>
                      </div>
                    ) : (
                      <InfoMissing />
                    )}
                  </div>

                  {/* Institution */}
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium mb-0.5">Institution</div>
                        <Link
                          href={`/institutions/${tech.institution_slug}`}
                          className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                        >
                          {tech.institution}
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* ── Desktop CTA (hidden on mobile — see fixed bottom bar) ── */}
                  <div className="hidden lg:block">
                    <a
                      href={GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="request-technology-btn"
                      className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-emerald-600 text-white font-bold text-[13px] tracking-wide hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)] active:translate-y-0 transition-all duration-200"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      Request This Technology
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                    <p className="text-center text-[11px] text-slate-400 mt-3 leading-relaxed px-1">
                      Interested in commercializing this technology? Submit a request through RINK and our team will connect you with the relevant institution.
                    </p>
                  </div>
                </div>

                {/* ── RINK Contact Card ── */}
                <div className="rounded-2xl bg-white border border-slate-100 p-5"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    RINK Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-700 leading-snug">
                      Research Innovation Network Kerala
                    </div>
                    <a
                      href="mailto:rink@startupmission.in"
                      className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      rink@startupmission.in
                    </a>
                    <a
                      href="tel:08047180470"
                      className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      080 4718 0470
                    </a>
                    <a
                      href="tel:04712700270"
                      className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      0471-2700270
                    </a>
                  </div>
                </div>

                {/* ── Institution Website ── */}
                {tech.institution_website && tech.institution_website !== 'Not Specified' && (
                  <a
                    href={tech.institution_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors">
                        Visit Institution Website
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-700 transition-colors" />
                  </a>
                )}

                {/* ── More from Institution ── */}
                <Link
                  href={`/institutions/${tech.institution_slug}`}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors">
                      More from {tech.institution.split(' ').slice(0, 3).join(' ')}…
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-700 transition-colors" />
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
