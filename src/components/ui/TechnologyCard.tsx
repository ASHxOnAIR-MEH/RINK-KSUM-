'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

interface Props {
  technology: Technology;
  compact?: boolean;
}

// Dynamic Opportunity Score Formula
function calculateOpportunityScore(tech: Technology): number {
  let score = 0;

  // 1. TRL level score: TRL 1-3 => +20, TRL 4-6 => +40, TRL 7-9 => +60
  const trlRaw = (tech.trl || '').toLowerCase();
  if (!trlRaw.includes('not available') && !trlRaw.includes('not specified') && !trlRaw.includes('na')) {
    const match = trlRaw.match(/\d+/);
    if (match) {
      const level = parseInt(match[0], 10);
      if (level >= 7) score += 60;
      else if (level >= 4) score += 40;
      else if (level >= 1) score += 20;
    }
  }

  // 2. Patent score: Applied => +15, Patented => +25
  const patentRaw = (tech.patent_status || '').toLowerCase();
  if (!patentRaw.includes('not available') && !patentRaw.includes('not specified') && !patentRaw.includes('na')) {
    if (patentRaw.includes('patented') || patentRaw.includes('granted')) {
      score += 25;
    } else if (patentRaw.includes('applied') || patentRaw.includes('filed') || patentRaw.includes('pending') || patentRaw.includes('published')) {
      score += 15;
    }
  }

  // 3. Startup Potential score: Low => +5, Medium => +10, High => +15
  const potential = tech.startup_potential;
  if (potential === 'High') score += 15;
  else if (potential === 'Medium') score += 10;
  else if (potential === 'Low') score += 5;

  // 4. Commercialization score: Prototype => +5, Pilot => +10, Market Ready => +15
  const commRaw = (tech.commercialization_status || '').toLowerCase();
  if (!commRaw.includes('not available') && !commRaw.includes('not specified') && !commRaw.includes('na')) {
    if (commRaw.includes('market ready') || commRaw.includes('commercialized') || commRaw.includes('production ready')) {
      score += 15;
    } else if (commRaw.includes('pilot')) {
      score += 10;
    } else if (commRaw.includes('prototype')) {
      score += 5;
    }
  }

  return Math.min(100, score);
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = !!technology.image_embed_url && !imageFailed;
  const isHigh = technology.startup_potential === 'High';
  const score = calculateOpportunityScore(technology);

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

          {/* Opportunity Score Indicator */}
          <div className="flex items-center justify-between mb-4 bg-accent/5 dark:bg-accent/5 rounded-xl p-2.5 border border-accent/10">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              Opportunity Score
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-xs font-black text-heading">
                {score}
              </span>
            </div>
          </div>

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
