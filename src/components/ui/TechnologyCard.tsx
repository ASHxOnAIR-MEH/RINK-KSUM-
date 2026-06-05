'use client';

import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle, FlaskConical } from 'lucide-react';
import TechImage from './TechImage';

interface Props {
  technology: Technology;
  compact?: boolean;
}

// Split comma-separated technology type string into individual tags
function parseTechTypes(raw: string): string[] {
  if (!raw || raw === 'Not Specified' || raw === 'NA' || raw === 'Information being updated') return [];
  return raw.split(',').map(t => t.trim()).filter(t => t.length > 0 && t !== 'Not Specified' && t !== 'NA');
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  const techTypes = parseTechTypes(technology.technology_type);

  const pot = technology.startup_potential;
  const isHigh = pot === 'High';
  
  const potentialClass = 
    pot === 'High' 
      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15'
      : pot === 'Medium'
      ? 'bg-amber-600/10 text-amber-700 border border-amber-600/20 dark:text-amber-400 dark:bg-amber-500/15'
      : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10';

  const showPatent = technology.patent_status && 
    technology.patent_status !== 'Not Specified' && 
    technology.patent_status !== 'NA' && 
    technology.patent_status !== 'Information being updated';

  const showTRL = technology.trl && 
    technology.trl !== 'Not Specified' && 
    technology.trl !== 'NA' &&
    technology.trl !== 'Information being updated';

  return (
    <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-${technology.id}`}>
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300">

        {/* Image Frame */}
        <div className="relative h-44 overflow-hidden flex-shrink-0 bg-card-secondary">
          <TechImage
            src={technology.image_embed_url}
            alt={technology.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Sector pill */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 text-text-primary border border-border backdrop-blur-sm">
              {technology.sector}
            </span>
          </div>
          {/* Automatic High Potential / Featured Badge */}
          {isHigh && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black shadow-lg bg-emerald-500 text-slate-950 animate-pulse">
                ★ HIGH POTENTIAL
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">

          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-heading text-[17px] leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Metadata badges (TRL, Patent, Startup Potential) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {/* Startup Potential Badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${potentialClass}`}>
              {pot === 'High' ? 'High Potential' : pot === 'Medium' ? 'Medium Potential' : pot === 'Low' ? 'Low Potential' : 'Potential: ' + pot}
            </span>

            {/* Patent Status Badge */}
            {showPatent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-primary bg-card-secondary border border-border px-2 py-0.5 rounded-full">
                ⚖️ {technology.patent_status}
              </span>
            )}

            {/* TRL Level Badge */}
            {showTRL && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-secondary bg-accent-secondary/10 border border-accent-secondary/20 px-2 py-0.5 rounded-full">
                🚀 TRL {technology.trl}
              </span>
            )}
          </div>

          {/* Technology Type tags */}
          {techTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {techTypes.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-text-secondary bg-card-secondary border border-border px-2 py-0.5 rounded-full"
                >
                  <FlaskConical className="w-2.5 h-2.5 text-text-secondary flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Problem Solved */}
          {!compact && technology.problem_solved && technology.problem_solved !== 'Information being updated' && (
            <p className="text-sm text-text-primary leading-relaxed line-clamp-2 flex-1 mb-4">
              {technology.problem_solved}
            </p>
          )}

          {/* Applications list */}
          {!compact && technology.applications.length > 0 && technology.applications[0] !== 'Information being updated' && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {technology.applications.slice(0, 2).map((app, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-text-primary bg-card-secondary border border-border px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  {app}
                </span>
              ))}
            </div>
          )}

          {/* View Details CTA */}
          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium">
              {showTRL ? `Readiness Level ${technology.trl}` : 'Click to discover'}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-accent group-hover:gap-2 transition-all">
              Commercialize Opportunity <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
