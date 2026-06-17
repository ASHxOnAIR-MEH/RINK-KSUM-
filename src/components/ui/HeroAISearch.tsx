'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, Building2, Layers, RotateCcw } from 'lucide-react';
import type { AISearchResponse, AISearchResult } from '@/lib/aiSearch';

// Render **bold** markdown segments
function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-white">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

function ResultCard({ r }: { r: AISearchResult }) {
  const tech = r.technology;
  return (
    <Link
      href={`/technologies/${tech.id}`}
      className="block bg-white/5 border border-white/10 backdrop-blur-sm rounded-md p-4 hover:border-[#F5B400]/40 hover:bg-white/[0.08] transition-all"
    >
      <div className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2">{tech.name}</div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-300">
        <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3 opacity-70" /> {tech.institution}</span>
        <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3 opacity-70" /> {tech.sector}</span>
      </div>
    </Link>
  );
}

export default function HeroAISearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResponse | null>(null);
  const [activeQuery, setActiveQuery] = useState('');

  async function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setResult(null);
    setActiveQuery(trimmed);
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data: AISearchResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        results: [],
        query: trimmed,
        intent: 'empty',
        responseMessage: 'Could not connect to the RINK database. Please try again.',
        totalFound: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function reset() {
    setResult(null);
    setQuery('');
    setActiveQuery('');
  }

  return (
    <div className="w-full max-w-3xl">
      <label
        htmlFor="hero-ai-input"
        className="block font-sans text-base md:text-lg font-medium mb-3"
        style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
      >
        Describe your idea, product, industry, challenge, or opportunity...
      </label>
      <form onSubmit={handleSubmit} className="relative">
        {/* Ripple rings */}
        <span aria-hidden className="hero-ripple hero-ripple-1" />
        <span aria-hidden className="hero-ripple hero-ripple-2" />

        <div className="relative z-10 flex items-center w-full bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden transition-all duration-300 focus-within:border-[#F5B400] focus-within:ring-2 focus-within:ring-[#F5B400]/50 focus-within:shadow-[0_0_34px_rgba(245,180,0,0.4)]">
          <span className="pl-4 flex-shrink-0 text-slate-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            id="hero-ai-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a keyword, idea, sector, or problem..."
            aria-label="Search technologies"
            className="w-full py-4 px-4 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans text-base md:text-lg min-w-0"
          />
          {(query || result) && !loading && (
            <button
              type="button"
              onClick={reset}
              title="Clear"
              className="flex-shrink-0 p-2 mr-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-[#F5B400] hover:bg-yellow-500 disabled:opacity-60 text-slate-900 px-6 sm:px-8 py-4 font-bold transition-colors flex-shrink-0 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>

        <style>{`
          .hero-ripple {
            position: absolute; top: 50%; left: 50%;
            width: 100%; height: 100%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            border: 1px solid rgba(245, 180, 0, 0.35);
            pointer-events: none; z-index: 0; opacity: 0;
            animation: hero-ripple-pulse 3s ease-out infinite;
          }
          .hero-ripple-2 { animation-delay: 1.5s; }
          @keyframes hero-ripple-pulse {
            0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.5; }
            100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) { .hero-ripple { animation: none; } }
        `}</style>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-[#F5B400]" />
          Searching for <span className="font-semibold text-white">&ldquo;{activeQuery}&rdquo;</span>…
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-5 animate-fade-in">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-md p-4 text-slate-200 text-sm leading-relaxed">
            <Bold text={result.responseMessage} />
          </div>

          {result.results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {result.results.map((r) => (
                  <ResultCard key={r.technology.id} r={r} />
                ))}
              </div>
              <Link
                href={`/technologies?q=${encodeURIComponent(activeQuery)}`}
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#F5B400] hover:underline"
              >
                Browse all results <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
