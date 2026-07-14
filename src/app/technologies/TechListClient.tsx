'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Technology, SearchResult, Sector, Institution } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import SearchBar from '@/components/ui/SearchBar';
import {
  Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal,
  LayoutGrid, List, Loader2
} from 'lucide-react';

interface InitialFilters {
  q: string;
  sector: string;
  institution: string;
  trl: string;
  patent: string;
  potential: string;
}

interface Props {
  initialResult: SearchResult;
  sectors: Sector[];
  institutions: Institution[];
  patentStatuses: string[];
  totalCount: number;
  initialFilters: InitialFilters;
}

function FilterSelect({
  label, value, onChange, options, id
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  id: string;
}) {
  return (
    <div className="filter-group">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary/20"
      >
        <option value="">All {label}s</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function TechListClient({
  initialResult, sectors, institutions,
  patentStatuses, totalCount, initialFilters
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState(initialFilters);

  function buildUrl(overrides: Partial<InitialFilters> & { page?: string }) {
    const merged = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.sector) params.set('sector', merged.sector);
    if (merged.institution) params.set('institution', merged.institution);
    if (merged.trl) params.set('trl', merged.trl);
    if (merged.patent) params.set('patent', merged.patent);
    if (merged.potential) params.set('potential', merged.potential);
    const p = (overrides as { page?: string }).page;
    if (p && p !== '1') params.set('page', p);
    return `${pathname}?${params.toString()}`;
  }

  function applyFilter(key: keyof InitialFilters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    startTransition(() => {
      router.push(buildUrl({ [key]: value, page: '1' }));
    });
  }

  function clearFilters() {
    const empty: InitialFilters = { q: '', sector: '', institution: '', trl: '', patent: '', potential: '' };
    setFilters(empty);
    startTransition(() => router.push(pathname));
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const { technologies, total, page, per_page } = initialResult;
  const totalPages = Math.ceil(total / per_page);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  // ── Scroll-to-search on navigation from homepage ───────────
  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if the user arrived with a query (i.e. from a homepage search)
    if (!initialFilters.q) return;

    // rAF ensures the browser has painted the full layout before we scroll
    const raf = requestAnimationFrame(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus the search input after the scroll settles
      const inputEl = document.getElementById('rink-search-input') as HTMLInputElement | null;
      if (inputEl) {
        setTimeout(() => inputEl.focus({ preventScroll: true }), 350);
      }
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  return (
    <div className="min-h-screen bg-background">

      {/* Header — anchor for scroll-to-search from homepage */}
      <div id="tech-search-section" ref={searchSectionRef} className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-heading">
                All Technologies
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {total} of {totalCount} technologies
                {filters.q && <span> matching &ldquo;<strong>{filters.q}</strong>&rdquo;</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  id="grid-view-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent-secondary text-white' : 'text-text-secondary/60 hover:bg-card-secondary'}`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  id="list-view-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-accent-secondary text-white' : 'text-text-secondary/60 hover:bg-card-secondary'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              {/* Filter toggle */}
              <button
                id="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-accent-secondary text-white border-accent-secondary'
                    : 'bg-card text-text-primary border-border hover:border-accent-secondary/30'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-card text-accent-secondary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  id="clear-filters-btn"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 max-w-2xl">
            <SearchBar defaultValue={filters.q} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className={`flex gap-6 ${showFilters ? 'flex-col md:flex-row' : ''}`}>

          {/* Filter Sidebar */}
          {showFilters && (
            <div className="md:w-64 flex-shrink-0">
              <div className="filter-sidebar sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Filter className="w-4 h-4" />
                    Filter By
                  </div>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-sector" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Sector
                  </label>
                  <select
                    id="filter-sector"
                    value={filters.sector}
                    onChange={e => applyFilter('sector', e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary/20"
                  >
                    <option value="">All Sectors</option>
                    {[...sectors].sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-institution" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Institution
                  </label>
                  <select
                    id="filter-institution"
                    value={filters.institution}
                    onChange={e => applyFilter('institution', e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary/20"
                  >
                    <option value="">All Institutions</option>
                    {[...institutions].sort((a, b) => a.name.localeCompare(b.name)).map(inst => (
                      <option key={inst.slug} value={inst.slug}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-trl" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    TRL
                  </label>
                  <select
                    id="filter-trl"
                    value={filters.trl}
                    onChange={e => applyFilter('trl', e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary/20"
                  >
                    <option value="">All TRL Levels</option>
                    <option value="TRL 1-3">TRL 1–3</option>
                    <option value="TRL 4-6">TRL 4–6</option>
                    <option value="TRL 7-9">TRL 7–9</option>
                    <option value="Not Specified">Not Specified</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-patent" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    IP Status
                  </label>
                  <select
                    id="filter-patent"
                    value={filters.patent}
                    onChange={e => applyFilter('patent', e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary/20"
                  >
                    <option value="">All IP Status</option>
                    {patentStatuses.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>


              </div>
            </div>
          )}

          {/* Grid / List */}
          <div className="flex-1 min-w-0">
            {isPending && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-accent-secondary animate-spin" />
              </div>
            )}

            {!isPending && technologies.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-card-secondary flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-7 h-7 text-text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-heading mb-2">No technologies found</h3>
                <p className="text-text-secondary text-sm mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}

            {!isPending && technologies.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
                    : 'flex flex-col gap-3'
                }>
                  {technologies.map((tech: Technology) => (
                    <TechnologyCard key={tech.id} technology={tech} compact={viewMode === 'list'} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      id="prev-page-btn"
                      disabled={page <= 1}
                      onClick={() => {
                        startTransition(() => router.push(buildUrl({ page: String(page - 1) })));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-secondary/30 hover:text-accent-secondary transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-text-secondary">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      id="next-page-btn"
                      disabled={page >= totalPages}
                      onClick={() => {
                        startTransition(() => router.push(buildUrl({ page: String(page + 1) })));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-secondary/30 hover:text-accent-secondary transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
