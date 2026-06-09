'use client';

import { Technology } from '@/types';
import TechnologyCard from './TechnologyCard';

interface Props {
  technologies: Technology[];
}

export default function FeaturedCarousel({ technologies }: Props) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  // Repeat technologies to ensure the marquee track is long enough to fill large desktop viewports
  let baseItems = technologies;
  if (technologies.length < 10) {
    while (baseItems.length < 10) {
      baseItems = [...baseItems, ...technologies];
    }
  }

  // Duplicate for the translate3d(-50%, 0, 0) infinite marquee trick
  const doubleTechs = [...baseItems, ...baseItems];

  return (
    <div className="w-full relative overflow-hidden py-4 select-none">
      <style>{`
        @keyframes marquee-infinite {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee-infinite {
          animation: marquee-infinite 35s linear infinite;
        }
        .marquee-card-item {
          width: 290px;
          flex-shrink: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-infinite {
            animation: none !important;
          }
        }
      `}</style>

      {/* Left/Right Edge Fades for premium live-marketplace presentation */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div 
        className="flex gap-6 w-max animate-marquee-infinite hover:[animation-play-state:paused] active:[animation-play-state:paused]"
        style={{
          willChange: 'transform',
        }}
      >
        {doubleTechs.map((tech, idx) => (
          <div key={`${tech.id}-${idx}`} className="marquee-card-item">
            <TechnologyCard technology={tech} />
          </div>
        ))}
      </div>
    </div>
  );
}
