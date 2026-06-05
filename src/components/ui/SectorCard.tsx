'use client';

import { Sector } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getSectorIcon } from './SectorIcons';

interface Props {
  sector: Sector;
}

// ── Map each sector slug → its generated background image ────
const SECTOR_IMAGES: Record<string, string> = {
  'food-technology':                          '/images/sectors/food-technology.png',
  'agriculture':                              '/images/sectors/agriculture.png',
  'medtech-health-care':                      '/images/sectors/medtech-health-care.png',
  'biotechnology-life-sciences':              '/images/sectors/biotechnology-life-sciences.png',
  'biotechnology-life-sciences-1':            '/images/sectors/biotechnology-life-sciences.png',
  'energy-climate-sustainability':            '/images/sectors/energy-climate-sustainability.png',
  'digital-technologies-ai-software':        '/images/sectors/digital-technologies-ai-software.png',
  'digital-technologies-al-software':        '/images/sectors/digital-technologies-ai-software.png',
  'advanced-materials-chemicals':             '/images/sectors/advanced-materials-chemicals.png',
  'consumer-products-cosmetics-lifestyle':    '/images/sectors/consumer-products-cosmetics-lifestyle.png',
  'water-environment-waste-management':       '/images/sectors/water-environment-waste-management.png',
  'infrastructure-construction-smart-cities': '/images/sectors/infrastructure-construction-smart-cities.png',
  'robotics-automation-drones':               '/images/sectors/robotics-automation-drones.png',
  'manufacturing-industrial-technologies':    '/images/sectors/robotics-automation-drones.png', // fallback
};

// ── Map each sector slug → its dynamic sub-sectors ────
const SECTOR_SUBSECTORS: Record<string, string[]> = {
  'agriculture':                              ['Precision farming', 'Smart irrigation', 'Agricultural drones'],
  'food-technology':                          ['Food processing', 'Packaging', 'Value-added products'],
  'water-environment-waste-management':       ['Water treatment', 'Smart monitoring systems'],
  'energy-climate-sustainability':            ['Solar', 'Clean energy systems'],
  'climate-tech':                             ['Sustainability', 'Carbon reduction'],
  'manufacturing-industrial-technologies':    ['Industrial automation', 'Smart factories'],
  'default':                                  ['Commercialization', 'Innovation', 'Scale'],
};

export default function SectorCard({ sector }: Props) {
  const bgImage = SECTOR_IMAGES[sector.slug];
  const subsectors = SECTOR_SUBSECTORS[sector.slug] || SECTOR_SUBSECTORS['default'];

  return (
    <Link href={`/sectors/${sector.slug}`} id={`sector-card-${sector.slug}`} className="block group">
      <div
        className="relative overflow-hidden rounded-2xl h-48 flex flex-col justify-end cursor-pointer transition-all duration-300 border border-transparent shadow-lg hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_12px_36px_rgba(0,250,154,0.2)]"
      >
        {/* Background image */}
        {bgImage ? (
          <Image
            src={bgImage}
            alt={sector.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          /* Fallback gradient if no image */
          <div
            className="absolute inset-0 bg-gradient-to-br from-card to-card-secondary"
          />
        )}

        {/* ── Layer 1: gradient overlay (bottom-heavy dark) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(4,20,43,0.92) 0%, rgba(4,20,43,0.60) 55%, rgba(4,20,43,0.25) 100%)',
          }}
        />

        {/* ── Layer 2: flat uniform scrim — guarantees readability everywhere ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(4,20,43,0.20)' }}
        />

        {/* Hover colour tint (accent / neon emerald theme) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-15 transition-opacity duration-300"
          style={{ background: 'var(--accent)' }}
        />

        {/* Content — sits above all overlays */}
        <div className="relative z-10 p-4 w-full">

          {/* Icon — glassmorphic badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.20)',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {getSectorIcon(sector.slug, '#ffffff', 18)}
          </div>

          {/* Sector name — pure white, bold, always visible */}
          <h3
            className="font-heading font-black text-sm leading-snug mb-1 text-white"
            style={{
              textShadow: '0 1px 2px rgba(4,20,43,0.8), 0 2px 8px rgba(4,20,43,0.6)',
            }}
          >
            {sector.name}
          </h3>

          {/* Sub-sectors themed badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {subsectors.map((sub, i) => (
              <span key={i} className="text-[9px] font-bold tracking-wide text-[#00FA9A] bg-[#00FA9A]/10 border border-[#00FA9A]/15 px-1.5 py-0.5 rounded">
                {sub}
              </span>
            ))}
          </div>

          {/* Footer row — count + arrow */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span
              className="text-[11px] font-semibold text-white/90"
              style={{
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              }}
            >
              {sector.tech_count} {sector.tech_count === 1 ? 'technology' : 'technologies'}
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200 text-[#00FA9A]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
