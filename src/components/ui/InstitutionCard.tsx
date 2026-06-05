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

export default function InstitutionCard({ institution }: Props) {
  const slug = institution.slug;
  const acronym = getAcronym(institution.name);
  const spec = INST_SPECIALIZATIONS[slug.toLowerCase()] || 'Research Partner';

  return (
    <Link
      href={`/institutions/${slug}`}
      id={`inst-card-${slug}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card h-[142px] flex flex-col justify-between p-5 hover:border-accent/35 hover:shadow-xl transition-all duration-300">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Acronym Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide bg-accent/10 text-accent border border-accent/20">
            {acronym}
          </span>
          {/* Research Partner Label */}
          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
            Research Partner
          </span>
        </div>

        {/* Name and Specialization */}
        <div className="my-2">
          <h3 className="font-heading font-bold text-heading text-[15px] leading-snug line-clamp-1 group-hover:text-accent transition-colors">
            {institution.name}
          </h3>
          <p className="text-[11px] text-text-secondary font-medium mt-0.5 line-clamp-1">
            {spec}
          </p>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border mt-auto">
          {/* Tech Count */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/20">
            {institution.tech_count} {institution.tech_count === 1 ? 'Tech Opportunity' : 'Tech Opportunities'}
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
