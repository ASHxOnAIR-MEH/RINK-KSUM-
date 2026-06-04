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

export default function SectorCard({ sector }: Props) {
  const bgImage = SECTOR_IMAGES[sector.slug];

  return (
    <Link href={`/sectors/${sector.slug}`} id={`sector-card-${sector.slug}`} className="block group">
      <div
        className="relative overflow-hidden rounded-2xl h-44 flex flex-col justify-end cursor-pointer"
        style={{
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        }}
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
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${sector.color}cc, ${sector.color}44)` }}
          />
        )}

        {/* Dark overlay for text readability (60–70% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.20) 100%)',
          }}
        />

        {/* Hover colour tint (reveals sector colour on hover) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: sector.color }}
        />

        {/* Content — sits above overlay */}
        <div className="relative z-10 p-4">
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            {getSectorIcon(sector.slug, '#ffffff', 16)}
          </div>

          {/* Name */}
          <h3 className="font-heading font-bold text-white text-sm leading-snug mb-1.5"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
            {sector.name}
          </h3>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/75 font-medium">
              {sector.tech_count} {sector.tech_count === 1 ? 'technology' : 'technologies'}
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
