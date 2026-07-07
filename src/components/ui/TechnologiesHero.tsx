'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { SearchIndexItem } from '@/types';
import { precisionSearch, type ScoredItem } from '@/lib/searchEngine';

const placeholders = [
  'Best Technologies in agritech for my startup...',
  'Describe your idea, challenge, product or opportunity...',
  'Find startup-ready research technologies...',
  'Search food processing technologies...',
  'Explore renewable energy innovations...',
];

function formatTechnologyName(name: string) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

interface TechnologiesHeroProps {
  stats?: {
    techs: number;
    sectors: number;
    institutions: number;
  };
}

export default function TechnologiesHero({
  stats: initialStats = { techs: 0, sectors: 0, institutions: 0 }
}: TechnologiesHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [stats, setStats] = useState({ techs: 0, domains: 0, institutions: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<ScoredItem[]>([]);
  
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load search index once
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchIndexItem[]) => setIndex(data))
      .catch(() => {});
  }, []);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats based on dynamic values
  useEffect(() => {
    if (!initialStats.techs) return;
    let start = 0;
    const duration = 1500;
    const steps = 60;
    const intervalTime = duration / steps;
    
    const counter = setInterval(() => {
      start += 1;
      const progress = start / steps;
      setStats({
        techs: Math.min(Math.floor(initialStats.techs * progress), initialStats.techs),
        domains: Math.min(Math.floor(initialStats.sectors * progress), initialStats.sectors),
        institutions: Math.min(Math.floor(initialStats.institutions * progress), initialStats.institutions),
      });
      
      if (start >= steps) clearInterval(counter);
    }, intervalTime);
    
    return () => clearInterval(counter);
  }, [initialStats]);

  // Precision Search hookup
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim() || index.length === 0) {
      setSuggestions([]);
      return;
    }
    const results = await precisionSearch(q, index);
    setSuggestions(results.slice(0, 5)); // Keep max 5 for dropdown
  }, [index]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(searchQuery), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, runSearch]);

  return (
    <div className="w-full bg-[#F6F8FC] px-2 py-4 sm:px-4 sm:py-6 md:px-8">
      {/* 
        Removed fixed height to allow natural fitting on mobile devices without vertical scroll 
      */}
      <div className="max-w-[1400px] mx-auto bg-[#011a38] rounded-[20px] md:rounded-[32px] overflow-hidden relative shadow-xl flex items-center justify-center min-h-fit">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg.png" 
            alt="Technologies Background" 
            fill 
            className="object-cover" 
            priority
          />
          {/* Solid 60% dark overlay for guaranteed text readability */}
          <div className="absolute inset-0 bg-[#071428]/60"></div>
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003b73]/40 via-transparent to-[#011a38]/80 mix-blend-multiply"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24 text-center relative z-10 flex flex-col justify-center min-h-[100dvh] sm:min-h-fit">
          {/* Main Content */}
          <div className="mb-8 md:mb-10 flex flex-col items-center">
            {/* Portal Tagline */}
            <p className="font-sans text-[9px] sm:text-[10px] md:text-sm uppercase tracking-[0.2em] text-slate-300 font-bold mb-3 md:mb-4">
              RESEARCH INNOVATION NETWORK KERALA • TECHNOLOGY TRANSFER PORTAL
            </p>
            {/* Main Title - Responsive fluid typography (Mobile: 28-34, Tablet: 42-48, Desktop: 56-64) */}
            <h1 className="font-serif text-[28px] sm:text-[34px] md:text-[42px] lg:text-[56px] xl:text-[64px] font-black text-white leading-tight tracking-tight">
              Discover Technologies from
              <span className="font-sans font-extrabold text-white block mt-1 sm:mt-2 md:mt-3 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] tracking-wide text-white/90">
                Kerala&apos;s Leading Research Institutions
              </span>
            </h1>
          </div>

          {/* Search Bar - Responsive width */}
          <div className="w-[95%] sm:w-[90%] md:w-full max-w-[720px] mx-auto mb-8 relative z-30">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] px-4 sm:px-6 py-3.5 sm:py-4 md:py-5 flex items-center gap-3 md:gap-4 transition-colors focus-within:bg-white/15 shadow-2xl relative">
              <div className="flex-1 relative h-6 md:h-7 flex items-center">
                {/* Animated Placeholder Text */}
                {!searchQuery && !isFocused && (
                  <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPlaceholder}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-white/60 font-sans text-[13px] sm:text-[14px] md:text-[16px] truncate w-full text-left absolute"
                      >
                        {placeholders[currentPlaceholder]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsFocused(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/technologies?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full h-full bg-transparent text-white font-sans text-[14px] sm:text-[15px] md:text-[17px] outline-none z-10 relative"
                />
              </div>
              <Link
                href={searchQuery.trim() ? `/technologies?q=${encodeURIComponent(searchQuery.trim())}` : '/technologies'}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0 z-10 relative flex items-center"
              >
                <Search className="w-5 h-5 md:w-[26px] md:h-[26px]" strokeWidth={2} />
              </Link>
            </div>
            
            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {searchQuery.trim() && isFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[110%] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left flex flex-col max-h-[350px] sm:max-h-[380px]"
                >
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    {suggestions.map((s, idx) => (
                      <Link 
                        key={idx}
                        href={`/technologies/${s.id}`}
                        className="block px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#eff9ff] transition-colors border-b border-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <p className="font-sans font-semibold text-gray-800 text-[14px] sm:text-[15px] line-clamp-2">
                          {formatTechnologyName(s.name)}
                        </p>
                        <p className="font-sans text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-1.5 line-clamp-2 md:line-clamp-3">
                           {s.description || s.problem_solved || 'No description available.'}
                        </p>
                        <p className="font-sans text-[11px] sm:text-xs text-[#1b60bb] mt-1 sm:mt-1.5 font-medium">
                          {s.institution} • {s.sector}
                        </p>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Sticky View All Button */}
                  <div className="bg-[#f8fbff] p-3 border-t border-blue-100 text-center flex-shrink-0 z-10 shadow-[0_-4px_10px_rgb(0,0,0,0.02)]">
                     <Link
                        href={`/technologies?q=${encodeURIComponent(searchQuery)}`}
                        className="text-[#1b60bb] font-sans font-semibold text-[13px] sm:text-sm hover:underline"
                        onMouseDown={(e) => e.preventDefault()}
                     >
                        View all results for "{searchQuery}"
                     </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Row Cards (Liquid Glass Effect) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-[95%] sm:max-w-[90%] md:max-w-3xl mx-auto mt-4 md:mt-6">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center min-h-[70px] sm:min-h-[85px]">
              <div className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1 leading-none">
                {stats.techs}+
              </div>
              <div className="font-sans text-[10px] sm:text-[11px] md:text-[12px] text-white/90 font-medium leading-tight">
                Technologies
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center min-h-[70px] sm:min-h-[85px]">
              <div className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1 leading-none">
                {stats.domains}+
              </div>
              <div className="font-sans text-[10px] sm:text-[11px] md:text-[12px] text-white/90 font-medium leading-tight">
                Sectors
              </div>
            </div>
            {/* Card 3 - spans 2 cols on mobile for balanced grid */}
            <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center min-h-[70px] sm:min-h-[85px]">
              <div className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1 leading-none">
                {stats.institutions}+
              </div>
              <div className="font-sans text-[10px] sm:text-[11px] md:text-[12px] text-white/90 font-medium leading-tight">
                Institutions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
