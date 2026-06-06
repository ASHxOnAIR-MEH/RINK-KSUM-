'use client';

import React from 'react';

interface FloatingElement {
  id: number;
  name: string;
  svg: React.ReactNode;
  left: string;
  top: string;
  duration: string;
  delay: string;
  color: string;
}

export default function InnovationAmbientLayer() {
  const elements: FloatingElement[] = [
    {
      id: 1,
      name: 'Patent Document',
      left: '4%',
      top: '12%',
      duration: '35s',
      delay: '0s',
      color: 'text-[#00FA9A]', // Emerald
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h8M8 14h5" />
          <circle cx="15" cy="15" r="2" fill="currentColor" fillOpacity="0.05" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Research Paper',
      left: '92%',
      top: '8%',
      duration: '42s',
      delay: '-5s',
      color: 'text-[#F8FAF8]', // Off White
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h10M7 11h10" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Laboratory Flask',
      left: '14%',
      top: '45%',
      duration: '38s',
      delay: '-10s',
      color: 'text-[#E9C46A]', // Gold
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M9 3h6M12 3v5M6 21h12L12 8z" />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'DNA Helix',
      left: '88%',
      top: '52%',
      duration: '45s',
      delay: '-15s',
      color: 'text-[#00FA9A]', // Emerald
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M4.5 10c3-3 6.5-3 9.5 0s6.5 3 9.5 0" />
          <path d="M4.5 14c3 3 6.5 3 9.5 0s6.5-3 9.5 0" />
          <line x1="10" y1="10.5" x2="10" y2="13.5" />
          <line x1="14" y1="10.5" x2="14" y2="13.5" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'AI Chip',
      left: '78%',
      top: '28%',
      duration: '33s',
      delay: '-2s',
      color: 'text-[#F8FAF8]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Circuit Trace',
      left: '28%',
      top: '80%',
      duration: '48s',
      delay: '-12s',
      color: 'text-[#00FA9A]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M2 12h5l3-6 4 12 3-6h5" />
          <circle cx="10" cy="6" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 7,
      name: 'Innovation Gear',
      left: '3%',
      top: '72%',
      duration: '29s',
      delay: '-8s',
      color: 'text-[#E9C46A]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      )
    },
    {
      id: 8,
      name: 'Licensing Certificate',
      left: '84%',
      top: '85%',
      duration: '52s',
      delay: '-22s',
      color: 'text-[#F8FAF8]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M8 12l2.5 2.5 5.5-5.5" />
        </svg>
      )
    },
    {
      id: 9,
      name: 'Technology Transfer Arrow',
      left: '52%',
      top: '70%',
      duration: '31s',
      delay: '-6s',
      color: 'text-[#00FA9A]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M17 3 L21 7 L17 11" />
          <path d="M3 7 H21" />
          <path d="M7 21 L3 17 L7 13" />
          <path d="M21 17 H3" />
        </svg>
      )
    },
    {
      id: 10,
      name: 'Patent Blueprint',
      left: '32%',
      top: '18%',
      duration: '40s',
      delay: '-18s',
      color: 'text-[#E9C46A]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      )
    },
    {
      id: 11,
      name: 'Knowledge Node',
      left: '64%',
      top: '85%',
      duration: '57s',
      delay: '-25s',
      color: 'text-[#00FA9A]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" />
        </svg>
      )
    },
    {
      id: 12,
      name: 'Ecosystem Connections',
      left: '42%',
      top: '8%',
      duration: '37s',
      delay: '-3s',
      color: 'text-[#F8FAF8]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M12 22 C 12 22, 19 12, 19 8 C 19 4.1, 15.9 1, 12 1 C 8.1 1, 5 4.1, 5 8 C 5 12, 12 22, 12 22 Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* Dynamic Keyframes for exact requested transform offsets */}
      <style>{`
        @keyframes float-ambient-asset {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) translateX(8px) rotate(2deg);
          }
        }
        .animate-float-ambient {
          animation: float-ambient-asset 30s ease-in-out infinite;
        }
      `}</style>

      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute animate-float-ambient blur-[1px] ${el.color}`}
          style={{
            left: el.left,
            top: el.top,
            opacity: 0.035, // 0.02 - 0.05 opacity
            animationDuration: el.duration,
            animationDelay: el.delay,
          }}
          title={el.name}
        >
          {el.svg}
        </div>
      ))}
    </div>
  );
}
