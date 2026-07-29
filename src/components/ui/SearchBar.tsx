'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Building2, Layers, Tag } from 'lucide-react';
import { getAutocompleteSuggestions } from '@/lib/search-engine';
import type { AutocompleteSuggestion } from '@/lib/search-engine';
import type { SearchIndexItem } from '@/types';

interface Props {
  size?: 'lg' | 'md';
  defaultValue?: string;
  autoFocus?: boolean;
}

/** Highlight matching text in a suggestion label */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const SOURCE_LABELS: Record<AutocompleteSuggestion['matchSource'], string> = {
  name: 'Technology',
  institution: 'Institution',
  sector: 'Sector',
};

const SOURCE_ICONS: Record<AutocompleteSuggestion['matchSource'], React.ReactNode> = {
  name: <Search className="w-3.5 h-3.5" />,
  institution: <Building2 className="w-3.5 h-3.5" />,
  sector: <Layers className="w-3.5 h-3.5" />,
};

export default function SearchBar({ size = 'md', defaultValue = '', autoFocus = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [allItems, setAllItems] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch search index once — cached by the browser
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then(data => setAllItems(data))
      .catch(() => {/* silent */});
  }, []);

  // Debounced autocomplete — uses fast startsWith/includes, NOT Fuse.js
  const doAutocomplete = useCallback((q: string) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const results = getAutocompleteSuggestions(allItems, q, 8);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIdx(-1);
  }, [allItems]);

  useEffect(() => {
    const timer = setTimeout(() => doAutocomplete(query), 180);
    return () => clearTimeout(timer);
  }, [query, doAutocomplete]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/technologies?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect(item: AutocompleteSuggestion) {
    setOpen(false);
    // If it matched on name → go directly to technology detail
    if (item.matchSource === 'name') {
      router.push(`/technologies/${item.id}`);
    } else if (item.matchSource === 'institution') {
      router.push(`/technologies?institution=${encodeURIComponent(item.id.split('-')[0])}&q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/technologies?q=${encodeURIComponent(query)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  const inputPadding = size === 'lg'
    ? 'py-4 px-5 pl-14 text-base'
    : 'py-3 px-4 pl-12 text-sm';
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const iconPos  = size === 'lg' ? 'left-4 top-4' : 'left-3.5 top-3.5';

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <Search
          className={`absolute ${iconPos} ${iconSize} text-gray-400 pointer-events-none z-10`}
          aria-hidden
        />
        <input
          ref={inputRef}
          id="rink-search-input"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder="Search technologies, keywords, or institutions..."
          autoFocus={autoFocus}
          className={`search-input ${inputPadding} pr-24`}
          autoComplete="off"
          aria-label="Search technologies"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
          aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm"
          aria-label="Submit search"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {open && suggestions.length > 0 && (
        <div
          id="search-suggestions-list"
          className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-card-secondary/50">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Suggestions
            </span>
            <span className="text-xs text-text-secondary">{suggestions.length} found</span>
          </div>

          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              id={`suggestion-${idx}`}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border last:border-0 ${
                idx === activeIdx
                  ? 'bg-accent-secondary/15 text-accent-secondary'
                  : 'hover:bg-card-secondary'
              }`}
              role="option"
              aria-selected={idx === activeIdx}
            >
              {/* Source icon */}
              <span className="mt-0.5 flex-shrink-0 text-text-secondary/50">
                {SOURCE_ICONS[item.matchSource]}
              </span>

              <div className="flex-1 min-w-0">
                {/* Technology name with highlight */}
                <div className="font-medium text-sm text-heading leading-snug">
                  <Highlight text={item.name} query={query} />
                </div>
                {/* Meta row */}
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <Building2 className="w-3 h-3" aria-hidden />
                    <Highlight
                      text={item.institution}
                      query={item.matchSource === 'institution' ? query : ''}
                    />
                  </span>
                  <span className="text-text-secondary/40">·</span>
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <Layers className="w-3 h-3" aria-hidden />
                    <Highlight
                      text={item.sector}
                      query={item.matchSource === 'sector' ? query : ''}
                    />
                  </span>
                  {/* Match source badge */}
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-text-secondary/50 bg-card-secondary px-1.5 py-0.5 rounded">
                    {SOURCE_LABELS[item.matchSource]}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-text-secondary/50 mt-1 flex-shrink-0" aria-hidden />
            </button>
          ))}

          {/* View all results footer */}
          <div className="px-4 py-2.5 bg-card-secondary border-t border-border">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`/technologies?q=${encodeURIComponent(query)}`);
              }}
              className="text-xs text-accent-secondary font-semibold hover:underline"
            >
              Search all technologies for &quot;{query}&quot; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
