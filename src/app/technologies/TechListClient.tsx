'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Technology, TechnologyFilters, Sector, Institution } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
import SearchBar from '@/components/ui/SearchBar';
import { SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  initialTechs: Technology[];
  sectors: Sector[];
  institutions: Institution[];
}

export default function TechListClient({ initialTechs, sectors, institutions }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<TechnologyFilters>({
    query: searchParams.get('q') || undefined,
    sector: searchParams.get('sector') || undefined,
    institution: searchParams.get('institution') || undefined,
  });
  const [results, setResults] = useState<Technology[]>(initialTechs);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'potential' | 'alpha'>('default');

  const applyFilters = useCallback((f: TechnologyFilters, techs: Technology[]) => {
    let result = [...techs];
    if (f.query?.trim()) {
      const q = f.query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.problem_solved.toLowerCase().includes(q) ||
          t.institution.toLowerCase().includes(q) ||
          t.sector.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.applications.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (f.sector) result = result.filter((t) => t.sector_slug === f.sector);
    if (f.institution) result = result.filter((t) => t.institution_slug === f.institution);
    if (f.technology_type) result = result.filter((t) => t.technology_type === f.technology_type);
    if (f.commercialization_status) result = result.filter((t) => t.commercialization_status === f.commercialization_status);
    if (f.startup_potential_min) result = result.filter((t) => t.startup_potential >= f.startup_potential_min!);
    return result;
  }, []);

  useEffect(() => {
    let filtered = applyFilters(filters, initialTechs);
    if (sortBy === 'potential') filtered = [...filtered].sort((a, b) => b.startup_potential - a.startup_potential);
    if (sortBy === 'alpha') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    setResults(filtered);
  }, [filters, sortBy, initialTechs, applyFilters]);

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, query: q || undefined }));
  };

  const clearFilter = (key: keyof TechnologyFilters) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  };

  const activeChips = Object.entries(filters).filter(([k, v]) => k !== 'query' && v !== undefined);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-5">
        <SearchBar size="md" initialValue={filters.query ?? ''} onSearch={handleSearch} />
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map(([key, val]) => (
            <span key={key} className="inline-flex items-center gap-1.5 badge badge-blue text-xs">
              {String(val)}
              <button onClick={() => clearFilter(key as keyof TechnologyFilters)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setFilters({ query: filters.query })}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#003F8A] hover:text-[#003F8A] transition-all"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{results.length}</span> technologies found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'potential' | 'alpha')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#003F8A] bg-white text-gray-700 transition-all"
          >
            <option value="default">Sort: Default</option>
            <option value="potential">Sort: Startup Potential</option>
            <option value="alpha">Sort: A–Z</option>
          </select>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx('p-2 transition-colors', viewMode === 'grid' ? 'bg-[#003F8A] text-white' : 'bg-white text-gray-400 hover:text-gray-600')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx('p-2 transition-colors', viewMode === 'list' ? 'bg-[#003F8A] text-white' : 'bg-white text-gray-400 hover:text-gray-600')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main layout: sidebar + grid */}
      <div className="flex gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            sectors={sectors}
            institutions={institutions}
          />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">No technologies found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search or clearing some filters</p>
              <button onClick={() => setFilters({})} className="btn-primary text-sm">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((tech) => (
                <TechnologyCard key={tech.id} technology={tech} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((tech) => (
                <TechnologyCard key={tech.id} technology={tech} compact />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} sectors={sectors} institutions={institutions} />
          </div>
        </div>
      )}
    </div>
  );
}
