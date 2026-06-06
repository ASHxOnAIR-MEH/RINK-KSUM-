'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

interface Props {
  technology: Technology;
  compact?: boolean;
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = !!technology.image_embed_url && !imageFailed;
  const isHigh = technology.startup_potential === 'High';

  // Clean metadata
  const trlClean = (technology.trl && !technology.trl.toLowerCase().includes('not available'))
    ? (technology.trl.startsWith('TRL') ? technology.trl : `TRL ${technology.trl}`)
    : '';

  const patentClean = (technology.patent_status && !technology.patent_status.toLowerCase().includes('not available'))
    ? technology.patent_status
    : '';

  const commClean = (technology.commercialization_status && !technology.commercialization_status.toLowerCase().includes('not available'))
    ? technology.commercialization_status
    : '';

  // Priority Badge Ordering
  const badges: React.ReactNode[] = [];

  // 1. ★ FEATURED (always first)
  if (isHigh) {
    badges.push(
      <span key="featured" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E9C46A] text-[#112920]">
        ★ FEATURED
      </span>
    );
  }

  // 2. TRL Badge
  if (trlClean && !technology.trl.toLowerCase().includes('not specified') && !technology.trl.toLowerCase().includes('na')) {
    badges.push(
      <span key="trl" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[#00FA9A]/10 text-[#00FA9A] border border-[#00FA9A]/20">
        {trlClean}
      </span>
    );
  }

  // 3. Patent Badge
  if (patentClean && !technology.patent_status.toLowerCase().includes('not specified') && !technology.patent_status.toLowerCase().includes('na')) {
    badges.push(
      <span key="patent" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[#E9C46A]/10 text-[#E9C46A] border border-[#E9C46A]/20">
        {patentClean}
      </span>
    );
  }

  // 4. Commercialization Badge
  if (commClean && !technology.commercialization_status.toLowerCase().includes('not specified') && !technology.commercialization_status.toLowerCase().includes('na')) {
    badges.push(
      <span key="commercialization" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {commClean}
      </span>
    );
  }

  const visibleBadges = badges.filter(Boolean);

  return (
    <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-${technology.id}`}>
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300">

        {/* Image Frame */}
        {hasImage && (
          <div className="relative h-36 overflow-hidden flex-shrink-0 bg-card-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={technology.image_embed_url}
              alt={technology.name}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Sector pill */}
            <div className="absolute bottom-3 left-3">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 text-text-primary border border-border backdrop-blur-sm">
                {technology.sector}
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* If no image, render sector inline */}
          {!hasImage && (
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-card-secondary text-text-primary border border-border">
                {technology.sector}
              </span>
            </div>
          )}

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
