'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Building2, Layers, Hash, X, Cpu } from 'lucide-react';
import type { SearchIndexItem } from '@/types';
import { precisionSearch, type ScoredItem } from '@/lib/searchEngine';

/* ─────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────── */
const PLACEHOLDERS = [
  'Search technologies, sectors, or institutions…',
  'Try "cancer screening" or "kidney diagnostics"…',
  'Search by Technology ID e.g. RINK-8DA73B…',
  'Explore food processing innovations…',
  'Find agri-tech or water purification technologies…',
];

/* ─────────────────────────────────────────────────────────────────
   Highlight helper
───────────────────────────────────────────────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  try {
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} style={{ background: 'transparent', color: '#60A5FA', fontWeight: 700 }}>
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

/* ─────────────────────────────────────────────────────────────────
   IP Status badge colour
───────────────────────────────────────────────────────────────── */
function ipColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('patent') && !s.includes('pending') && !s.includes('not')) return '#10B981';
  if (s.includes('filed') || s.includes('pending')) return '#F59E0B';
  if (s.includes('published')) return '#3B82F6';
  return 'rgba(255,255,255,0.30)';
}

/* ─────────────────────────────────────────────────────────────────
   Skeleton row
───────────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 border-b border-white/[0.05]">
      <div className="h-3.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '68%' }} />
      <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: '44%' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Suggestion card
───────────────────────────────────────────────────────────────── */
function SuggestionCard({
  item,
  query,
  isActive,
  onHover,
}: {
  item: ScoredItem;
  query: string;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <Link
      href={`/technologies/${item.id}`}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      className="flex flex-col gap-1.5 px-5 py-3.5 border-b border-white/[0.05] last:border-b-0 transition-colors duration-100"
      style={{ background: isActive ? 'rgba(37,99,235,0.14)' : 'transparent' }}
    >
      {/* Name */}
      <div className="font-semibold text-white text-sm leading-snug line-clamp-1">
        <Highlight text={item.name} query={query} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
          <Building2 style={{ width: 10, height: 10 }} />
          <Highlight text={item.institution} query={query} />
        </span>
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
          <Layers style={{ width: 10, height: 10 }} />
          <Highlight text={item.sector} query={query} />
        </span>
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Hash style={{ width: 10, height: 10 }} />
          {item.id}
        </span>
      </div>

      {/* Badges row — TRL and IP status only */}
      <div className="flex flex-wrap gap-1.5">
        {item.trl && item.trl !== 'TRL Not Available' && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            {item.trl}
          </span>
        )}
        {item.ip_status && item.ip_status !== 'Not Available' && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${ipColor(item.ip_status)}18`,
              color: ipColor(item.ip_status),
              border: `1px solid ${ipColor(item.ip_status)}30`,
            }}
          >
            {item.ip_status}
          </span>
        )}
        {item.technology_type && item.technology_type !== 'Not Specified' && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Cpu style={{ width: 9, height: 9 }} />
            {item.technology_type}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────── */
export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Index state
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);

  // Results
  const [suggestions, setSuggestions] = useState<ScoredItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  const [btnHovered, setBtnHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Load index once ── */
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchIndexItem[]) => setIndex(data))
      .catch(() => {})
      .finally(() => setIndexLoading(false));
  }, []);

  /* ── Rotate placeholder ── */
  useEffect(() => {
    if (focused || query) return;
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 4200);
    return () => clearInterval(id);
  }, [focused, query]);

  /* ── Live search with 200ms debounce ── */
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    setSearching(true);
    const results = await precisionSearch(q, index);
    setSuggestions(results);
    setShowDrop(true);
    setSearching(false);
  }, [index]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setShowDrop(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => runSearch(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  /* ── Click-outside to close ── */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDrop(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  /* ── Keyboard navigation ── */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDrop) {
      if (e.key === 'Enter' && query.trim()) {
        window.location.href = `/technologies?q=${encodeURIComponent(query.trim())}`;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        window.location.href = `/technologies/${suggestions[activeIdx].id}`;
      } else if (query.trim()) {
        window.location.href = `/technologies?q=${encodeURIComponent(query.trim())}`;
      }
    } else if (e.key === 'Escape') {
      setShowDrop(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  function clearSearch() {
    setQuery('');
    setSuggestions([]);
    setShowDrop(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  const dropVisible = showDrop && focused && query.trim().length > 0;
  const noResults = !searching && !indexLoading && suggestions.length === 0 && query.trim().length >= 2;
  const isLoading = searching || (indexLoading && query.trim().length > 0);

  return (
    <>
      <style>{`
        @keyframes hero-breathe-glow {
          0%,100% { opacity:.12; transform:scale(1);    box-shadow:0 0 18px 4px rgba(37,99,235,.28); }
          50%      { opacity:.24; transform:scale(1.02); box-shadow:0 0 28px 8px rgba(37,99,235,.36); }
        }
        .hero-glow-ring {
          position:absolute; inset:-5px; border-radius:34px;
          pointer-events:none; z-index:0;
          animation:hero-breathe-glow 8s ease-in-out infinite;
          border:1px solid rgba(37,99,235,.28);
        }
        .hero-glow-ring.focused {
          animation:none; opacity:1;
          box-shadow:0 0 0 4px rgba(37,99,235,.18);
          border-color:#2563EB;
        }
        @keyframes drop-in {
          from{opacity:0;transform:translateY(-6px) scale(.99);}
          to  {opacity:1;transform:translateY(0)   scale(1);}
        }
        .hero-drop-in { animation:drop-in 160ms ease-out both; }
        .hero-search-bar:hover:not(:focus-within){
          transform:translateY(-2px);
          box-shadow:0 22px 55px rgba(0,0,0,.36) !important;
        }
        input.hero-input{ caret-color:#F4B400; color:#fff; font-weight:500; }
        input.hero-input::placeholder{ color:rgba(255,255,255,.72); font-weight:500; letter-spacing:.2px; transition:opacity 300ms; }
        input.hero-input:focus::placeholder{ opacity:.28; }
        .search-icon-idle   { color:rgba(255,255,255,.65); transition:color 250ms,transform 250ms; }
        .search-icon-focused{ color:#2563EB; transform:rotate(8deg); transition:color 250ms,transform 250ms; }
        @keyframes btn-icon-pulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .hero-btn {
          cursor: pointer;
          transition: transform 250ms ease, filter 250ms ease, box-shadow 250ms ease;
        }
        .hero-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(212,160,23,.35) !important;
        }
        .hero-btn:active {
          transform: translateY(1px);
          transition-duration: 150ms;
        }
        .hero-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(37,99,235,.18) !important;
        }
        .hero-btn:disabled { cursor: not-allowed; }
        .btn-icon-pulse {
          animation: btn-icon-pulse 300ms ease both;
        }
      `}</style>

      <div ref={containerRef} className="w-full flex flex-col items-center" style={{ position: 'relative' }}>
        <div className="w-full max-w-[920px]" style={{ position: 'relative' }}>

          {/* Breathing glow ring */}
          <div className={`hero-glow-ring ${focused ? 'focused' : ''}`} aria-hidden />

          {/* ── Search bar ── */}
          <div
            className="hero-search-bar relative flex items-center w-full transition-all duration-300 ease-out"
            style={{
              height: 72,
              borderRadius: 28,
              background: 'rgba(12,22,45,0.84)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: focused ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.11)',
              boxShadow: focused
                ? '0 15px 45px rgba(0,0,0,.30), 0 0 0 4px rgba(37,99,235,.15)'
                : '0 15px 45px rgba(0,0,0,.28)',
              zIndex: 10,
              overflow: 'hidden',
            }}
          >
            <span className="pl-5 md:pl-6 flex-shrink-0">
              <Search
                className={focused ? 'search-icon-focused' : 'search-icon-idle'}
                style={{ width: 22, height: 22 }}
              />
            </span>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
              onFocus={() => {
                setFocused(true);
                if (query.trim() && suggestions.length > 0) setShowDrop(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search technologies"
              aria-autocomplete="list"
              aria-expanded={dropVisible}
              className="hero-input w-full h-full py-4 px-4 bg-transparent text-base md:text-lg focus:outline-none font-sans min-w-0"
            />

            {query && (
              <button type="button" onClick={clearSearch} aria-label="Clear"
                className="flex-shrink-0 p-2.5 mr-1 rounded-full transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,.45)' }}>
                <X style={{ width: 15, height: 15 }} />
              </button>
            )}

            <button
              type="button"
              onClick={() => { if (query.trim()) window.location.href = `/technologies?q=${encodeURIComponent(query.trim())}`; }}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              disabled={!query.trim()}
              aria-label="Search technologies"
              className="hero-btn flex-shrink-0 h-full disabled:opacity-50 flex items-center gap-[10px]"
              style={{
                background: 'linear-gradient(180deg,#F5C242 0%,#E8B320 45%,#D49A00 100%)',
                color: '#0F172A',
                borderLeft: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0 28px 28px 0',
                minWidth: 120,
                paddingLeft: 24,
                paddingRight: 28,
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: '0.3px',
                boxShadow: '0 12px 30px rgba(212,160,23,.28)',
              }}
            >
              <Search
                className={btnHovered ? 'btn-icon-pulse' : ''}
                style={{
                  width: 20,
                  height: 20,
                  color: focused ? '#1D4ED8' : '#0F172A',
                  transition: 'color 250ms ease',
                  flexShrink: 0,
                }}
                aria-hidden
              />
              Search
            </button>
          </div>

          {/* ── Dropdown ── */}
          {dropVisible && (
            <div
              role="listbox"
              className="hero-drop-in absolute left-0 right-0 mt-3 overflow-hidden"
              style={{
                borderRadius: 20,
                background: 'rgba(8,16,36,0.96)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 28px 64px rgba(0,0,0,.50)',
                zIndex: 50,
                maxHeight: 520,
                overflowY: 'auto',
              }}
            >
              {/* Loading skeletons */}
              {isLoading && [1,2,3].map(i => <SkeletonRow key={i} />)}

              {/* Results */}
              {!isLoading && suggestions.map((item, idx) => (
                <SuggestionCard
                  key={item.id}
                  item={item}
                  query={query}
                  isActive={idx === activeIdx}
                  onHover={() => setActiveIdx(idx)}
                />
              ))}

              {/* Empty state */}
              {noResults && (
                <div className="flex flex-col items-center gap-3 py-8 px-5 text-center">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.50)' }}>
                    No matching technologies found for <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>.
                  </p>
                  <Link href="/technologies"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75"
                    style={{ color: '#2563EB' }}>
                    Browse All Technologies <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              )}

              {/* Footer */}
              {suggestions.length > 0 && !isLoading && (
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,.30)' }}>
                    {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} &nbsp;·&nbsp; ↑↓ navigate &nbsp;·&nbsp; ↵ open
                  </span>
                  <Link
                    href={`/technologies?q=${encodeURIComponent(query.trim())}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-75"
                    style={{ color: '#F5B400' }}>
                    See all results <ArrowRight style={{ width: 11, height: 11 }} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
