import { Sector } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSectorIcon } from './SectorIcons';

interface Props {
  sector: Sector;
}

export default function SectorCard({ sector }: Props) {
  return (
    <Link href={`/sectors/${sector.slug}`} id={`sector-card-${sector.slug}`}>
      <div className="sector-card group h-full">
        {/* SVG Icon box */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${sector.color}18` }}
        >
          {getSectorIcon(sector.slug, sector.color, 22)}
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
