'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import { SectorIllustration, SECTOR_ACCENTS } from './SectorCard';

interface Props {
  technology: Technology;
  compact?: boolean;
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  
  // Resolve technology image source
  const displayImage = technology.technology_image_embed_url || technology.technology_image || technology.image_embed_url;
  const hasImage = !!displayImage && !imageFailed;
  
  // Startup Potential validation
  const isFeatured = ['featured', 'very high', 'high'].includes(technology.startup_potential?.toLowerCase() || '');
  const potentialLabel = technology.startup_potential === 'Featured'
    ? '★ FEATURED'
    : technology.startup_potential === 'Very High'
    ? '★ VERY HIGH'
    : '★ HIGH POTENTIAL';

  // Sanitizer function to check if value exists and is meaningful
  const sanitize = (val: string | null | undefined): string => {
    if (!val) return '';
    const clean = val.trim();
    const lower = clean.toLowerCase();
    if (
      lower === '' ||
      lower === 'na' ||
      lower === 'n/a' ||
      lower === 'nil' ||
      lower === 'none' ||
      lower.includes('not available') ||
      lower.includes('not specified')
    ) {
      return '';
    }
    return clean;
  };

  const trlVal = sanitize(technology.trl);
  const patentVal = sanitize(technology.patent_status);
  const commVal = sanitize(technology.commercialization_status);

  // Formatted labels
  const trlDisplay = trlVal 
    ? (trlVal.toUpperCase().startsWith('TRL') ? trlVal.toUpperCase() : `TRL ${trlVal}`)
    : '';
  const patentDisplay = patentVal;
  const commDisplay = commVal;

  // Priority Badge Ordering
  const badges: React.ReactNode[] = [];

  // 1. ★ FEATURED / POTENTIAL (always first)
  if (isFeatured) {
    badges.push(
      <span key="featured" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E9C46A] text-[#112920]">
        {potentialLabel}
      </span>
    );
  }

  // 1b. NEW Badge (if last_updated exists)
  if (technology.last_updated) {
    badges.push(
      <span key="new" className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-[#112920]">
        NEW • {technology.last_updated}
      </span>
    );
  }

  // 2. TRL Badge
  if (trlDisplay) {
    badges.push(
      <span key="trl" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[#00FA9A]/10 text-[#00FA9A] border border-[#00FA9A]/20">
        {trlDisplay}
      </span>
    );
  }

  // 3. Patent Badge
  if (patentDisplay) {
    badges.push(
      <span key="patent" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[#E9C46A]/10 text-[#E9C46A] border border-[#E9C46A]/20">
        {patentDisplay}
      </span>
    );
  }

  // 4. Commercialization Badge
  if (commDisplay) {
    badges.push(
      <span key="commercialization" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {commDisplay}
      </span>
    );
  }

  const visibleBadges = badges.filter(Boolean);

  if (compact) {
    return (
      <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-compact-${technology.id}`}>
        <div className="bg-card rounded-2xl border border-border p-4 hover:border-accent/30 hover:shadow-lg transition-all duration-300">
          <div className="flex gap-4">
            {/* Small image thumb or sector fallback icon */}
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#0A0820] border border-border relative">
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
                <div className="w-full h-full opacity-40">
                  <SectorIllustration slug={technology.sector_slug} accentColor={SECTOR_ACCENTS[technology.sector_slug] || '#10B981'} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold text-accent uppercase tracking-wider mb-1">
                {technology.sector}
              </span>
              <h4 className="font-heading font-bold text-heading text-[14px] leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                {technology.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-text-secondary line-clamp-1">{technology.institution}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/technologies/${technology.id}`} className="block group h-full" id={`tech-card-${technology.id}`}>
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300">

        {/* Banner Frame (Image or Fallback) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-[#0A0820] border-b border-border">
          {hasImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={technology.name}
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              {/* Dark gradient overlay for text/badge readability */}
              <div
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  background: 'linear-gradient(to top, rgba(11, 8, 32, 0.8) 0%, rgba(11, 8, 32, 0.1) 100%)',
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 w-full h-full opacity-40 z-0">
              <SectorIllustration slug={technology.sector_slug} accentColor={SECTOR_ACCENTS[technology.sector_slug] || '#10B981'} />
              <div
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  background: 'linear-gradient(to top, rgba(11, 8, 32, 0.9) 0%, rgba(11, 8, 32, 0.3) 100%)',
                }}
              />
            </div>
          )}
          {/* Sector pill overlay on banner bottom-left */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0A0820]/90 text-text-primary border border-border backdrop-blur-sm uppercase tracking-wider">
              {technology.sector}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider line-clamp-1">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-heading text-[16px] leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Badges Container - only renders if there are visible badges */}
          {visibleBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleBadges}
            </div>
          )}

          {/* View Details CTA */}
          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-secondary font-medium">
              ID: {technology.id}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-accent group-hover:gap-2 transition-all">
              Explore Opportunity <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
