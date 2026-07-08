'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Technology } from '@/types';
import TechnologyCard from './TechnologyCard';

interface Props {
  technologies: Technology[];
}

export default function FeaturedCarousel({ technologies }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef  = useRef<number | null>(null);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);
  // 0.055 px per ms ≈ ~40% slower than the previous 60s CSS animation for a 290px-wide card list
  const SPEED = 0.055;

  if (!technologies || technologies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#475569] text-sm font-sans">No featured technologies available.</p>
      </div>
    );
  }

  // Pad to at least 10 items so the marquee fills wide viewports
  let baseItems = technologies;
  if (technologies.length < 10) {
    while (baseItems.length < 10) {
      baseItems = [...baseItems, ...technologies];
    }
  }
  const doubleTechs = [...baseItems, ...baseItems];

  return (
    <FeaturedCarouselInner
      doubleTechs={doubleTechs}
      baseTechs={technologies}
      trackRef={trackRef}
      animRef={animRef}
      posRef={posRef}
      pausedRef={pausedRef}
      speed={SPEED}
    />
  );
}

/** Separate inner component so we can use hooks safely */
function FeaturedCarouselInner({
  doubleTechs,
  baseTechs,
  trackRef,
  animRef,
  posRef,
  pausedRef,
  speed,
}: {
  doubleTechs: Technology[];
  baseTechs: Technology[];
  trackRef: React.RefObject<HTMLDivElement | null>;
  animRef: React.MutableRefObject<number | null>;
  posRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
  speed: number;
}) {
  const lastTsRef = useRef<number | null>(null);

  const tick = useCallback((ts: number) => {
    if (!pausedRef.current && trackRef.current) {
      if (lastTsRef.current !== null) {
        const delta = ts - lastTsRef.current;
        posRef.current += speed * delta;

        // Loop: reset when we've scrolled exactly half the track (the duplicated half)
        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && posRef.current >= halfWidth) {
          posRef.current -= halfWidth;
        }
        trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }
      lastTsRef.current = ts;
    } else {
      lastTsRef.current = null;
    }
    animRef.current = requestAnimationFrame(tick);
  }, [pausedRef, trackRef, posRef, speed, animRef]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [tick, animRef]);

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div className="w-full relative select-none">

      {/* ── DESKTOP ONLY: rAF-driven marquee ── */}
      <div className="hidden md:block w-full relative overflow-hidden py-6">

        {/* Edge fade masks — match the section background (#0c1f45 or whatever page uses) */}
        <div
          className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(10,21,60,0.98) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-28 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(10,21,60,0.98) 0%, transparent 100%)',
          }}
        />

        {/* Marquee Track */}
        <div
          ref={trackRef}
          className="flex gap-6 w-max"
          style={{ willChange: 'transform' }}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {doubleTechs.map((tech, idx) => (
            <div
              key={`desktop-${tech.id}-${idx}`}
              className="featured-carousel-card"
              style={{ width: 290, flexShrink: 0 }}
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
              <TechnologyCard technology={tech} featured />
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE ONLY: Native momentum swipe ── */}
      <div className="block md:hidden w-full relative">
        <div
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-4 scrollbar-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {baseTechs.map((tech, idx) => (
            <div
              key={`mobile-${tech.id}-${idx}`}
              className="snap-start"
              style={{ width: 'calc(85vw - 12px)', flexShrink: 0 }}
            >
              <TechnologyCard technology={tech} featured />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
