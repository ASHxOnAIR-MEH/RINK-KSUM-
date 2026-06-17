'use client';

import { useEffect, useRef, useState } from 'react';

interface Metric {
  target: number;
  suffix: string;
  label: string;
}

const METRICS: Metric[] = [
  { target: 160, suffix: '+', label: 'Available Technologies' },
  { target: 11, suffix: '+', label: 'Technology Domains' },
  { target: 10, suffix: '+', label: 'Research Institutions' },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function MetricCard({ target, suffix, label, run, delay }: Metric & { run: boolean; delay: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const startAt = performance.now() + delay;
    const duration = 1200;
    const tick = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      setVal(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, delay]);

  return (
    <div
      className="hero-metric-card bg-white/5 border border-white/10 backdrop-blur-md rounded-md p-7 text-center transition-all duration-300 hover:border-[#F5B400]/40 hover:shadow-[0_0_30px_rgba(245,180,0,0.15)] hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-serif text-4xl md:text-5xl font-bold text-white leading-none">
        {val}
        <span className="text-[#F5B400]">{suffix}</span>
      </div>
      <div className="text-sm text-slate-300 font-sans mt-3 tracking-wide">{label}</div>
    </div>
  );
}

export default function HeroMetrics() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-gradient-to-b from-[#071428] to-[#0A1D37] py-16 md:py-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {METRICS.map((m, i) => (
          <MetricCard key={m.label} {...m} run={inView} delay={i * 150} />
        ))}
      </div>

      <style>{`
        @keyframes hero-metric-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-metric-card { animation: hero-metric-float 6s ease-in-out infinite; }
        .hero-metric-card:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .hero-metric-card { animation: none; }
        }
      `}</style>
    </section>
  );
}
