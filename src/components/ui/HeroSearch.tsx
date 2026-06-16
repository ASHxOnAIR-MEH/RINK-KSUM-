'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/technologies?q=${encodeURIComponent(q)}` : '/technologies');
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      {/* Continuous ripple rings */}
      <span aria-hidden className="hero-ripple hero-ripple-1" />
      <span aria-hidden className="hero-ripple hero-ripple-2" />

      <div className="relative z-10 flex items-stretch bg-white border border-slate-200 rounded-md overflow-hidden focus-within:border-[#0A2164] transition-colors">
        <span className="flex items-center pl-4 text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies, sectors, or institutions..."
          aria-label="Search technologies, sectors, or institutions"
          className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="flex-shrink-0 px-5 sm:px-7 bg-[#0A2164] text-white text-sm font-bold font-sans hover:bg-[#081A52] transition-colors"
        >
          Search
        </button>
      </div>

      <style>{`
        .hero-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          border-radius: 8px;
          border: 1px solid rgba(245, 180, 0, 0.5);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          animation: hero-ripple-pulse 3s ease-out infinite;
        }
        .hero-ripple-2 { animation-delay: 1.5s; }
        @keyframes hero-ripple-pulse {
          0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(1.18); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ripple { animation: none; }
        }
      `}</style>
    </form>
  );
}
