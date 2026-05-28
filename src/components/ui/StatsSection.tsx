'use client';

import { useEffect, useRef, useState } from 'react';
import { FlaskConical, Building2, LayoutGrid, Globe } from 'lucide-react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  { value: 150, suffix: '+', label: 'Technologies',   icon: FlaskConical, color: '#003F8A' },
  { value: 15,  suffix: '+', label: 'Institutions',   icon: Building2,    color: '#00875A' },
  { value: 10,  suffix: '+', label: 'Sectors',        icon: LayoutGrid,   color: '#7C3AED' },
  { value: 100, suffix: '%', label: 'Public Access',  icon: Globe,        color: '#EA580C' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="stats-number" style={{ color: stat.color }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
