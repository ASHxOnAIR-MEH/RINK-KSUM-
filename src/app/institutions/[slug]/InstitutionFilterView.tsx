'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { FlaskConical } from 'lucide-react';

interface Props {
  initialTechnologies: Technology[];
}

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Food Technology', value: 'food technology' },
  { label: 'Biotechnology', value: 'biotechnology' },
  { label: 'Water', value: 'water' },
  { label: 'Climate', value: 'climate' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'AI & Software', value: 'ai' },
];

const matchesSector = (tech: Technology, filter: string) => {
  if (filter === 'all') return true;
  const slug = tech.sector_slug.toLowerCase();
  const name = tech.sector.toLowerCase();
  
  if (filter === 'agriculture') return slug.includes('agriculture') || name.includes('agri');
  if (filter === 'food technology') return slug.includes('food') || name.includes('food');
  if (filter === 'biotechnology') return slug.includes('biotech') || name.includes('biotech');
  if (filter === 'water') return slug.includes('water') || name.includes('water');
  if (filter === 'climate') return slug.includes('climate') || slug.includes('energy') || name.includes('climate') || name.includes('sustain');
  if (filter === 'manufacturing') return slug.includes('manufacturing') || slug.includes('industrial') || name.includes('manufact') || name.includes('industr');
  if (filter === 'ai') return slug.includes('digital') || slug.includes('ai') || slug.includes('software') || name.includes('ai') || name.includes('digital');
  
  return false;
};

export default function InstitutionFilterView({ initialTechnologies }: Props) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTechs = initialTechnologies.filter(tech => matchesSector(tech, activeTab));

  return (
    <div className="space-y-8">
      {/* Horizontally scrollable sector filter tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:flex-wrap gap-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-200 cursor-pointer ${
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
        <div className="text-center py-20 bg-card rounded-md border border-border">
          <FlaskConical className="w-12 h-12 text-text-secondary/50 mx-auto mb-4 animate-pulse" />
          <h3 className="font-heading font-bold text-heading text-lg mb-1">No Technologies Found</h3>
          <p className="text-text-secondary text-sm">
            We couldn't find any technologies matching the active sector filter.
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
