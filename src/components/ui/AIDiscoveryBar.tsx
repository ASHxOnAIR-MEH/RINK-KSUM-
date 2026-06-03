'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ExternalLink, Building2,
  Layers, FlaskConical, Loader2, RotateCcw
} from 'lucide-react';
import type { AISearchResponse, AISearchResult } from '@/lib/aiSearch';

// ── Quick prompt chips ────────────────────────────────────────
const QUICK_PROMPTS = [
  { icon: '🚜', label: 'Agriculture Startup',       query: 'agriculture startup technologies' },
  { icon: '🍽️', label: 'Food Processing',           query: 'food processing and food technology' },
  { icon: '💧', label: 'Water Technology',           query: 'water purification and treatment technologies' },
  { icon: '⚡', label: 'Renewable Energy',           query: 'renewable energy solar wind technologies' },
  { icon: '🌱', label: 'Climate Tech',               query: 'climate environment sustainability technologies' },
  { icon: '🏭', label: 'Manufacturing',              query: 'manufacturing industrial machinery technologies' },
];

// ── Startup potential badge ───────────────────────────────────
const POT: Record<string, { bg: string; text: string; dot: string }> = {
  'High':          { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  'Medium':        { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
  'Low':           { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  'Not Specified': { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
};

// ── Parse **bold** markdown ───────────────────────────────────
function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// Split comma-separated technology type string into individual tags
function parseTechTypes(raw: string): string[] {
  if (!raw || raw === 'Not Specified' || raw === 'NA' || raw === 'Information being updated') return [];
  return raw.split(',').map(t => t.trim()).filter(t => t.length > 0 && t !== 'Not Specified' && t !== 'NA');
}

// ── Single result card ────────────────────────────────────────
function ResultCard({ r }: { r: AISearchResult }) {
  const tech = r.technology;
  const pot = POT[tech.startup_potential] ?? POT['Not Specified'];
  const techTypes = parseTechTypes(tech.technology_type);

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
      style={{ boxShadow: '0 1px 6px rgba(0,63,138,0.06)' }}
    >
      {/* Name */}
      <h4 className="font-heading font-bold text-[#003F8A] text-[15px] leading-snug mb-3 group-hover:text-[#002D6B] transition-colors">
        {tech.name}
      </h4>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <Building2 size={10} className="text-gray-400" /> {tech.institution}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <Layers size={10} className="text-gray-400" /> {tech.sector}
        </span>
        {/* Technology Type — each value as its own chip */}
        {techTypes.map((t, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <FlaskConical size={10} className="text-gray-400" /> {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: pot.bg, color: pot.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pot.dot }} />
          {tech.startup_potential} Potential
        </span>

        <Link
          href={`/technologies/${tech.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003F8A] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded-lg transition-colors"
          id={`ai-result-${tech.id}`}
        >
          View Technology <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}


// ── Main AI Discovery Bar ─────────────────────────────────────
export default function AIDiscoveryBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResponse | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
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

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setResult({
        results: [],
        query: trimmed,
        intent: 'error',
        responseMessage: 'Could not connect to the RINK database. Please try again.',
        totalFound: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setActiveQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">

      {/* ── Search box ── */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className="relative flex items-center rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: 'white',
            border: '2px solid',
            borderColor: loading ? '#003F8A' : result ? '#003F8A40' : '#e0e7ff',
            boxShadow: loading
              ? '0 0 0 4px rgba(0,63,138,0.12), 0 4px 24px rgba(0,63,138,0.15)'
              : '0 4px 24px rgba(0,63,138,0.10)',
          }}
        >
          {/* Search Icon */}
          <div className="pl-5 pr-3 flex-shrink-0">
            {loading
              ? <Loader2 size={20} className="text-[#003F8A] animate-spin" />
              : <Search size={20} className="text-gray-400" />
            }
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Describe your startup idea, industry, or challenge..."
            className="flex-1 py-4 pr-4 text-gray-800 text-[15px] bg-transparent outline-none placeholder-gray-400"
            style={{ fontFamily: 'inherit' }}
            disabled={loading}
            id="ai-discovery-input"
          />

          {/* Reset */}
          {(result || query) && !loading && (
            <button
              type="button"
              onClick={handleReset}
              className="mr-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              title="Clear search"
            >
              <RotateCcw size={15} />
            </button>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="flex-shrink-0 mr-2 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: query.trim() && !loading
                ? 'linear-gradient(135deg, #003F8A 0%, #0055AA 100%)'
                : '#e5e7eb',
              color: query.trim() && !loading ? 'white' : '#9ca3af',
              cursor: query.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
            id="ai-discover-btn"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Find Technologies</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </form>

      {/* ── Quick prompt chips ── */}
      {!result && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.label}
              onClick={() => { setQuery(p.query); search(p.query); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#003F8A] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,63,138,0.15)',
              }}
              id={`quick-prompt-${p.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="mt-8 space-y-4" ref={resultsRef}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="text-[#003F8A] animate-spin" />
              Searching for <span className="font-semibold text-gray-700">&quot;{activeQuery}&quot;</span>...
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-100 rounded-lg w-28" />
                <div className="h-6 bg-gray-100 rounded-lg w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-100 rounded-full w-32" />
                <div className="h-6 bg-blue-50 rounded-lg w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="mt-6" ref={resultsRef}>
          {/* Result header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Search size={14} className="text-[#003F8A]" />
              </div>
              <p className="text-sm text-gray-700 font-medium">
                <Bold text={result.responseMessage} />
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> New search
            </button>
          </div>

          {/* Cards grid */}
          {result.results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.results.map(r => (
                  <ResultCard key={r.technology.id} r={r} />
                ))}
              </div>

              {/* View all CTA */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/technologies?q=${encodeURIComponent(activeQuery)}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#003F8A] border border-[#003F8A]/20 bg-white hover:bg-[#EFF6FF] transition-colors"
                  id="ai-view-all-btn"
                >
                  <Search size={14} />
                  Browse All Results in Technology Explorer
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
