import { getPlatformStats } from '@/lib/db';
import { FlaskConical, Building2, Layers } from 'lucide-react';

export default async function StatsSection() {
  const stats = await getPlatformStats();

  const items = [
    {
      id: 'stat-technologies',
      icon: FlaskConical,
      label: 'Technologies',
      value: stats.technology_count,
      suffix: '+',
      desc: 'Commercializable research technologies',
    },
    {
      id: 'stat-institutions',
      icon: Building2,
      label: 'Institutions',
      value: stats.institution_count,
      suffix: '+',
      desc: 'Kerala research institutions',
    },
    {
      id: 'stat-sectors',
      icon: Layers,
      label: 'Sectors',
      value: stats.sector_count,
      suffix: '',
      desc: 'Technology domains covered',
    },
  ];

  return (
    <section className="py-10 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} id={item.id}>
                <div className="text-4xl md:text-5xl font-heading font-black text-accent-secondary mb-1 tabular-nums">
                  {item.value}{item.suffix}
                </div>
                <div className="font-semibold text-heading text-sm mb-0.5">
                  {item.label}
                </div>
                <div className="text-xs text-text-secondary leading-snug hidden sm:block">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
