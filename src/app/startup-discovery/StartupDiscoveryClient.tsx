'use client';

import { useState } from 'react';
import { Technology } from '@/types';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { Rocket, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Category {
  label: string;
  slug: string;
  icon: string;
  description: string;
}

interface Props {
  categories: Category[];
  techsByCategory: Record<string, Technology[]>;
  initialSlug?: string;
}

export default function StartupDiscoveryClient({ categories, techsByCategory, initialSlug }: Props) {
  const [selected, setSelected] = useState<string>(initialSlug || categories[0]?.slug || '');

  const currentCat = categories.find((c) => c.slug === selected);
  const currentTechs = techsByCategory[selected] ?? [];

  return (
    <div>
      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {categories.map((cat) => {
          const count = (techsByCategory[cat.slug] ?? []).length;
          return (
            <button
              key={cat.slug}
              onClick={() => setSelected(cat.slug)}
              className={clsx(
                'relative flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-200',
                selected === cat.slug
                  ? 'border-[#003F8A] bg-[#E8F0FE] shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#003F8A]/30 hover:shadow-sm'
              )}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className={clsx('font-heading font-bold text-sm', selected === cat.slug ? 'text-[#003F8A]' : 'text-gray-900')}>
                {cat.label}
              </div>
              <div className={clsx('text-xs mt-0.5', selected === cat.slug ? 'text-[#003F8A]/70' : 'text-gray-400')}>
                {count} {count === 1 ? 'technology' : 'technologies'}
              </div>
              {selected === cat.slug && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-[#003F8A] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected category info */}
      {currentCat && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#E8F0FE] to-white rounded-xl border border-blue-100 mb-6">
          <div className="text-3xl">{currentCat.icon}</div>
          <div>
            <h2 className="font-heading font-bold text-[#003F8A] text-lg">
              Building a Startup in {currentCat.label}
            </h2>
            <p className="text-sm text-gray-600">{currentCat.description}</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-sm text-[#003F8A] font-semibold">
            <Rocket className="w-4 h-4" />
            {currentTechs.length} options
          </div>
        </div>
      )}

      {/* Technologies */}
      {currentTechs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔬</div>
          <p className="text-gray-500">No technologies listed for this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentTechs.map((tech) => (
            <TechnologyCard key={tech.id} technology={tech} />
          ))}
        </div>
      )}

      {/* List view - startup journey */}
      {currentTechs.length > 0 && (
        <div className="mt-8 p-6 bg-[#F8FAFF] rounded-2xl border border-blue-100">
          <h3 className="font-heading font-bold text-gray-900 mb-4 text-sm">
            🚀 Startup ideas in {currentCat?.label}
          </h3>
          <div className="space-y-2">
            {currentTechs.map((tech) => (
              <a
                key={tech.id}
                href={`/technologies/${tech.id}`}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-[#003F8A]/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-[#003F8A] group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[#003F8A] transition-colors">{tech.name}</div>
                    <div className="text-xs text-gray-400">{tech.institution} · {tech.commercialization_status}</div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {'⭐'.repeat(tech.startup_potential)}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
