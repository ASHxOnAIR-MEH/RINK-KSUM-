import { getPlatformStats } from '@/lib/db';
import { FlaskConical, Building2, Layers, Zap } from 'lucide-react';

export default async function StatsSection() {
  const stats = await getPlatformStats();

  const items = [
    {
      id: 'stat-technologies',
      icon: FlaskConical,
      label: 'Technologies',
      value: stats.technology_count,
      suffix: '+',
      color: '#003F8A',
      bg: '#E8F0FE',
      desc: 'Commercializable research technologies',
    },
    {
      id: 'stat-institutions',
      icon: Building2,
      label: 'Institutions',
      value: stats.institution_count,
      suffix: '+',
      color: '#00875A',
      bg: '#E6F7F0',
      desc: 'Kerala research institutions',
    },
    {
      id: 'stat-sectors',
      icon: Layers,
      label: 'Sectors',
      value: stats.sector_count,
      suffix: '',
      color: '#7C3AED',
      bg: '#F3E8FF',
      desc: 'Technology domains covered',
    },
    {
      id: 'stat-high-potential',
      icon: Zap,
      label: 'High Potential',
      value: stats.high_potential_count,
      suffix: '+',
      color: '#D97706',
      bg: '#FEF3C7',
      desc: 'Ready for commercialization',
    },
  ];

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="text-center p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow animate-count-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: item.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="stats-number" style={{ color: item.color }}>
                  {item.value}{item.suffix}
                </div>
                <div className="font-heading font-semibold text-gray-700 text-sm mt-1">
                  {item.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 leading-tight">
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
