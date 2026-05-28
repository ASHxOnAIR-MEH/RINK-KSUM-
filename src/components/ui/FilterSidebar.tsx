'use client';

import { TechnologyFilters, TechnologyType, CommercializationStatus } from '@/types';
import { X, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  filters: TechnologyFilters;
  onChange: (filters: TechnologyFilters) => void;
  sectors: { slug: string; name: string }[];
  institutions: { slug: string; acronym: string }[];
}

const techTypes: TechnologyType[] = ['Process', 'Product', 'Device', 'Software', 'Material', 'Formulation', 'Method', 'System'];
const commStatuses: CommercializationStatus[] = ['Commercial Ready', 'Technology Transfer Available', 'Pilot Stage', 'Lab Stage'];
const potentialLevels = [
  { value: 5, label: '⭐⭐⭐⭐⭐ Exceptional' },
  { value: 4, label: '⭐⭐⭐⭐ High' },
  { value: 3, label: '⭐⭐⭐ Good' },
  { value: 1, label: 'Any' },
];

export default function FilterSidebar({ filters, onChange, sectors, institutions }: Props) {
  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && v !== 1 && v !== 0
  ).length;

  const update = (key: keyof TechnologyFilters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const clearAll = () => onChange({ query: filters.query });

  return (
    <div className="filter-sidebar sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#003F8A]" />
          <span className="font-heading font-bold text-gray-900 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[#003F8A] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Sector */}
      <div className="filter-group">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Sector
        </label>
        <select
          value={filters.sector ?? ''}
          onChange={(e) => update('sector', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#003F8A] focus:ring-2 focus:ring-blue-100 bg-white text-gray-700 transition-all"
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Institution */}
      <div className="filter-group">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Institution
        </label>
        <select
          value={filters.institution ?? ''}
          onChange={(e) => update('institution', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#003F8A] focus:ring-2 focus:ring-blue-100 bg-white text-gray-700 transition-all"
        >
          <option value="">All Institutions</option>
          {institutions.map((i) => (
            <option key={i.slug} value={i.slug}>{i.acronym}</option>
          ))}
        </select>
      </div>

      {/* Technology Type */}
      <div className="filter-group">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Technology Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {techTypes.map((type) => (
            <button
              key={type}
              onClick={() => update('technology_type', filters.technology_type === type ? undefined : type)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-full border font-medium transition-all',
                filters.technology_type === type
                  ? 'bg-[#003F8A] text-white border-[#003F8A]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#003F8A] hover:text-[#003F8A]'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Commercialization Status */}
      <div className="filter-group">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Commercialization Status
        </label>
        <div className="space-y-1.5">
          {commStatuses.map((status) => (
            <button
              key={status}
              onClick={() =>
                update('commercialization_status', filters.commercialization_status === status ? undefined : status)
              }
              className={clsx(
                'w-full text-left text-xs px-3 py-2 rounded-lg border transition-all',
                filters.commercialization_status === status
                  ? 'bg-[#003F8A] text-white border-[#003F8A]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#003F8A] hover:text-[#003F8A]'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Startup Potential */}
      <div className="filter-group">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Minimum Startup Potential
        </label>
        <div className="space-y-1.5">
          {potentialLevels.map((level) => (
            <button
              key={level.value}
              onClick={() =>
                update('startup_potential_min', filters.startup_potential_min === level.value ? undefined : level.value)
              }
              className={clsx(
                'w-full text-left text-xs px-3 py-2 rounded-lg border transition-all',
                filters.startup_potential_min === level.value
                  ? 'bg-[#003F8A] text-white border-[#003F8A]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#003F8A] hover:text-[#003F8A]'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
