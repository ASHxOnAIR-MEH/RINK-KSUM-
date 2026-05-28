'use client';

import { Sector } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  sector: Sector;
}

const sectorGradients: Record<string, string> = {
  'agriculture':         'from-green-50 to-emerald-100',
  'food-processing':     'from-orange-50 to-amber-100',
  'water-technology':    'from-blue-50 to-sky-100',
  'renewable-energy':    'from-yellow-50 to-amber-100',
  'climate-tech':        'from-teal-50 to-cyan-100',
  'manufacturing':       'from-purple-50 to-violet-100',
  'sustainable-materials':'from-lime-50 to-green-100',
  'biotechnology':       'from-red-50 to-rose-100',
  'healthcare':          'from-purple-50 to-pink-100',
  'smart-systems':       'from-sky-50 to-blue-100',
};

export default function SectorCard({ sector }: Props) {
  const gradient = sectorGradients[sector.slug] ?? 'from-gray-50 to-slate-100';

  return (
    <Link href={`/sectors/${sector.slug}`} className="block group">
      <div className="sector-card">
        {/* Icon bubble */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110`}
        >
          {sector.icon}
        </div>

        {/* Name */}
        <h3 className="font-heading font-bold text-gray-900 text-base mb-1 group-hover:text-[#003F8A] transition-colors">
          {sector.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {sector.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#003F8A] bg-blue-50 px-2.5 py-1 rounded-full">
            {sector.tech_count} {sector.tech_count === 1 ? 'Technology' : 'Technologies'}
          </span>
          <span className="text-[#003F8A] group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
