'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight, FlaskConical, ShieldCheck } from 'lucide-react';
import { SectorIllustration, SECTOR_ACCENTS } from './SectorCard';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  technology: Technology;
  compact?: boolean;
  featured?: boolean;
}

export default function TechnologyCard({ technology, compact = false, featured = false }: Props) {
  const [imageFailed, setImageFailed]   = useState(false);
  const [imageLoaded, setImageLoaded]   = useState(false);
  const prefersReduced = useReducedMotion();

  // Resolve technology image source
  const displayImage =
    technology.image_embed_url ||
    technology.technology_image_embed_url ||
    technology.image_url ||
    technology.technology_image ||
    null;
  const hasImage = !!displayImage && !imageFailed;

  const sanitize = (val: string | null | undefined): string => {
    if (!val) return '';
    const clean = val.trim();
    const lower = clean.toLowerCase();
    if (
      lower === '' || lower === 'na' || lower === 'n/a' ||
      lower === 'nil' || lower === 'none' ||
      lower.includes('not available') || lower.includes('not specified') ||
      lower.includes('status not available') || lower.includes('trl not available')
    ) return '';
    return clean;
  };

  const trlVal    = sanitize(technology.trl);
  const ipVal     = sanitize(technology.ip_status);
  const trlDisplay = trlVal
    ? (trlVal.toUpperCase().startsWith('TRL') ? trlVal : `TRL ${trlVal}`)
    : '';

  // Short description: prefer problem_solved, fallback to description
  const shortDesc = sanitize(technology.problem_solved) || sanitize(technology.description) || '';

  const cardMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.4, ease: 'easeOut' as const },
      };

  // ── COMPACT variant (used in search results / lists) ──────────────────────
  if (compact) {
    return (
      <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-compact-${technology.id}`}>
        <motion.div
          className="bg-[#FCFDFF] rounded-xl border border-blue-900/10 shadow-sm p-4 hover:shadow-md hover:border-blue-300/30 transition-all duration-300"
          {...cardMotion}
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 relative">
              {hasImage ? (
                <img
                  src={displayImage}
                  alt={technology.name}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full opacity-30">
                  <SectorIllustration slug={technology.sector_slug} accentColor={SECTOR_ACCENTS[technology.sector_slug] || '#0A2164'} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold text-[#1b60bb] uppercase tracking-wider mb-1">
                {technology.sector}
              </span>
              <h4 className="font-heading font-bold text-gray-900 text-[14px] leading-tight line-clamp-2 group-hover:text-[#0A2164] transition-colors">
                {technology.name}
              </h4>
              <div className="flex items-center gap-1 mt-1.5">
                <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-[10px] text-gray-500 line-clamp-1">{technology.institution}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // ── FULL CARD variant ─────────────────────────────────────────────────────
  return (
    <Link
      href={`/technologies/${technology.id}`}
      className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
      id={`tech-card-${technology.id}`}
      aria-label={`View ${technology.name} by ${technology.institution}`}
    >
      <motion.div
        className="h-full flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ease-out"
        style={{
          background: '#FCFDFF',
          borderColor: 'rgba(37,99,235,0.08)',
          boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
          willChange: 'transform, box-shadow',
        }}
        {...cardMotion}
        whileHover={prefersReduced ? {} : {
          y: -8,
          scale: 1.015,
          boxShadow: '0 24px 48px rgba(15,23,42,0.16)',
          borderColor: 'rgba(37,99,235,0.22)',
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
      >

        {/* ── IMAGE AREA (≈45% of card height) ─────────────────── */}
        <div
          className="relative w-full flex-shrink-0 overflow-hidden"
          style={{ height: 188 }}
        >
          {hasImage ? (
            <>
              {/* Skeleton shimmer — visible while image loads */}
              {!imageLoaded && (
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(90deg, #e8edf5 25%, #f0f4fb 50%, #e8edf5 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s ease-in-out infinite',
                  }}
                >
                  <style>{`
                    @keyframes shimmer {
                      0%   { background-position: 200% 0; }
                      100% { background-position: -200% 0; }
                    }
                  `}</style>
                </div>
              )}

              {/* Actual technology image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage!}
                alt={technology.name}
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageFailed(true); setImageLoaded(true); }}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:brightness-[1.03]"
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease-out, transform 0.5s ease-out, filter 0.5s ease-out',
                  willChange: 'transform, opacity',
                }}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </>
          ) : (
            /* Premium sector illustration placeholder */
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${SECTOR_ACCENTS[technology.sector_slug] || '#0A2164'}18 0%, ${SECTOR_ACCENTS[technology.sector_slug] || '#0A2164'}08 100%)` }}
            >
              <div className="w-full h-full opacity-[0.18]">
                <SectorIllustration slug={technology.sector_slug} accentColor={SECTOR_ACCENTS[technology.sector_slug] || '#1b60bb'} />
              </div>
              {/* Subtle label for no-image state */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: SECTOR_ACCENTS[technology.sector_slug] || '#1b60bb', opacity: 0.5 }}
                >
                  {technology.sector}
                </span>
              </div>
            </div>
          )}

          {/* Bottom gradient for text legibility over image */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,10,24,0.55) 0%, rgba(5,10,24,0.1) 50%, transparent 100%)' }}
          />

          {/* ── Sector badge — bottom-left over image ─────────── */}
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.88)',
                color: '#1e293b',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            >
              {technology.sector}
            </span>
          </div>

          {/* ── ★ Featured pill — top-right ───────────────────── */}
          {featured && (
            <div className="absolute top-3 right-3 z-10">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md"
                style={{
                  background: '#F5B301',
                  color: '#422006',
                  boxShadow: '0 2px 8px rgba(245,179,1,0.35)',
                }}
              >
                ★ Featured
              </span>
            </div>
          )}
        </div>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-5 py-4 gap-0">

          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2 min-w-0">
            <Building2 className="w-3 h-3 flex-shrink-0" style={{ color: '#94a3b8' }} />
            <span className="text-[11px] font-medium uppercase tracking-wide truncate" style={{ color: '#64748b' }}>
              {technology.institution}
            </span>
          </div>

          {/* Title — fixed 2 lines */}
          <h3
            className="font-heading font-bold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#1b60bb] mb-2"
            style={{ fontSize: 15, color: '#0f172a', minHeight: '2.5rem' }}
          >
            {technology.name}
          </h3>

          {/* Short description — fixed 2 lines */}
          {shortDesc && (
            <p
              className="line-clamp-2 font-sans leading-relaxed mb-3"
              style={{ fontSize: 12, color: '#64748b', minHeight: '2.25rem' }}
            >
              {shortDesc}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {trlDisplay && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                style={{ fontSize: 10, background: 'rgba(37,99,235,0.07)', color: '#1d4ed8', border: '1px solid rgba(37,99,235,0.12)' }}
              >
                <FlaskConical className="w-2.5 h-2.5" />
                {trlDisplay}
              </span>
            )}
            {ipVal && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                style={{ fontSize: 10, background: 'rgba(16,185,129,0.07)', color: '#047857', border: '1px solid rgba(16,185,129,0.15)' }}
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {ipVal}
              </span>
            )}
            {technology.id && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full font-mono font-semibold"
                style={{ fontSize: 9.5, background: 'rgba(100,116,139,0.07)', color: '#64748b', border: '1px solid rgba(100,116,139,0.12)' }}
              >
                # {technology.id}
              </span>
            )}
          </div>

          {/* CTA Footer */}
          <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
              Technology Transfer
            </span>
            <span
              className="inline-flex items-center gap-1 text-[12px] font-bold transition-all duration-300 group-hover:gap-2"
              style={{ color: '#1b60bb' }}
            >
              Explore Technology
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>

      </motion.div>
    </Link>
  );
}
