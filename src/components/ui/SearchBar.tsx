'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

const PLACEHOLDER_EXAMPLES = [
  'chips manufacturing',
  'water purification',
  'agriculture technology',
  'coconut processing',
  'biochar production',
  'essential oils',
  'renewable energy',
  'biodegradable packaging',
  'super absorbent polymer',
];

interface Props {
  initialValue?: string;
  onSearch?: (query: string) => void;
  size?: 'lg' | 'md';
}

export default function SearchBar({ initialValue = '', onSearch, size = 'lg' }: Props) {
  const [query, setQuery] = useState(initialValue);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder text
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/technologies?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    if (onSearch) onSearch('');
  };

  const isLg = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      {/* Search icon */}
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${
          isFocused ? 'text-[#003F8A]' : ''
        } ${isLg ? 'w-5 h-5' : 'w-4 h-4'}`}
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Try "${PLACEHOLDER_EXAMPLES[placeholderIdx]}"...`}
        className={`w-full bg-white border-2 rounded-xl font-sans outline-none transition-all duration-200 ${
          isLg
            ? 'pl-12 pr-36 py-4 text-base'
            : 'pl-10 pr-28 py-3 text-sm'
        } ${
          isFocused
            ? 'border-[#003F8A] shadow-[0_0_0_4px_rgba(0,63,138,0.1)]'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        aria-label="Search technologies"
      />

      {/* Clear button */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-28 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
          aria-label="Clear search"
        >
          <X className={isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </button>
      )}

      {/* Search button */}
      <button
        type="submit"
        className={`absolute right-2 top-1/2 -translate-y-1/2 btn-primary ${
          isLg ? 'px-5 py-2.5 text-sm' : 'px-4 py-2 text-xs'
        }`}
      >
        Search
        <ArrowRight className={isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </button>
    </form>
  );
}
