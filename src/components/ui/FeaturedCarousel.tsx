'use client';

import { useEffect, useRef, useState } from 'react';
import { Technology } from '@/types';
import TechnologyCard from './TechnologyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  technologies: Technology[];
}

export default function FeaturedCarousel({ technologies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clone cards to achieve infinite loop (3 sets: before, middle, after)
  const tripleTechs = [...technologies, ...technologies, ...technologies];
  const totalItems = technologies.length;

  // Jump to the middle set on load or when scrolling past boundaries
  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalItems === 0) return;

    // Wait until items are rendered and measured
    const initScroll = () => {
      const card = container.children[0] as HTMLElement;
      if (!card) return;
      
      const cardWidth = card.offsetWidth;
      const gap = container.children[1] 
        ? ((container.children[1] as HTMLElement).offsetLeft - (card.offsetLeft + cardWidth))
        : 0;
      
      const step = cardWidth + gap;
      
      // Scroll exactly to the start of the middle set
      container.scrollLeft = step * totalItems;
    };

    // Delay slightly to ensure layout and rendering are complete
    const timer = setTimeout(initScroll, 100);
    return () => clearTimeout(timer);
  }, [totalItems]);

  // Handle scroll boundary jumps for seamless infinite looping
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || totalItems === 0) return;

    const { scrollLeft, scrollWidth } = container;
    const card = container.children[0] as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = container.children[1]
      ? ((container.children[1] as HTMLElement).offsetLeft - (card.offsetLeft + cardWidth))
      : 0;
    
    const step = cardWidth + gap;
    const singleSetWidth = step * totalItems;

    // If we scroll too far left (into the first set), jump to the middle set
    if (scrollLeft < singleSetWidth - container.clientWidth) {
      container.scrollLeft = scrollLeft + singleSetWidth;
    }
    // If we scroll too far right (into the third set), jump back to the middle set
    else if (scrollLeft >= 2 * singleSetWidth) {
      container.scrollLeft = scrollLeft - singleSetWidth;
    }
  };

  // Function to scroll to the next card
  const scrollNext = () => {
    const container = containerRef.current;
    if (!container || container.children.length === 0) return;

    const firstCard = container.children[0] as HTMLElement;
    const secondCard = container.children[1] as HTMLElement;
    const cardWidth = firstCard.offsetWidth;
    const gap = secondCard 
      ? (secondCard.offsetLeft - (firstCard.offsetLeft + cardWidth))
      : 0;
    
    const step = cardWidth + gap;
    
    container.scrollBy({ left: step, behavior: 'smooth' });
  };

  // Function to scroll to the previous card
  const scrollPrev = () => {
    const container = containerRef.current;
    if (!container || container.children.length === 0) return;

    const firstCard = container.children[0] as HTMLElement;
    const secondCard = container.children[1] as HTMLElement;
    const cardWidth = firstCard.offsetWidth;
    const gap = secondCard 
      ? (secondCard.offsetLeft - (firstCard.offsetLeft + cardWidth))
      : 0;
    
    const step = cardWidth + gap;
    
    container.scrollBy({ left: -step, behavior: 'smooth' });
  };

  // Manage auto-scroll interval and activity pause/resume
  useEffect(() => {
    if (totalItems === 0) return;

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollTimerRef.current = setInterval(() => {
        if (!isHovered && !isTouched) {
          scrollNext();
        }
      }, 3500); // Scroll every 3.5s
    };

    const stopAutoScroll = () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    };

    if (!isHovered && !isTouched) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return stopAutoScroll;
  }, [isHovered, isTouched, totalItems]);

  // Handle user interaction pause and auto-resume after 5 seconds
  const handleInteraction = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    setIsTouched(true);
    
    resumeTimeoutRef.current = setTimeout(() => {
      setIsTouched(false);
    }, 5000); // Resume after 5 seconds of inactivity
  };

  return (
    <div 
      className="relative w-full group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTouched(false);
      }}
    >
      {/* ── Left Indicator Button (Hidden on Mobile) ── */}
      <button
        onClick={() => {
          handleInteraction();
          scrollPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-border bg-[#0B0820]/80 backdrop-blur-md flex items-center justify-center text-text-primary opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:text-accent hover:border-accent/40 shadow-xl cursor-pointer hidden md:flex"
        title="Scroll Left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* ── Carousel Scroll Track ── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleInteraction}
        onTouchMove={handleInteraction}
        className="w-full flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-4 scrollbar-none"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
          .carousel-card-item {
            width: calc(85vw - 8px);
          }
          @media (min-width: 640px) {
            .carousel-card-item {
              width: calc(48vw - 12px);
            }
          }
          @media (min-width: 1024px) {
            .carousel-card-item {
              width: calc(23.5vw - 18px);
            }
          }
          @media (min-width: 1280px) {
            .carousel-card-item {
              width: 284px;
            }
          }
        `}</style>
        {tripleTechs.map((tech, idx) => (
          <div
            key={`${tech.id}-${idx}`}
            className="flex-shrink-0 snap-start transition-all duration-300 carousel-card-item"
          >
            <TechnologyCard technology={tech} />
          </div>
        ))}
      </div>

      {/* ── Right Indicator Button (Hidden on Mobile) ── */}
      <button
        onClick={() => {
          handleInteraction();
          scrollNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-border bg-[#0B0820]/80 backdrop-blur-md flex items-center justify-center text-text-primary opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:text-accent hover:border-accent/40 shadow-xl cursor-pointer hidden md:flex"
        title="Scroll Right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
