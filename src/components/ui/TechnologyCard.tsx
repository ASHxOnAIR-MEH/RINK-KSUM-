'use client';

import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight, Star, CheckCircle, Clock, FlaskConical, Zap } from 'lucide-react';
import TechImage from './TechImage';

interface Props {
  technology: Technology;
  compact?: boolean;
}

function StartupPotentialBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    'High':   'badge-green',
    'Medium': 'badge-gold',
    'Low':    'badge-gray',
  };
  return (
    <span className={`badge text-xs ${colors[level] ?? 'badge-gray'}`}>
      {level === 'High' && <Zap className="w-3 h-3" />}
      {level} Potential
    </span>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Startup potential: ${score}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < score ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  return (
    <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-${technology.id}`}>
      <div className="card h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <TechImage
            src={technology.image_embed_url}
            alt={technology.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Sector pill */}
          <div className="absolute bottom-3 left-3 badge badge-blue text-xs z-10 shadow-sm">
            {technology.sector}
          </div>
          {technology.startup_potential === 'High' && (
            <div className="absolute top-3 right-3 badge badge-green text-xs z-10 shadow-sm">
              ⭐ High Potential
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide line-clamp-1">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-[#003F8A] transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Problem solved — founder-first */}
          {!compact && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
              {technology.problem_solved}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <StartupPotentialBadge level={technology.startup_potential} />
            <StarRating score={technology.startup_potential_score} />
          </div>
        </div>
      </div>
    </Link>
  );
}
