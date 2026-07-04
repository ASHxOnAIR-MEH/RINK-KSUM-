'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Building2, Layers, Tag, Hash, X } from 'lucide-react';
import type { SearchIndexItem } from '@/types';

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
interface SuggestionItem extends SearchIndexItem {
  _score: number;
}

/* ─────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────── */
const PLACEHOLDERS = [
  'Search technologies, sectors, or institutions…',
  'Looking for breast cancer screening technologies?',
  'Explore food processing innovations…',
  'Find startup-ready agri-tech research…',
  'Search water purification technologies…',
];

const MAX_SUGGESTIONS = 8;

/* ─────────────────────────────────────────────────────────────────
   Highlight helper — wraps matched text in <mark>
───────────────────────────────────────────────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ background: 'transparent', color: '#2563EB', fontWeight: 700 }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Skeleton row
───────────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 border-b border-white/[0.06]">
      <div className="h-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '65%' }} />
      <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: '45%' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Score a SearchIndexItem against a query
───────────────────────────────────────────────────────────────── */
function scoreItem(item: SearchIndexItem, q: string): number {
  const lower = q.toLowerCase().trim();
  if (!lower) return 0;
  let score = 0;
  const nameLower = item.name.toLowerCase();
  if (nameLower === lower) score += 100;
  else if (nameLower.startsWith(lower)) score += 60;
  else if (nameLower.includes(lower)) score += 40;
  if (item.id.toLowerCase().includes(lower)) score += 30;
  if (item.institution.toLowerCase().includes(lower)) score += 20;
  if (item.sector.toLowerCase().includes(lower)) score += 18;
  if (item.keywords.some(k => k.toLowerCase().includes(lower))) score += 12;
  if (item.applications.some(a => a.toLowerCase().includes(lower))) score += 8;
  if (item.problem_solved.toLowerCase().includes(lower)) score += 6;
  return score;
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

  // Suggestion state
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Load search index once ── */
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then((data: SearchIndexItem[]) => setIndex(data))
      .catch(() => {/* silent — suggestions won't appear */})
      .finally(() => setIndexLoading(false));
  }, []);

  /* ── Rotate placeholder ── */
  useEffect(() => {
    if (focused || query) return;
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 4000);
    return () => clearInterval(id);
  }, [focused, query]);

  /* ── Live search with 200ms debounce ── */
  const runSearch = useCallback((q: string) => {
    if (!q.trim() || index.length === 0) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    setSugLoading(true);
    const scored: SuggestionItem[] = index
      .map(item => ({ ...item, _score: scoreItem(item, q) }))
      .filter(item => item._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, MAX_SUGGESTIONS);
    setSuggestions(scored);
    setShowDrop(true);
    setSugLoading(false);
  }, [index]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    setSugLoading(true);
    debounceRef.current = setTimeout(() => runSearch(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  /* ── Click-outside to close ── */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setActiveIdx(-1);
  }

  function handleFocus() {
    setFocused(true);
    if (query.trim() && suggestions.length > 0) setShowDrop(true);
  }

  function clearSearch() {
    setQuery('');
    setSuggestions([]);
    setShowDrop(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  const dropVisible = showDrop && focused && query.trim().length > 0;
  const noResults = !sugLoading && !indexLoading && suggestions.length === 0 && query.trim().length >= 2;

  return (
    <>
      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes hero-breathe-glow {
          0%, 100% {
            opacity: 0.12;
            transform: scale(1);
            box-shadow: 0 0 18px 4px rgba(37,99,235,0.30);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.02);
            box-shadow: 0 0 28px 8px rgba(37,99,235,0.38);
          }
        }
        .hero-search-glow {
          position: absolute;
          inset: -4px;
          border-radius: 32px;
          pointer-events: none;
          z-index: 0;
          animation: hero-breathe-glow 8s ease-in-out infinite;
          border: 1px solid rgba(37,99,235,0.30);
        }
        .hero-search-glow.is-focused {
          animation: none;
          opacity: 1;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
          border-color: #2563EB;
        }
        @keyframes drop-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        .hero-drop-in {
          animation: drop-in 180ms ease-out both;
        }
        .hero-search-icon-focused {
          color: #2563EB !important;
          transform: rotate(8deg) !important;
          transition: color 250ms ease, transform 250ms ease;
        }
        .hero-search-icon-default {
          color: rgba(255,255,255,0.70);
          transition: color 250ms ease, transform 250ms ease;
        }
        .hero-search-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .hero-search-btn:active {
          transform: translateY(1px);
        }
        .hero-search-bar:hover:not(:focus-within) {
          transform: translateY(-2px);
          box-shadow: 0 20px 55px rgba(0,0,0,0.35) !important;
        }
        input[type="text"].hero-input {
          caret-color: #F4B400;
          color: white;
          font-weight: 500;
        }
        input[type="text"].hero-input::placeholder {
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          letter-spacing: 0.2px;
          transition: opacity 300ms ease;
        }
        input[type="text"].hero-input:focus::placeholder {
          opacity: 0.30;
        }
      `}</style>

      <div className="w-full flex flex-col items-center" style={{ position: 'relative' }}>
        {/* ── Search bar wrapper (for glow) ── */}
        <div className="w-full max-w-[920px]" style={{ position: 'relative' }}>

          {/* Breathing glow ring */}
          <div className={`hero-search-glow ${focused ? 'is-focused' : ''}`} aria-hidden />

          {/* Search bar */}
          <div
            className="hero-search-bar relative flex items-center w-full transition-all duration-300 ease-out"
            style={{
              height: 72,
              borderRadius: 28,
              background: 'rgba(12,22,45,0.82)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: focused ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.12)',
              boxShadow: focused
                ? '0 15px 45px rgba(0,0,0,0.28), 0 0 0 4px rgba(37,99,235,0.15)'
                : '0 15px 45px rgba(0,0,0,0.28)',
              zIndex: 10,
              overflow: 'hidden',
            }}
          >
            {/* Search icon */}
            <span className="pl-5 md:pl-6 flex-shrink-0">
              <Search
                className={focused ? 'hero-search-icon-focused' : 'hero-search-icon-default'}
                style={{ width: 22, height: 22 }}
              />
            </span>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search technologies"
              aria-autocomplete="list"
              aria-expanded={dropVisible}
              className="hero-input w-full h-full py-4 px-4 bg-transparent text-base md:text-lg focus:outline-none font-sans min-w-0"
            />

            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex-shrink-0 p-2.5 mr-1 rounded-full transition-all duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.50)' }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            )}

            {/* Search button */}
            <button
              type="button"
              onClick={() => {
                if (query.trim()) window.location.href = `/technologies?q=${encodeURIComponent(query.trim())}`;
              }}
              disabled={!query.trim()}
              className="hero-search-btn flex-shrink-0 h-full px-6 sm:px-10 disabled:opacity-50 font-bold text-sm md:text-base transition-all duration-200 flex items-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #F5B400 0%, #D4970A 100%)',
                color: '#0A1628',
                borderRadius: '0 26px 26px 0',
                minWidth: 100,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Search
            </button>
          </div>

          {/* ── Dropdown ── */}
          {dropVisible && (
            <div
              ref={dropRef}
              role="listbox"
              className="hero-drop-in absolute left-0 right-0 mt-3 overflow-hidden"
              style={{
                borderRadius: 20,
                background: 'rgba(10,20,42,0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
                zIndex: 50,
              }}
            >
              {/* Loading skeletons */}
              {(sugLoading || indexLoading) && (
                <div>
                  {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
                </div>
              )}

              {/* Suggestions */}
              {!sugLoading && !indexLoading && suggestions.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/technologies/${item.id}`}
                  role="option"
                  aria-selected={idx === activeIdx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className="flex flex-col gap-1 px-5 py-4 border-b border-white/[0.05] last:border-b-0 transition-all duration-150"
                  style={{
                    background: idx === activeIdx ? 'rgba(37,99,235,0.12)' : 'transparent',
                  }}
                >
                  {/* Tech name */}
                  <div className="font-semibold text-white text-sm leading-snug line-clamp-1">
                    <Highlight text={item.name} query={query} />
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <Building2 style={{ width: 11, height: 11 }} />
                      <Highlight text={item.institution} query={query} />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <Layers style={{ width: 11, height: 11 }} />
                      <Highlight text={item.sector} query={query} />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      <Hash style={{ width: 10, height: 10 }} />
                      {item.id}
                    </span>
                  </div>

                  {/* Keywords preview */}
                  {item.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {item.keywords.slice(0, 3).map((kw, ki) => (
                        <span
                          key={ki}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.50)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <Tag style={{ width: 9, height: 9 }} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}

              {/* Empty state */}
              {noResults && (
                <div className="flex flex-col items-center gap-3 py-8 px-5 text-center">
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    No matching technologies found.
                  </p>
                  <Link
                    href="/technologies"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#2563EB' }}
                  >
                    Browse All Technologies <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              )}

              {/* Footer: browse all */}
              {suggestions.length > 0 && (
                <div
                  className="flex items-center justify-between px-5 py-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} — ↑↓ to navigate, ↵ to open
                  </span>
                  <Link
                    href={`/technologies?q=${encodeURIComponent(query.trim())}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#F5B400' }}
                  >
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
