'use client';

import React from 'react';

interface Asset {
  id: number;
  name: string;
  svg: React.ReactNode;
  left: string;
  top: string;
  duration: string;
  delay: string;
  color: string; // Tailored accent colors
}

export default function FloatingResearchAssets() {
  const assets: Asset[] = [
    {
      id: 1,
      name: 'Patent Document',
      left: '8%',
      top: '18%',
      duration: '28s',
      delay: '0s',
      color: 'text-[#00FA9A]', // Emerald Accent
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h8M8 14h5" />
          <circle cx="15" cy="15" r="2.5" fill="currentColor" fillOpacity="0.1" />
          <path d="M15 17.5l1 2.5-1-1-1 1z" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Research Paper',
      left: '85%',
      top: '22%',
      duration: '34s',
      delay: '-4s',
      color: 'text-[#F8FAF8]', // Off White
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h10M7 11h10M7 15h4" />
          <line x1="14" y1="15" x2="14" y2="17" />
          <line x1="17" y1="13" x2="17" y2="17" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Laboratory Flask',
      left: '18%',
      top: '68%',
      duration: '31s',
      delay: '-8s',
      color: 'text-[#E9C46A]', // Warm Gold
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <path d="M9 3h6M12 3v5M6 21h12L12 8z" />
          <path d="M8.5 16h7" strokeDasharray="2 2" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'AI Chip',
      left: '76%',
      top: '55%',
      duration: '38s',
      delay: '-12s',
      color: 'text-[#00FA9A]', // Emerald
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'Innovation Gear',
      left: '46%',
      top: '28%',
      duration: '26s',
      delay: '-2s',
      color: 'text-[#F8FAF8]', // Off White
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 16.5l2-2M16.5 7l2-2" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Licensing Certificate',
      left: '88%',
      top: '78%',
      duration: '39s',
      delay: '-18s',
      color: 'text-[#E9C46A]', // Warm Gold
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 10.5l2 2 4-4M7 15h10" />
        </svg>
      )
    },
    {
      id: 7,
      name: 'DNA Strand',
      left: '12%',
      top: '84%',
      duration: '35s',
      delay: '-10s',
      color: 'text-[#00FA9A]', // Emerald
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <path d="M4.5 10c3-3 6.5-3 9.5 0s6.5 3 9.5 0" />
          <path d="M4.5 14c3 3 6.5 3 9.5 0s6.5-3 9.5 0" />
          <line x1="6" y1="11" x2="6" y2="13" />
          <line x1="10" y1="10" x2="10" y2="14" />
          <line x1="14" y1="10" x2="14" y2="14" />
          <line x1="18" y1="11" x2="18" y2="13" />
        </svg>
      )
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className={`absolute animate-float-asset blur-[2px] transition-all ${asset.color}`}
          style={{
            left: asset.left,
            top: asset.top,
            opacity: 0.045, // 0.03 - 0.05 opacity
            animationDuration: asset.duration,
            animationDelay: asset.delay,
          }}
          title={asset.name}
        >
          {asset.svg}
        </div>
      ))}
    </div>
  );
}
