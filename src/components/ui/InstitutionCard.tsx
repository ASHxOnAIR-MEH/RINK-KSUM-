'use client';

import { Institution } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, Layers } from 'lucide-react';

interface Props {
  institution: Institution & { specializations?: string[] };
}

// ── Map each institution slug to a relevant sector background image ────
const INST_BANNERS: Record<string, string> = {
  'kau':                                           '/images/sectors/agriculture.png',
  'icar-cpcri':                                    '/images/sectors/food-technology.png',
  'cpcri':                                         '/images/sectors/food-technology.png',
  'icar-ctcri':                                    '/images/sectors/biotechnology-life-sciences.png',
  'ctcri':                                         '/images/sectors/biotechnology-life-sciences.png',
  'csir-niist':                                    '/images/sectors/advanced-materials-chemicals.png',
  'niist':                                         '/images/sectors/advanced-materials-chemicals.png',
  'cwrdm':                                         '/images/sectors/water-environment-waste-management.png',
  'kscste':                                        '/images/sectors/energy-climate-sustainability.png',
  'kscste-kfri':                                   '/images/sectors/energy-climate-sustainability.png',
  'kfri':                                          '/images/sectors/energy-climate-sustainability.png',
  'jntbgri':                                       '/images/sectors/biotechnology-life-sciences.png',
  'kufos':                                         '/images/sectors/water-environment-waste-management.png',
  'ncrmi':                                         '/images/sectors/infrastructure-construction-smart-cities.png',
  'default':                                       '/images/sectors/digital-technologies-ai-software.png',
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
  
  // Extract capital letters
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 1) {
    return matches.join('').slice(0, 5);
  }
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 5);
}

export default function InstitutionCard({ institution }: Props) {
  const slug = institution.slug;
  const banner = institution.bannerImage || institution.image || INST_BANNERS[slug] || INST_BANNERS['default'];
  const acronym = getAcronym(institution.name);
  const specs = institution.specializations || ['General Technology'];

  return (
    <Link
      href={`/institutions/${slug}`}
      id={`inst-card-${slug}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card h-[200px] flex flex-col justify-between hover:border-accent/30 hover:shadow-2xl transition-all duration-300">
        
        {/* Banner Image Header (16:6 approximate ratio) */}
        <div className="relative h-20 w-full overflow-hidden flex-shrink-0 bg-card-secondary">
          <Image
            src={banner}
            alt={institution.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent pointer-events-none" />
          
          {/* Circular logo badge overlapping the banner */}
          <div className="absolute -bottom-4.5 left-4 w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center font-heading font-black text-[10px] shadow-lg tracking-wide text-accent select-none pointer-events-none">
            {acronym}
          </div>
        </div>

        {/* Card content */}
        <div className="flex-1 flex flex-col justify-between p-4 pt-6">
          <div>
            <h3 className="font-heading font-bold text-heading text-sm leading-snug group-hover:text-accent transition-colors line-clamp-1">
              {institution.name}
            </h3>
            
            {/* Specialization List */}
            <p className="text-[11px] text-text-secondary font-medium mt-1 line-clamp-1">
              {specs.join(' • ')}
            </p>
          </div>

          {/* Footer details */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/20">
              {institution.tech_count} {institution.tech_count === 1 ? 'Tech' : 'Techs'}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-accent group-hover:gap-1 transition-all">
              Discover <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
