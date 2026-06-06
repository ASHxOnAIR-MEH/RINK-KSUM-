'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ExternalLink, Building2,
  Layers, FlaskConical, Loader2, RotateCcw, Sparkles,
  SlidersHorizontal, ChevronDown, ChevronUp, Shield, Zap
} from 'lucide-react';
import type { AISearchResponse, AISearchResult, StartupOpportunity, AISearchFilters } from '@/lib/aiSearch';

// ── Search Index Item type ──────────────────────────────────────
interface SearchIndexItem {
  id: string;
  name: string;
  institution: string;
  sector: string;
  keywords: string[];
}

// ── Parse **bold** markdown ───────────────────────────────────
function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-accent font-extrabold">{p.slice(2, -2)}</strong>
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

// ── Result Card with Match Descriptors & Reasons ─────────────
function ResultCard({ r }: { r: AISearchResult }) {
  const tech = r.technology;
  const techTypes = parseTechTypes(tech.technology_type);

  // Match Level calculation
  let matchLabel = 'Potential Match';
  let matchColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (r.score >= 80) {
    matchLabel = 'Excellent Match';
    matchColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (r.score >= 60) {
    matchLabel = 'High Match';
    matchColor = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  } else if (r.score >= 40) {
    matchLabel = 'Relevant Match';
    matchColor = 'bg-[#E9C46A]/10 text-[#E9C46A] border-[#E9C46A]/20';
  }

  // Why This Matches reasons
  const reasons: string[] = [];
  if (r.matchedOn.includes('id')) reasons.push('Direct ID Lookup');
  if (r.matchedOn.includes('name')) reasons.push('Direct Tech Match');
  if (r.matchedOn.includes('sector')) reasons.push(tech.sector);
  if (r.matchedOn.includes('problem_solved')) reasons.push('Problem Alignment');
  if (r.matchedOn.includes('keywords')) reasons.push('Keyword Association');
  if (r.matchedOn.includes('institution')) {
    const acronym = tech.institution.split(' ')[0] || tech.institution;
    reasons.push(`Developed by ${acronym}`);
  }

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border p-5 hover:border-accent/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      <div>
        {/* Header: ID & Match Level */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
            ID: {tech.id}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${matchColor}`}>
            {matchLabel}
          </span>
        </div>

        {/* Name */}
        <h4 className="font-heading font-bold text-heading text-[15px] leading-snug mb-3 group-hover:text-accent transition-colors">
          {tech.name}
        </h4>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="flex items-center gap-1 text-[10.5px] text-text-secondary bg-card-secondary px-2.5 py-0.5 rounded border border-border">
            <Building2 size={11} className="text-text-secondary/70" /> {tech.institution}
          </span>
          <span className="flex items-center gap-1 text-[10.5px] text-text-secondary bg-card-secondary px-2.5 py-0.5 rounded border border-border">
            <Layers size={11} className="text-text-secondary/70" /> {tech.sector}
          </span>
        </div>

        {/* Why This Matches */}
        {reasons.length > 0 && (
          <div className="mb-4 pt-3 border-t border-border/50">
            <div className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider mb-2">
              Why this matches:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {reasons.map((reason, idx) => (
                <span key={idx} className="inline-flex items-center text-[9px] font-extrabold text-[#00FA9A] bg-[#00FA9A]/5 px-2 py-0.5 rounded border border-[#00FA9A]/10">
                  ✓ {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border mt-auto flex items-center justify-end">
        <Link
          href={`/technologies/${tech.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/5 hover:bg-accent/15 px-3.5 py-2 rounded-lg border border-accent/10 transition-colors"
          id={`ai-result-${tech.id}`}
        >
          View Technology <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}

// ── Startup Opportunity Card (Startup Mode Grouped Result) ─────
function StartupOpportunityCard({ op }: { op: StartupOpportunity }) {
  const core = op.coreTechnology;
  const score = op.relevanceScore;
  
  let matchLabel = 'Potential Match';
  let matchColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (score >= 80) {
    matchLabel = 'Excellent Match';
    matchColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 60) {
    matchLabel = 'High Match';
    matchColor = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  } else if (score >= 40) {
    matchLabel = 'Relevant Match';
    matchColor = 'bg-[#E9C46A]/10 text-[#E9C46A] border-[#E9C46A]/20';
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2.5 py-1 rounded-md border border-accent/10">
            🚀 Startup Opportunity
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${matchColor}`}>
            {matchLabel}
          </span>
        </div>
        
        <h4 className="font-heading font-extrabold text-[16px] text-heading leading-snug mb-3.5">
          {op.title}
        </h4>
        
        {/* Core Enabler Tech */}
        <div className="bg-card-secondary/50 rounded-xl p-3.5 border border-border mb-4">
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-text-secondary mb-1">Core Enabler Tech</div>
          <Link href={`/technologies/${core.id}`} className="text-xs font-bold text-accent-secondary hover:text-accent flex items-center gap-1 transition-colors">
            {core.name}
          </Link>
          <div className="text-[10px] text-text-secondary mt-1.5">{core.institution} · {core.sector}</div>
        </div>

        {/* Supporting Techs */}
        {op.supportingTechnologies.length > 0 && (
          <div className="mb-4">
            <div className="text-[9.5px] font-bold uppercase tracking-wider text-text-secondary mb-2">Supporting Technologies</div>
            <div className="space-y-2">
              {op.supportingTechnologies.map(tech => (
                <div key={tech.id} className="flex items-center gap-2 pl-2 border-l border-accent/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                  <Link href={`/technologies/${tech.id}`} className="text-xs text-text-primary hover:text-accent transition-colors line-clamp-1">
                    {tech.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3.5 border-t border-border mt-auto flex items-center justify-end">
        <Link href={`/technologies/${core.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:opacity-85 transition-opacity">
          Explore Startup Opportunity <ArrowRight className="w-3.5 h-3.5" />
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
  const [mode, setMode] = useState<'technology' | 'startup'>('technology');
  
  // Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<AISearchFilters>({
    institution: '',
    sector: '',
    patented_only: false,
    trl_min: 0,
    featured_only: false,
    recently_added: false,
    commercialization_ready: false,
  });

  // Autocomplete / Suggestions state
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch search index for suggestions
  useEffect(() => {
    fetch('/api/search-index')
      .then(res => res.json())
      .then((data: SearchIndexItem[]) => setSearchIndex(data))
      .catch(() => {});
  }, []);

  // Filter autocomplete suggestions
  useEffect(() => {
    const qLower = query.toLowerCase().trim();
    if (!qLower || searchIndex.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = new Set<string>();
    for (const item of searchIndex) {
      if (item.name.toLowerCase().includes(qLower)) {
        filtered.add(item.name);
      }
      for (const kw of item.keywords) {
        if (kw.toLowerCase().includes(qLower)) {
          filtered.add(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      }
      if (item.sector.toLowerCase().includes(qLower)) {
        filtered.add(item.sector);
      }
    }
    setSuggestions(Array.from(filtered).slice(0, 5));
  }, [query, searchIndex]);

  // Hide suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const search = useCallback(async (q: string, overrideMode?: 'technology' | 'startup') => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setResult(null);
    setActiveQuery(trimmed);
    setShowSuggestions(false);
    const searchMode = overrideMode || mode;

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          filters,
          mode: searchMode
        }),
      });
      const data: AISearchResponse = await res.json();
      setResult(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
  }, [loading, filters, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setActiveQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const selectTrending = (term: string) => {
    setQuery(term);
    search(term);
  };

  const selectSuggestion = (term: string) => {
    setQuery(term);
    search(term);
  };

  const toggleMode = (m: 'technology' | 'startup') => {
    setMode(m);
    if (activeQuery) {
      search(activeQuery, m);
    }
  };

  // Static options list based on portal database
  const uniqueSectors = [
    { slug: 'agriculture', name: 'Agriculture & Agritech' },
    { slug: 'food-technology', name: 'Food Technology' },
    { slug: 'biotechnology-life-sciences', name: 'Biotech & Life Sciences' },
    { slug: 'medtech-health-care', name: 'Medtech & Healthcare' },
    { slug: 'energy-climate-sustainability', name: 'Energy & Climate' },
    { slug: 'digital-technologies-ai-software', name: 'Digital & AI' },
    { slug: 'water-environment-waste-management', name: 'Water & Waste Management' },
    { slug: 'robotics-automation-drones', name: 'Robotics & Drones' },
  ];

  const uniqueInstitutions = [
    { slug: 'cpcri', name: 'ICAR-CPCRI' },
    { slug: 'ctcri', name: 'ICAR-CTCRI' },
    { slug: 'kufos', name: 'KUFOS' },
    { slug: 'kau', name: 'KAU' },
    { slug: 'niist', name: 'CSIR-NIIST' },
    { slug: 'cdac', name: 'C-DAC' },
    { slug: 'kscste', name: 'KSCSTE' },
    { slug: 'cwrdm', name: 'CWRDM' },
  ];

  return (
    <div className="w-full flex flex-col items-center">

      {/* ── MODE SWITCHER ── */}
      <div className="flex items-center bg-card-secondary p-1 rounded-xl border border-border mb-6 animate-fade-in">
        <button
          type="button"
          onClick={() => toggleMode('technology')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            mode === 'technology'
              ? 'bg-accent text-[#0A0820]'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Search size={13} />
          Search Technologies
        </button>
        <button
          type="button"
          onClick={() => toggleMode('startup')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            mode === 'startup'
              ? 'bg-accent text-[#0A0820]'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sparkles size={13} />
          Search Startup Opportunities
        </button>
      </div>

      {/* ── Search Form with Suggestions Dropdown ── */}
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="flex flex-col sm:flex-row items-stretch w-full gap-3 sm:gap-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 search-glow-container relative z-30">
          
          {/* Input block */}
          <div
            className={`flex-1 flex items-center bg-card border-2 rounded-2xl sm:rounded-r-none sm:border-r-0 px-4 py-3.5 transition-all duration-300 ${
              loading
                ? 'border-accent'
                : result
                ? 'border-accent/30'
                : 'border-border'
            }`}
          >
            <div className="mr-3 flex-shrink-0">
              {loading ? (
                <Loader2 size={20} className="text-accent animate-spin" />
              ) : (
                <Search size={20} className="text-text-secondary" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={
                mode === 'startup'
                  ? "Describe a business idea (e.g. 'coconut oil processing startup')..."
                  : "Search device, crop monitoring, packaging, patents, TRL levels..."
              }
              className="flex-1 w-full min-w-0 bg-transparent text-heading text-[15px] outline-none placeholder:text-text-secondary placeholder:text-[13px] md:placeholder:text-[14px] border-none p-0"
              style={{ fontFamily: 'inherit' }}
              disabled={loading}
              id="ai-discovery-input"
            />

            {(result || query) && !loading && (
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-secondary transition-colors flex-shrink-0"
                title="Clear search"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl sm:rounded-l-none font-semibold text-sm transition-all duration-200 border-2 border-transparent ${
              query.trim() && !loading
                ? 'bg-accent text-[#04142B] hover:opacity-90 cursor-pointer'
                : 'bg-card-secondary text-text-secondary/40 border-border cursor-not-allowed'
            }`}
            id="ai-discover-btn"
          >
            <Search size={15} />
            <span>{mode === 'startup' ? 'Build Startup' : 'Find Tech'}</span>
          </button>
        </div>

        {/* ── Suggestions Dropdown List ── */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-2xl z-40 overflow-hidden"
          >
            <div className="p-2 border-b border-border bg-card-secondary/20">
              <span className="text-[10px] font-black uppercase text-accent tracking-wider">Suggested Queries</span>
            </div>
            <div className="flex flex-col">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSuggestion(item)}
                  className="w-full text-left px-4 py-2.5 text-xs text-text-primary hover:bg-accent/5 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Search size={11} className="text-text-secondary" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* ── Trending & Filters Toggle Toolbar ── */}
      <div className="w-full mt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in z-20">
        {/* Trending searches */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
          <span className="font-semibold text-accent-secondary">🔥 Trending:</span>
          {['Coconut Processing', 'Crop Health', 'Biotech', 'Drones', 'Water Treatment'].map(term => (
            <button
              key={term}
              type="button"
              onClick={() => selectTrending(term)}
              className="text-text-secondary hover:text-accent hover:underline px-1 py-0.5 rounded transition-all"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Advanced Filters Expand trigger */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
            showAdvanced ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <SlidersHorizontal size={13} />
          Advanced Filters
          {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* ── Advanced Filters Panel (Collapsible Grid) ── */}
      {showAdvanced && (
        <div className="w-full mt-4 p-5 rounded-2xl bg-card border border-border animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-4 text-left z-20 shadow-md">
          {/* Institution Selector */}
          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Research Institution
            </label>
            <select
              value={filters.institution || ''}
              onChange={e => setFilters({ ...filters, institution: e.target.value })}
              className="w-full text-xs bg-card-secondary border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-accent"
            >
              <option value="">All Institutions</option>
              {uniqueInstitutions.map(inst => (
                <option key={inst.slug} value={inst.slug}>{inst.name}</option>
              ))}
            </select>
          </div>

          {/* Sector Selector */}
          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Sector / Industry
            </label>
            <select
              value={filters.sector || ''}
              onChange={e => setFilters({ ...filters, sector: e.target.value })}
              className="w-full text-xs bg-card-secondary border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-accent"
            >
              <option value="">All Sectors</option>
              {uniqueSectors.map(sec => (
                <option key={sec.slug} value={sec.slug}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* TRL Selector */}
          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Minimum TRL
            </label>
            <select
              value={filters.trl_min || 0}
              onChange={e => setFilters({ ...filters, trl_min: parseInt(e.target.value) })}
              className="w-full text-xs bg-card-secondary border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-accent"
            >
              <option value="0">All TRL levels</option>
              <option value="1">TRL 1 (Basic Principles)</option>
              <option value="3">TRL 3 (Proof of Concept)</option>
              <option value="5">TRL 5 (Lab Validation)</option>
              <option value="7">TRL 7 (Demonstration Prototype)</option>
              <option value="9">TRL 9 (Market Ready)</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/40 mt-1">
            {/* Patented Only */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.patented_only || false}
                onChange={e => setFilters({ ...filters, patented_only: e.target.checked })}
                className="w-3.5 h-3.5 accent-accent rounded"
              />
              <span className="text-[11px] text-text-primary font-medium">Patented IP Only</span>
            </label>

            {/* Featured Only */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.featured_only || false}
                onChange={e => setFilters({ ...filters, featured_only: e.target.checked })}
                className="w-3.5 h-3.5 accent-accent rounded"
              />
              <span className="text-[11px] text-text-primary font-medium">Featured Techs</span>
            </label>

            {/* Commercial Ready */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.commercialization_ready || false}
                onChange={e => setFilters({ ...filters, commercialization_ready: e.target.checked })}
                className="w-3.5 h-3.5 accent-accent rounded"
              />
              <span className="text-[11px] text-text-primary font-medium">Commercial Ready</span>
            </label>

            {/* Reset filters */}
            <button
              type="button"
              onClick={() => setFilters({
                institution: '',
                sector: '',
                patented_only: false,
                trl_min: 0,
                featured_only: false,
                recently_added: false,
                commercialization_ready: false,
              })}
              className="text-left text-[11px] text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="mt-8 space-y-4 w-full" ref={resultsRef}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 size={14} className="text-accent animate-spin" />
              Building startup discovery model for <span className="font-semibold text-text-primary">&quot;{activeQuery}&quot;</span>...
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse">
              <div className="h-4 bg-card-secondary rounded w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-card-secondary rounded-lg w-28" />
                <div className="h-6 bg-card-secondary rounded-lg w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-card-secondary rounded-full w-32" />
                <div className="h-6 bg-accent-secondary/10 rounded-lg w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results display ── */}
      {result && !loading && (
        <div className="mt-6 w-full relative" ref={resultsRef}>
          
          {/* Subtle patent layout backdrops inside results block at 2% opacity */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none z-0">
            <svg viewBox="0 0 800 300" className="w-full h-full text-accent" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="400" cy="150" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="150" x2="600" y2="150" stroke="currentColor" strokeWidth="0.8" />
              <rect x="370" y="120" width="60" height="60" rx="4" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                <Sparkles size={14} className="text-accent" />
              </div>
              <p className="text-sm text-text-primary font-medium">
                <Bold text={result.responseMessage} />
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> Clear results
            </button>
          </div>

          {/* Grouped Startup Opportunities (Startup Mode) */}
          {mode === 'startup' && result.startupOpportunities && result.startupOpportunities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 relative z-10">
              {result.startupOpportunities.map((op, idx) => (
                <StartupOpportunityCard key={idx} op={op} />
              ))}
            </div>
          )}

          {/* Direct Technologies matching (fallback or technology mode) */}
          {result.results.length > 0 && (
            <div className="relative z-10">
              {mode === 'startup' && result.startupOpportunities && result.startupOpportunities.length > 0 && (
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3.5 mt-6">
                  Supporting Matches in Catalog
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.results.map(r => (
                  <ResultCard key={r.technology.id} r={r} />
                ))}
              </div>

              {/* View all CTA */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/technologies?q=${encodeURIComponent(activeQuery)}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-accent-secondary border border-accent-secondary/20 bg-card hover:bg-card-secondary transition-colors"
                  id="ai-view-all-btn"
                >
                  <Search size={14} />
                  Browse All Results in Portal
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* No results experience with helper sector links */}
          {result.results.length === 0 && (
            <div className="mt-8 text-center max-w-xl mx-auto p-6 bg-card rounded-2xl border border-border relative z-10">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                <Search size={22} />
              </div>
              <h4 className="font-heading font-bold text-heading text-[16px] mb-2">We couldn't find an exact match</h4>
              <p className="text-text-secondary text-sm mb-5">
                Try broad terms or click one of the sectors below to explore related deep-tech options.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left">
                <Link href="/sectors/agriculture" className="p-3 bg-card-secondary hover:bg-accent/5 rounded-xl border border-border flex items-center gap-2 transition-all group">
                  <span className="text-base group-hover:scale-110 transition-transform">🌾</span>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">Agriculture</span>
                </Link>
                <Link href="/sectors/digital-technologies-ai-software" className="p-3 bg-card-secondary hover:bg-accent/5 rounded-xl border border-border flex items-center gap-2 transition-all group">
                  <span className="text-base group-hover:scale-110 transition-transform">💻</span>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">Digital Tech</span>
                </Link>
                <Link href="/sectors/water-environment-waste-management" className="p-3 bg-card-secondary hover:bg-accent/5 rounded-xl border border-border flex items-center gap-2 transition-all group">
                  <span className="text-base group-hover:scale-110 transition-transform">💧</span>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">Water & Env</span>
                </Link>
                <Link href="/sectors/biotechnology-life-sciences" className="p-3 bg-card-secondary hover:bg-accent/5 rounded-xl border border-border flex items-center gap-2 transition-all group">
                  <span className="text-base group-hover:scale-110 transition-transform">🔬</span>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">Biotech</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
