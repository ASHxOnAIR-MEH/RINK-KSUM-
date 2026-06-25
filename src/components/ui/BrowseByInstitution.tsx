import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
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
                className="group flex items-center gap-[18px] bg-white border border-[rgba(15,23,42,0.08)] rounded-md p-4 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:border-[#1B4D9B]/25"
                id={`browse-inst-${inst.slug}`}
              >
                {/* Premium logo tile */}
                <div
                  className="flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 14,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(15,23,42,0.05)',
                  }}
                >
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={inst.name}
                      className="object-contain"
                      style={{ width: 64, height: 64, padding: 2 }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Building2 className="w-6 h-6 text-slate-300" />
                      <span className="text-[8px] font-semibold text-slate-400 text-center leading-tight">
                        Institution Logo<br />Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-[#0F172A] text-sm leading-snug line-clamp-2 group-hover:text-[#1B4D9B] transition-colors">
                    {inst.name}
                  </div>
                  <div className="text-xs font-bold text-[#1B4D9B] mt-1.5">
                    {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1B4D9B] group-hover:translate-x-1 transition-all duration-250 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
