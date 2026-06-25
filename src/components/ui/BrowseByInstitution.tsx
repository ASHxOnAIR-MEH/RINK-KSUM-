import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Institution } from '@/types';

function getLogo(inst: Institution): string | null {
  return inst.logo_embed_url || inst.institution_image_embed_url || inst.institution_image || inst.image || null;
}

interface Props {
  institutions: Institution[];
}

export default function BrowseByInstitution({ institutions }: Props) {
  const sorted = [...institutions].sort((a, b) => b.tech_count - a.tech_count);

  return (
    <section id="institutions" className="relative scroll-mt-20 py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Browse by Institution</div>
          <h2 className="text-3xl font-heading font-bold text-[#0F172A]">Technologies From Kerala&apos;s Leading Research Institutions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((inst) => {
            const logo = getLogo(inst);
            return (
              <Link
                key={inst.slug}
                href={`/technologies?institution=${encodeURIComponent(inst.slug)}`}
                className="group flex items-center gap-4 bg-white border border-[rgba(15,23,42,0.08)] rounded-md p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#1B4D9B]/30"
                id={`browse-inst-${inst.slug}`}
              >
                <div className="w-14 h-14 rounded-md border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={inst.name}
                      className="w-full h-full object-contain p-1.5"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[8px] font-semibold text-slate-400 text-center px-1 leading-tight">
                      Logo will be updated
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-[#0F172A] text-sm leading-snug line-clamp-2 group-hover:text-[#1B4D9B] transition-colors">
                    {inst.name}
                  </div>
                  <div className="text-xs font-bold text-[#1B4D9B] mt-1.5">
                    {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1B4D9B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
