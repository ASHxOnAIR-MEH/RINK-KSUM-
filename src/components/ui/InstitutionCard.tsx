'use client';

import { Institution } from '@/types';
import Link from 'next/link';
import { MapPin, Globe, ArrowRight, FlaskConical } from 'lucide-react';

interface Props {
  institution: Institution;
}

const institutionColors: Record<string, { bg: string; text: string; border: string }> = {
  ctcri:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  cpcri:    { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  niist:    { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' },
  ncrmi:    { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  kscste:   { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  kfri:     { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  cwrdm:    { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  jntbgri:  { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
};

export default function InstitutionCard({ institution }: Props) {
  const colors = institutionColors[institution.slug] ?? {
    bg: '#F8FAFF', text: '#003F8A', border: '#BFDBFE'
  };

  return (
    <Link href={`/institutions/${institution.slug}`} className="block group">
      <div className="card h-full flex flex-col p-6">
        {/* Acronym badge */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black font-heading mb-4 border-2 transition-transform duration-300 group-hover:scale-110"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {institution.acronym.slice(0, 2)}
        </div>

        {/* Acronym + full name */}
        <div className="mb-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: colors.text }}>
            {institution.acronym}
          </div>
          <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug group-hover:text-[#003F8A] transition-colors line-clamp-2">
            {institution.full_name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {institution.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{institution.location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" style={{ color: colors.text }} />
            <span className="text-xs font-semibold" style={{ color: colors.text }}>
              {institution.tech_count} {institution.tech_count === 1 ? 'Technology' : 'Technologies'}
            </span>
          </div>
          <ArrowRight
            className="w-4 h-4 text-gray-400 group-hover:text-[#003F8A] group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
