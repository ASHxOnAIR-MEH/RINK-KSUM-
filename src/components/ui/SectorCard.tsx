import { Sector } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  sector: Sector;
}

export default function SectorCard({ sector }: Props) {
  return (
    <Link href={`/sectors/${sector.slug}`} id={`sector-card-${sector.slug}`}>
      <div className="sector-card group h-full">
        {/* Top color accent */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl"
          style={{ background: `${sector.color}15` }}
        >
          {sector.icon}
        </div>
        <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#003F8A] transition-colors">
          {sector.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {sector.tech_count} {sector.tech_count === 1 ? 'technology' : 'technologies'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#003F8A] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
