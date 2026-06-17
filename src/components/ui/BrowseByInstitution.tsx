import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Institution } from '@/types';

// Local logo map: slug (or partial) → local image path
const LOCAL_LOGOS: Record<string, string> = {
  'icar-cpcri': '/images/institutions/cpcri.jpg',
  'cpcri': '/images/institutions/cpcri.jpg',
  'icar-ctcri': '/images/institutions/ctcri.jpg',
  'ctcri': '/images/institutions/ctcri.jpg',
  'csir-niist': '/images/institutions/csir-niist.jpg',
  'niist': '/images/institutions/csir-niist.jpg',
  'cift': '/images/institutions/cift.jpg',
  'icar-cift': '/images/institutions/cift.jpg',
  'kufos': '/images/institutions/kufos-kochi.jpg',
  'kscste-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'iiser-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iiser': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iit-palakkad': '/images/institutions/iit-palakkad.jpg',
};

function getLogo(inst: Institution): string | null {
  const s = inst.slug.toLowerCase();
  if (LOCAL_LOGOS[s]) return LOCAL_LOGOS[s];
  for (const key of Object.keys(LOCAL_LOGOS)) {
    if (s.includes(key)) return LOCAL_LOGOS[key];
  }
  return inst.institution_image_embed_url || inst.institution_image || inst.image || null;
}

interface Props {
  institutions: Institution[];
}

export default function BrowseByInstitution({ institutions }: Props) {
  const sorted = [...institutions].sort((a, b) => b.tech_count - a.tech_count);

  return (
    <section className="relative py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">Browse by Institution</div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Browse by Institution</h2>
          <p className="text-gray-600 text-base font-sans">
            Explore technologies from Kerala&apos;s leading research institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((inst) => {
            const logo = getLogo(inst);
            return (
              <Link
                key={inst.slug}
                href={`/technologies?institution=${encodeURIComponent(inst.slug)}`}
                className="group flex items-center gap-4 bg-white border border-gray-200 rounded-md p-4 hover:border-[#0A2164]/40 hover:shadow-sm transition-all"
                id={`browse-inst-${inst.slug}`}
              >
                <div className="w-16 h-16 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={inst.name}
                      className="w-full h-full object-contain p-1.5"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[9px] font-semibold text-gray-400 text-center px-1 leading-tight">
                      Logo will be updated
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#0A2164] transition-colors">
                    {inst.name}
                  </div>
                  <div className="text-xs font-bold text-[#0A2164] mt-1.5">
                    {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A2164] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
