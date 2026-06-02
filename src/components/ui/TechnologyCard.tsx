'use client';

import { Technology } from '@/types';
import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle } from 'lucide-react';
import TechImage from './TechImage';

interface Props {
  technology: Technology;
  compact?: boolean;
}

export default function TechnologyCard({ technology, compact = false }: Props) {
  return (
    <Link href={`/technologies/${technology.id}`} className="block group" id={`tech-card-${technology.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col hover:border-gray-200 hover:shadow-md transition-all duration-200">

        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0 bg-gray-50">
          <TechImage
            src={technology.image_embed_url}
            alt={technology.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Sector pill — only if image exists */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 border border-gray-200 backdrop-blur-sm">
              {technology.sector}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">

          {/* Institution */}
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <span className="text-xs text-gray-400 line-clamp-1">
              {technology.institution}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-[#003F8A] transition-colors line-clamp-2">
            {technology.name}
          </h3>

          {/* Problem Solved */}
          {!compact && technology.problem_solved && technology.problem_solved !== 'Information being updated' && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
              {technology.problem_solved}
            </p>
          )}

          {/* Applications — compact list */}
          {!compact && technology.applications.length > 0 && technology.applications[0] !== 'Information being updated' && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {technology.applications.slice(0, 2).map((app, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  {app}
                </span>
              ))}
            </div>
          )}

          {/* View Details CTA */}
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {technology.trl && technology.trl !== 'Not Specified' ? `TRL ${technology.trl}` : ''}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#003F8A] group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
