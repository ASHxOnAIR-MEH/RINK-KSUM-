import { getTechnologyById, getAllTechnologies } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Shield, ChevronRight, ExternalLink,
  Mail, Phone, BookOpen, Lightbulb, Zap,
  Globe, FlaskConical, Layers, FileText, ArrowRight, Atom
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

// ── Animated TRL Meter ────────────────────────────────────────

function TRLMeter({ raw }: { raw: string }) {
  const level = parseTRL(raw);
  if (level === 0) return <InfoMissing />;
  const label = getTRLLabel(level);
  const pct = Math.round((level / 9) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          TRL {level} / 9
        </span>
      </div>

      {/* Track */}
      <div className="h-2.5 bg-card-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-trl-fill"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(to right, #f59e0b, #10b981, #059669)',
          }}
        />
      </div>

      {/* Mini segment markers */}
      <div className="flex gap-0.5 mt-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < level ? '' : 'bg-card-secondary'}`}
            style={
              i < level
                ? {
                    background: i < 3 ? '#fbbf24' : i < 6 ? '#6ee7b7' : '#059669',
                    animation: `slide-fade-in 0.25s ease-out ${i * 0.07}s both`,
                  }
                : {}
            }
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-secondary font-medium">Research</span>
        <span className="text-[10px] text-text-secondary font-medium">Market Ready</span>
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
  const hasApps   = tech.applications.length > 0 && tech.applications[0] !== 'Information being updated';
  const hasDesc   = tech.description && tech.description !== 'Information being updated';

  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* ── MOBILE STICKY BOTTOM CTA ─────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="mobile-request-btn"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm active:scale-95 transition-all"
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

      <div className="pb-36 lg:pb-0">

        {/* ═══════════════════════════════════════════════════════
            ANIMATED TECH HERO HEADER
            Dark gradient background with floating orbs + dot grid
        ═══════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #060e1c 0%, #0c1d3d 45%, #0a1530 75%, #060e1c 100%)' }}
        >
          {/* ── Dot grid overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* ── Floating orb 1 — large indigo ── */}
          <div
            className="absolute animate-float-orb pointer-events-none"
            style={{
              top: '-80px', right: '-60px',
              width: 340, height: 340,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
              filter: 'blur(48px)',
            }}
          />

          {/* ── Floating orb 2 — emerald ── */}
          <div
            className="absolute animate-float-orb-slow pointer-events-none"
            style={{
              bottom: '-60px', left: '8%',
              width: 260, height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* ── Floating orb 3 — blue centre ── */}
          <div
            className="absolute animate-hero-glow pointer-events-none"
            style={{
              top: '20px', left: '38%',
              width: 180, height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)',
              filter: 'blur(32px)',
            }}
          />

          {/* ── Floating orb 4 — tiny amber ── */}
          <div
            className="absolute animate-float-orb-xs pointer-events-none"
            style={{
              top: '30%', right: '18%',
              width: 100, height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* ── Spinning ring decoration ── */}
          <div
            className="absolute animate-spin-slow pointer-events-none opacity-10"
            style={{
              top: '-40px', right: '5%',
              width: 200, height: 200,
              border: '1.5px solid rgba(255,255,255,0.5)',
              borderRadius: '50%',
              borderTopColor: 'transparent',
            }}
          />
          <div
            className="absolute animate-spin-slow pointer-events-none opacity-10"
            style={{
              top: '-20px', right: '7%',
              width: 140, height: 140,
              border: '1px dashed rgba(99,102,241,0.6)',
              borderRadius: '50%',
              animationDirection: 'reverse',
            }}
          />

          {/* ── Full-coverage dark scrim — applied on the entire hero section ── */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(160deg, rgba(4,9,20,0.82) 0%, rgba(6,14,28,0.70) 40%, rgba(8,18,40,0.50) 70%, rgba(4,9,20,0.40) 100%)',
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-14">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/60 flex-wrap mb-8 animate-slide-fade-in">
              <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/30" />
              <Link href="/technologies" className="hover:text-white transition-colors">
                Technologies
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/30" />
              <Link href={`/sectors/${tech.sector_slug}`} className="hover:text-white transition-colors">
                {tech.sector}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/30" />
              <span className="text-white/85 font-semibold truncate max-w-[200px] sm:max-w-sm">
                {tech.name}
              </span>
            </nav>

            {/* Sector + Type chips */}
            <div
              className="flex flex-wrap gap-2 mb-6"
              style={{ animation: 'slide-fade-in 0.5s ease-out 0.1s both' }}
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/50 text-white border border-blue-300/40 backdrop-blur-sm shadow-sm">
                <Layers className="w-3 h-3" /> {tech.sector}
              </span>
              {techTypes.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/35 backdrop-blur-sm shadow-sm"
                >
                  <FlaskConical className="w-3 h-3 text-white/80" /> {t}
                </span>
              ))}
            </div>

            {/* ── Main Title Block — dedicated elevated panel for maximum readability ── */}
            <div
              className="mb-7 rounded-xl p-1"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.2s both' }}
            >
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] font-heading tracking-tight"
                style={{
                  color: '#FFFFFF',
                  /* Multi-layer shadow stack: crisp edge + depth + wide glow */
                  textShadow: [
                    '0 1px 1px rgba(0,0,0,1)',
                    '0 2px 6px rgba(0,0,0,0.95)',
                    '0 4px 16px rgba(0,0,0,0.85)',
                    '0 8px 32px rgba(0,0,0,0.70)',
                  ].join(', '),
                }}
              >
                {tech.name}
              </h1>
            </div>

            {/* Institution strip */}
            <div
              className="flex items-center gap-3 flex-wrap"
              style={{ animation: 'slide-fade-in 0.6s ease-out 0.35s both' }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black/30 border border-white/20 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <Link
                  href={`/institutions/${tech.institution_slug}`}
                  className="text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                >
                  {tech.institution}
                </Link>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-md bg-black/25 border border-white/15">
                <Atom className="w-3 h-3 text-white/55" />
                <span className="text-xs text-white/65 font-mono tracking-wider">{tech.id}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT GRID
        ═══════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

            {/* ── LEFT COLUMN — Narrative ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Problem Solved — Amber Callout */}
              <div
                className="rounded-2xl bg-amber-callout-bg border border-amber-callout-border p-6 animate-slide-fade-in"
                style={{
                  boxShadow: '0 2px 12px rgba(245,158,11,0.06)',
                  animationDelay: '0.1s',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-callout-text/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4.5 h-4.5 text-amber-callout-text" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xs font-bold text-amber-callout-text uppercase tracking-widest mb-2">
                      Problem Being Solved
                    </h2>
                    <p className="text-amber-callout-body leading-relaxed text-[15px]">
                      {tech.problem_solved && tech.problem_solved !== 'Information being updated'
                        ? tech.problem_solved
                        : <InfoMissing />}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technology Description */}
              {hasDesc && (
                <div
                  className="bg-card rounded-2xl border border-border p-6 animate-slide-fade-in"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
                    animationDelay: '0.2s',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-accent-secondary" />
                    </div>
                    <h2 className="font-bold text-heading font-heading">Technology Description</h2>
                  </div>
                  <p className="text-text-primary leading-relaxed text-[15px]">{tech.description}</p>
                </div>
              )}

              {/* Applications & Industry Potential — Bullet list card */}
              {hasApps && (
                <div
                  className="bg-card rounded-2xl border border-border p-6 animate-slide-fade-in"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
                    animationDelay: '0.3s',
                  }}
                >
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-bold text-heading font-heading">Applications &amp; Industry Potential</h2>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Potential application areas for this technology
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {tech.applications.map((app, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5"
                        style={{ animation: `slide-fade-in 0.3s ease-out ${0.3 + i * 0.07}s both` }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-[15px] text-text-primary leading-relaxed">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* ── RIGHT COLUMN — Sticky Glassmorphic Panel ── */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">

                {/* Main Action Card — Dynamic Background */}
                <div
                  className="rounded-2xl bg-card border border-border p-6"
                  style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    animation: 'slide-fade-in 0.7s ease-out 0.2s both',
                  }}
                >

                  {/* TRL Readiness Level */}
                  <div className="mb-5 pb-5 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-accent-secondary/10 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-accent-secondary" />
                      </div>
                      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                        Technology Readiness
                      </span>
                    </div>
                    <TRLMeter raw={tech.trl} />
                  </div>

                  {/* Patent / IP Status */}
                  <div className="mb-5 pb-5 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-accent-secondary/10 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-accent-secondary" />
                      </div>
                      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                        IP Status
                      </span>
                    </div>
                    {tech.patent_status && tech.patent_status !== 'Not Specified' && tech.patent_status !== 'NA' ? (
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
                        <Shield className="w-4 h-4 text-accent-secondary flex-shrink-0" />
                        <span className="text-sm font-semibold text-text-primary">{tech.patent_status}</span>
                      </div>
                    ) : (
                      <InfoMissing />
                    )}
                  </div>

                  {/* Institution */}
                  <div className="mb-5 pb-5 border-b border-border">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-text-secondary font-medium mb-0.5">Institution</div>
                        <Link
                          href={`/institutions/${tech.institution_slug}`}
                          className="text-sm font-semibold text-text-primary hover:text-accent-secondary transition-colors flex items-center gap-1 group"
                        >
                          {tech.institution}
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Desktop CTA Button with glow pulse animation */}
                  <div className="hidden lg:block">
                    <a
                      href={GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="request-technology-btn"
                      className="animate-glow-cta group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-emerald-600 text-white font-bold text-[13px] tracking-wide hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-200"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      Request This Technology
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                    <p className="text-center text-[11px] text-text-secondary mt-3 leading-relaxed px-1">
                      Interested in commercializing this technology? Submit a request through RINK and our team will connect you with the relevant institution.
                    </p>
                  </div>

                </div>

                {/* RINK Contact Card */}
                <div
                  className="rounded-2xl bg-card border border-border p-5"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
                    animation: 'slide-fade-in 0.7s ease-out 0.35s both',
                  }}
                >
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4">
                    RINK Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-text-primary leading-snug">
                      Research Innovation Network Kerala
                    </div>
                    <a href="mailto:rink@startupmission.in" className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-accent-secondary transition-colors">
                      <Mail className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                      rink@startupmission.in
                    </a>
                    <a href="tel:08047180470" className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-accent-secondary transition-colors">
                      <Phone className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                      080 4718 0470
                    </a>
                    <a href="tel:04712700270" className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-accent-secondary transition-colors">
                      <Phone className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                      0471-2700270
                    </a>
                  </div>
                </div>

                {/* Institution Website */}
                {tech.institution_website && tech.institution_website !== 'Not Specified' && (
                  <a
                    href={tech.institution_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-card rounded-xl border border-border hover:border-accent-secondary/20 hover:shadow-sm transition-all group"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-secondary transition-colors">
                        Visit Institution Website
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent-secondary transition-colors" />
                  </a>
                )}

                {/* More from Institution */}
                <Link
                  href={`/institutions/${tech.institution_slug}`}
                  className="flex items-center justify-between w-full p-4 bg-card rounded-xl border border-border hover:border-accent-secondary/20 hover:shadow-sm transition-all group"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-secondary transition-colors">
                      More from {tech.institution.split(' ').slice(0, 3).join(' ')}…
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent-secondary transition-colors" />
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
