'use client';

import { Technology } from '@/types';
import TechnologyCard from './TechnologyCard';

interface Props {
  technologies: Technology[];
}

export default function FeaturedCarousel({ technologies }: Props) {
  if (!technologies || technologies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#475569] text-sm font-sans">No featured technologies available.</p>
      </div>
    );
  }

  // Repeat technologies to ensure the marquee track is long enough to fill large desktop viewports
  let baseItems = technologies;
  if (technologies.length < 10) {
    while (baseItems.length < 10) {
      baseItems = [...baseItems, ...technologies];
    }
  }

  // Duplicate for the translate3d(-50%, 0, 0) infinite marquee trick on desktop
  const doubleTechs = [...baseItems, ...baseItems];

  return (
    <div className="w-full relative select-none">
      
      {/* ── DESKTOP ONLY: Slow Infinite CSS Marquee Ticker ── */}
      <div className="hidden md:block w-full relative overflow-hidden py-4">
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
            animation: marquee-infinite 60s linear infinite;
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

        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div 
          className="flex gap-6 w-max animate-marquee-infinite hover:[animation-play-state:paused]"
          style={{ willChange: 'transform' }}
        >
          {doubleTechs.map((tech, idx) => (
            <div key={`desktop-${tech.id}-${idx}`} className="marquee-card-item">
              <TechnologyCard technology={tech} />
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE ONLY: Native Horizontal momentum swipe container ── */}
      <div className="block md:hidden w-full relative">
        <style>{`
          .mobile-swipe-card {
            width: calc(85vw - 12px);
            flex-shrink: 0;
          }
        `}</style>
        <div
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-4 scrollbar-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {technologies.map((tech, idx) => (
            <div
              key={`mobile-${tech.id}-${idx}`}
              className="mobile-swipe-card snap-start"
            >
              <TechnologyCard technology={tech} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
