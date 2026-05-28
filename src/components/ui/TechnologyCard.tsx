'use client';

import { Technology } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight, Star, CheckCircle, Clock, FlaskConical } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  technology: Technology;
  compact?: boolean;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  'Commercial Ready':             { label: 'Commercial Ready',      className: 'badge-green',  icon: CheckCircle },
  'Technology Transfer Available':{ label: 'Transfer Available',    className: 'badge-blue',   icon: ArrowRight },
  'Pilot Stage':                  { label: 'Pilot Stage',           className: 'badge-gold',   icon: Clock },
  'Lab Stage':                    { label: 'Lab Stage',             className: 'badge-gray',   icon: FlaskConical },
};

export default function TechnologyCard({ technology, compact = false }: Props) {
  const status = statusConfig[technology.commercialization_status] ?? statusConfig['Lab Stage'];
  const StatusIcon = status.icon;

  return (
    <Link href={`/technologies/${technology.id}`} className="block group">
      <div className="card h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex-shrink-0">
          <Image
            src={technology.image_url}
            alt={technology.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {/* Featured badge */}
          {technology.featured && (
            <div className="absolute top-3 left-3 badge badge-gold text-xs">
              ⭐ Featured
            </div>
          )}
          {/* Sector pill */}
          <div className="absolute bottom-3 left-3 badge badge-blue text-xs">
            {technology.sector}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-[#003F8A] transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Problem solved */}
          {!compact && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
              {technology.problem_solved}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            {/* Status badge */}
            <span className={clsx('badge text-xs', status.className)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>

            {/* Startup potential stars */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-3 h-3',
                    i < technology.startup_potential
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
