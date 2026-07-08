'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import { SectorIllustration, SECTOR_ACCENTS } from './SectorCard';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  technology: Technology;
  compact?: boolean;
  featured?: boolean;   // shows the ★ Featured gold badge when true
}

export default function TechnologyCard({ technology, compact = false, featured = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const prefersReduced = useReducedMotion();

  // Resolve technology image source.
  // Priority: 1) Image URL column (image_embed_url) from sheet
  //           2) Technology Image column (technology_image_embed_url)
  //           3) Legacy fallbacks
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
      lower.includes('not available') || lower.includes('not specified')
    ) return '';
    return clean;
  };

  const trlVal   = sanitize(technology.trl);
  const patentVal = sanitize(technology.patent_status);
  const commVal  = sanitize(technology.commercialization_status);

  const trlDisplay  = trlVal ? (trlVal.toUpperCase().startsWith('TRL') ? trlVal.toUpperCase() : `TRL ${trlVal}`) : '';
  const patentDisplay = patentVal;
  const commDisplay   = commVal;

  const badges: React.ReactNode[] = [];

  if (technology.last_updated) {
    badges.push(
      <span key="new" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        NEW
      </span>
    );
  }
  if (trlDisplay) {
    badges.push(
      <span key="trl" className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
        {trlDisplay}
      </span>
    );
  }
  if (patentDisplay) {
    badges.push(
      <span key="patent" className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        {patentDisplay}
      </span>
    );
  }
  if (commDisplay) {
    badges.push(
      <span key="commercialization" className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
        {commDisplay}
      </span>
    );
  }

  const visibleBadges = badges.filter(Boolean);

  const cardMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.4, ease: 'easeOut' as const },
      };

  if (compact) {
    return (
      <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-compact-${technology.id}`}>
        <motion.div
          className="bg-white rounded-md border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-blue-200 transition-all duration-250"
          {...cardMotion}
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 relative">
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
              <span className="inline-block text-[9px] font-bold text-[#0A2164] uppercase tracking-wider mb-1">
                {technology.sector}
              </span>
              <h4 className="font-heading font-bold text-gray-900 text-[14px] leading-tight line-clamp-2 group-hover:text-[#0A2164] transition-colors">
                {technology.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-gray-500 line-clamp-1">{technology.institution}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/technologies/${technology.id}`} className="block group h-full" id={`tech-card-${technology.id}`}>
      <motion.div
        className="bg-white rounded-xl border border-gray-100/80 shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-blue-200"
        {...cardMotion}
      >
        {/* Banner Frame */}
        <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-gray-50 border-b border-gray-100">
          {hasImage ? (
            <>
              <img
                  src={displayImage}
                  alt={technology.name}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              {/* Light gradient overlay for badge readability */}
              <div
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 w-full h-full opacity-25 z-0">
              <SectorIllustration slug={technology.sector_slug} accentColor={SECTOR_ACCENTS[technology.sector_slug] || '#0A2164'} />
              <div
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  background: 'linear-gradient(to top, rgba(17,24,39,0.5) 0%, transparent 60%)',
                }}
              />
            </div>
          )}
          {/* Sector pill */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-gray-800 border border-gray-200 backdrop-blur-sm uppercase tracking-wider shadow-sm">
              {technology.sector}
            </span>
          </div>

          {/* ★ Featured ribbon — vertical bookmark hanging from top */}
          {featured && (
            <div
              className="absolute top-0 left-4 z-10 flex flex-col items-center justify-start shadow-md"
              style={{
                width: 30,
                height: '58%',
                background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 80%, #B45309 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)',
              }}
            >
              {/* Star at top */}
              <span
                style={{
                  fontSize: 13,
                  color: '#7C2D12',
                  marginTop: 7,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
                }}
              >
                ★
              </span>
              {/* Vertical text */}
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  fontSize: 8,
                  fontWeight: 800,
                  color: '#7C2D12',
                  letterSpacing: '0.12em',
                  marginTop: 6,
                  textTransform: 'uppercase',
                }}
              >
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider line-clamp-1">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-gray-900 text-[16px] leading-snug mb-3 group-hover:text-[#0A2164] transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Badges */}
          {visibleBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleBadges}
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-end">
            <motion.span
              className="flex items-center gap-1 text-[11px] font-bold text-[#0A2164] group-hover:gap-2 transition-all duration-200"
              transition={{ duration: 0.15 }}
            >
              Explore Opportunity <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
