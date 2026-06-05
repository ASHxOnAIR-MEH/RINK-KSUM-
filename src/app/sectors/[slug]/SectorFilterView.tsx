'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { FlaskConical } from 'lucide-react';

interface Props {
  initialTechnologies: Technology[];
}

const TABS = [
  { label: 'All Institutions', value: 'all' },
  { label: 'KAU', value: 'kau' },
  { label: 'CPCRI', value: 'cpcri' },
  { label: 'CTCRI', value: 'ctcri' },
  { label: 'NIIST', value: 'niist' },
  { label: 'CWRDM', value: 'cwrdm' },
  { label: 'KSCSTE', value: 'kscste' },
];

const matchesInstitution = (tech: Technology, filter: string) => {
  if (filter === 'all') return true;
  const slug = tech.institution_slug.toLowerCase();
  
  if (filter === 'kau') return slug.includes('kau') || slug.includes('agricultural-university');
  if (filter === 'cpcri') return slug.includes('cpcri');
  if (filter === 'ctcri') return slug.includes('ctcri');
  if (filter === 'niist') return slug.includes('niist');
  if (filter === 'cwrdm') return slug.includes('cwrdm');
  if (filter === 'kscste') return slug.includes('kscste') || slug.includes('kfri') || slug.includes('jntbgri');
  
  return false;
};

export default function SectorFilterView({ initialTechnologies }: Props) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTechs = initialTechnologies.filter(tech => matchesInstitution(tech, activeTab));

  return (
    <div className="space-y-8">
      {/* Horizontally scrollable institution filter tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:flex-wrap gap-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent text-[#04142B] border-accent shadow-md shadow-accent/15'
                    : 'bg-card border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/20'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filteredTechs.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border">
          <FlaskConical className="w-12 h-12 text-text-secondary/50 mx-auto mb-4 animate-pulse" />
          <h3 className="font-heading font-bold text-heading text-lg mb-1">No Technologies Found</h3>
          <p className="text-text-secondary text-sm">
            We couldn't find any technologies from this institution in this sector.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredTechs.map(tech => (
            <TechnologyCard key={tech.id} technology={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
