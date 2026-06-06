'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function StatsSection() {
  const [techs, setTechs] = useState(0);
  const [insts, setInsts] = useState(0);
  const [opps, setOpps] = useState(0);
  const [patents, setPatents] = useState(0);
  const [ecosystem, setEcosystem] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(120, setTechs);
          animateCount(10, setInsts);
          animateCount(30, setOpps);
          animateCount(15, setPatents);
          animateCount(100, setEcosystem);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    let start = 0;
    const duration = 1400; // ms
    const increment = target / (duration / 16); // ~60fps
    
    const step = () => {
      start += increment;
      if (start >= target) {
        setter(target);
      } else {
        setter(Math.floor(start));
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  };

  return (
    <section ref={sectionRef} className="bg-card border-b border-border py-8 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x-0 md:divide-x divide-border">
          <div className="py-2 px-1">
            <div className="text-3xl md:text-4xl font-heading font-black text-accent">
              {techs}+
            </div>
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2">
              Technologies
            </div>
          </div>
          
          <div className="py-2 px-1">
            <div className="text-3xl md:text-4xl font-heading font-black text-[#E9C46A]">
              {insts}+
            </div>
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2">
              Research Institutions
            </div>
          </div>

          <div className="py-2 px-1">
            <div className="text-3xl md:text-4xl font-heading font-black text-accent">
              {opps}+
            </div>
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2">
              Commercialization Opportunities
            </div>
          </div>

          <div className="py-2 px-1">
            <div className="text-3xl md:text-4xl font-heading font-black text-[#E9C46A]">
              {patents}+
            </div>
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2">
              Patent-Ready Technologies
            </div>
          </div>

          <div className="py-2 px-1">
            <div className="text-3xl md:text-4xl font-heading font-black text-accent">
              {ecosystem}%
            </div>
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2">
              Kerala Research Ecosystem
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
