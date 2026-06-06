'use client';

import { Institution } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  institution: Institution;
}

const INST_SPECIALIZATIONS: Record<string, string> = {
  'icar-cpcri': 'Coconut Innovation',
  'cpcri': 'Coconut Innovation',
  'icar-ctcri': 'Tuber Crops & Biotechnology',
  'ctcri': 'Tuber Crops & Biotechnology',
  'kufos': 'Ocean Technology & Fisheries',
  'kau': 'Agriculture / Smart Farming',
  'csir-niist': 'Advanced Materials & Chemical Innovation',
  'niist': 'Advanced Materials & Chemical Innovation',
  'c-dac': 'AI, Computing & Digital Innovation',
  'cdac': 'AI, Computing & Digital Innovation'
};

function getAcronym(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes('CPCRI')) return 'CPCRI';
  if (upper.includes('CTCRI')) return 'CTCRI';
  if (upper.includes('NIIST')) return 'NIIST';
  if (upper.includes('KAU')) return 'KAU';
  if (upper.includes('CWRDM')) return 'CWRDM';
  if (upper.includes('KSCSTE')) return 'KSCSTE';
  if (upper.includes('KFRI')) return 'KFRI';
  if (upper.includes('JNTBGRI')) return 'JNTBGRI';
  if (upper.includes('NCRMI')) return 'NCRMI';
  if (upper.includes('KUFOS')) return 'KUFOS';
  
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 1) {
    return matches.join('').slice(0, 5);
  }
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 5);
}

function InstitutionBackground({ slug }: { slug: string }) {
  const s = slug.toLowerCase();
  
  // CPCRI -> Coconut Innovation
  if (s.includes('cpcri')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <path d="M50 90 L50 20 C 50 10, 55 10, 60 5" strokeWidth="1.5" />
          <path d="M50 20 C 40 10, 30 15, 20 20" />
          <path d="M50 20 C 35 5, 25 5, 15 10" />
          <path d="M50 20 C 60 10, 70 15, 80 20" />
          <path d="M50 20 C 65 5, 75 5, 85 10" />
          <circle cx="46" cy="24" r="3.5" fill="currentColor" fillOpacity="0.2" />
          <circle cx="54" cy="25" r="4" fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>
    );
  }
  
  // CTCRI -> Tuber Crop Innovation
  if (s.includes('ctcri')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <path d="M50 40 C 25 35, 10 50, 30 75 C 40 85, 60 85, 70 75 C 90 50, 75 35, 50 40 Z" strokeWidth="1.2" />
          <path d="M50 40 V15 M50 15 L35 5 M50 15 L65 5" />
          <path d="M30 60 H70 M35 70 H65" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }
  
  // KUFOS -> Fisheries / Ocean Ecosystem
  if (s.includes('kufos')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <path d="M15 45 C 30 30, 60 30, 85 45 C 90 48, 90 52, 85 55 C 60 70, 30 70, 15 55 Z" strokeWidth="1.2" />
          <path d="M85 45 L95 35 V65 L85 55 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="30" cy="48" r="1.5" fill="currentColor" />
          <path d="M10 75 C 30 65, 50 85, 70 75 C 90 65, 100 75, 100 75" />
        </svg>
      </div>
    );
  }
  
  // C-DAC -> Computing & AI
  if (s.includes('c-dac') || s.includes('cdac')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <rect x="25" y="25" width="50" height="50" rx="4" strokeWidth="1.2" />
          <rect x="37" y="37" width="26" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
          <path d="M35 15 v10 M45 15 v10 M55 15 v10 M65 15 v10" />
          <path d="M35 75 v10 M45 75 v10 M55 75 v10 M65 75 v10" />
          <path d="M15 35 h10 M15 45 h10 M15 55 h10 M15 65 h10" />
          <path d="M75 35 h10 M75 45 h10 M75 55 h10 M75 65 h10" />
        </svg>
      </div>
    );
  }
  
  // KAU -> Agriculture Ecosystem
  if (s.includes('kau')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <path d="M50 90 V20" strokeWidth="1.5" />
          <path d="M50 35 C 35 30, 30 20, 30 20 C 30 20, 40 25, 50 35" />
          <path d="M50 35 C 65 30, 70 20, 70 20 C 70 20, 60 25, 50 35" />
          <path d="M50 55 C 35 50, 30 40, 30 40 C 30 40, 40 45, 50 55" />
          <path d="M50 55 C 65 50, 70 40, 70 40 C 70 40, 60 45, 50 55" />
          <path d="M50 75 C 35 70, 30 60, 30 60 C 30 60, 40 65, 50 75" />
          <path d="M50 75 C 65 70, 70 60, 70 60 C 70 60, 60 65, 50 75" />
        </svg>
      </div>
    );
  }

  // NIIST -> Advanced Materials
  if (s.includes('niist')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" strokeWidth="1.2" />
          <circle cx="50" cy="20" r="3.5" fill="currentColor" />
          <circle cx="75" cy="35" r="3.5" fill="currentColor" />
          <circle cx="75" cy="65" r="3.5" fill="currentColor" />
          <circle cx="50" cy="80" r="3.5" fill="currentColor" />
          <circle cx="25" cy="65" r="3.5" fill="currentColor" />
          <circle cx="25" cy="35" r="3.5" fill="currentColor" />
          <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  // CWRDM -> Water Resources
  if (s.includes('cwrdm')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] text-accent flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
          <path d="M50 15 C 50 15, 80 48, 80 65 C 80 81.5, 66.5 90, 50 90 C 33.5 90, 20 81.5, 20 65 C 20 48, 50 15, 50 15 Z" strokeWidth="1.2" />
          <path d="M30 65 C 40 70, 60 60, 70 65" />
        </svg>
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] text-accent flex items-center justify-end pr-4 select-none">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24">
        <path d="M10 20 H90 M10 50 H90 M10 80 H90" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="15" />
      </svg>
    </div>
  );
}

export default function InstitutionCard({ institution }: Props) {
  const slug = institution.slug;
  const acronym = getAcronym(institution.name);
  const specFallback = INST_SPECIALIZATIONS[slug.toLowerCase()] || 'Research Partner';
  const specs = institution.specializations || [specFallback];

  return (
    <Link
      href={`/institutions/${slug}`}
      id={`inst-card-${slug}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card h-[145px] flex flex-col justify-between p-5 hover:border-accent/35 hover:shadow-xl transition-all duration-300">
        
        {/* Subtle radial glow on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-0 group-hover:opacity-[0.035] transition-opacity duration-500 pointer-events-none z-0" />

        {/* Institution-specific background branding SVG */}
        <InstitutionBackground slug={slug} />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 z-10">
          {/* Acronym Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide bg-accent/10 text-accent border border-accent/20">
            {acronym}
          </span>
          {/* Research Partner Label */}
          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
            Research Partner
          </span>
        </div>

        {/* Name and Specializations */}
        <div className="my-1.5 z-10">
          <h3 className="font-heading font-bold text-heading text-[14px] leading-snug line-clamp-1 group-hover:text-accent transition-colors">
            {institution.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {specs.slice(0, 3).map((s, idx) => (
              <span key={idx} className="text-[9px] font-bold tracking-wide text-accent bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border mt-auto z-10">
          {/* Tech Count */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/20">
            {institution.tech_count} {institution.tech_count === 1 ? 'Opportunity' : 'Opportunities'}
          </span>
          {/* Discover CTA */}
          <span className="flex items-center gap-1 text-[11px] font-bold text-accent group-hover:gap-1.5 transition-all">
            Discover <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </Link>
  );
}
