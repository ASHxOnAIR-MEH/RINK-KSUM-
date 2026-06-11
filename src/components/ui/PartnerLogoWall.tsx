'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Institution } from '@/types';

// ── Complete logo map (all 21 institutions) ──────────────────
const LOGO_MAP: Record<string, string> = {
  // CPCRI
  'icar-cpcri': '/images/institutions/cpcri.jpg',
  'icar-central-plantation-crops-research-institute': '/images/institutions/cpcri.jpg',
  // CTCRI
  'icar-ctcri': '/images/institutions/ctcri.jpg',
  'central-tuber-crops-research-institute': '/images/institutions/ctcri.jpg',
  // CSIR-NIIST
  'csir-niist': '/images/institutions/csir-niist.jpg',
  'national-institute-for-interdisciplinary-science-and-technology': '/images/institutions/csir-niist.jpg',
  // CIFT
  'cift': '/images/institutions/cift.jpg',
  'icar-cift': '/images/institutions/cift.jpg',
  'central-institute-of-fisheries-technology': '/images/institutions/cift.jpg',
  // KUFOS
  'kerala-university-of-fisheries-and-ocean-studies-kufos': '/images/institutions/kufos-kochi.jpg',
  'kerala-university-of-fisheries-and-ocean-studies': '/images/institutions/kufos-kochi.jpg',
  // JNTBGRI
  'kscste-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jawaharlal-nehru-tropical-botanic-garden-and-research-institute': '/images/institutions/kscste-jntbgri.jpg',
  // IISER
  'iiser-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'indian-institute-of-science-education-and-research-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  // IIT Palakkad
  'iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'indian-institute-of-technology-palakkad': '/images/institutions/iit-palakkad.jpg',
  // IAV
  'institute-of-advanced-virology': '/images/institutions/iav.jpg',
  'iav': '/images/institutions/iav.jpg',
  // CWRDM
  'cwrdm': '/images/institutions/cwrdm.jpg',
  'centre-for-water-resources-development-and-management': '/images/institutions/cwrdm.jpg',
  // KSCSTE
  'kscste': '/images/institutions/kscste.jpg',
  'kerala-state-council-for-science-technology-and-environment': '/images/institutions/kscste.jpg',
  // SCTIMST / TIMed
  'sctimst': '/images/institutions/sctimst.jpg',
  'sree-chitra-tirunal-institute-for-medical-sciences-and-technology': '/images/institutions/sctimst.jpg',
  'timed': '/images/institutions/sctimst.jpg',
  // STIC
  'stic': '/images/institutions/stic.jpg',
  'sophisticated-test-and-instrumentation-centre': '/images/institutions/stic.jpg',
  // BioNEST
  'bionest': '/images/institutions/bionest.jpg',
  // TrEST
  'trest': '/images/institutions/trest.jpg',
  // RGCB
  'rgcb': '/images/institutions/rgcb.jpg',
  'rajiv-gandhi-centre-for-biotechnology': '/images/institutions/rgcb.jpg',
  // ICCS
  'iccs': '/images/institutions/iccs.jpg',
  'institute-for-climate-change-studies': '/images/institutions/iccs.jpg',
  // MBGIPS
  'mbgips': '/images/institutions/mbgips.jpg',
  'malabar-botanical-garden-and-institute-for-plant-sciences': '/images/institutions/mbgips.jpg',
  // NATPAC
  'natpac': '/images/institutions/natpac.jpg',
  'kscste-natpac': '/images/institutions/natpac.jpg',
  'national-transportation-planning-and-research-centre': '/images/institutions/natpac.jpg',
  // NIELIT
  'nielit': '/images/institutions/nielit.jpg',
  'national-institute-of-electronics-and-information-technology': '/images/institutions/nielit.jpg',
  // Dr Moopen's iNEST
  'inest': '/images/institutions/inest.jpg',
  'dr-moopens-inest': '/images/institutions/inest.jpg',
};

function resolveLogoUrl(slug: string, fallbackUrl?: string): string | null {
  const s = slug.toLowerCase();
  if (LOGO_MAP[s]) return LOGO_MAP[s];
  // partial match
  for (const [key, val] of Object.entries(LOGO_MAP)) {
    if (s.includes(key) || key.includes(s.split('-')[0])) return val;
  }
  return fallbackUrl || null;
}

function getAcronym(name: string): string {
  const wordMap: Record<string, string> = {
    CPCRI: 'CPCRI', CTCRI: 'CTCRI', NIIST: 'NIIST', KUFOS: 'KUFOS',
    CWRDM: 'CWRDM', JNTBGRI: 'JNTBGRI', KFRI: 'KFRI', KAU: 'KAU',
    CDAC: 'C-DAC', IISER: 'IISER', IIT: 'IIT', NIT: 'NIT',
    CIFT: 'CIFT', RGCB: 'RGCB', STIC: 'STIC', IAV: 'IAV',
    NATPAC: 'NATPAC', NIELIT: 'NIELIT', MBGIPS: 'MBGIPS', ICCS: 'ICCS',
    KSCSTE: 'KSCSTE', TREST: 'TrEST', BIONEST: 'BioNEST',
  };
  const upper = name.toUpperCase();
  for (const [k, v] of Object.entries(wordMap)) {
    if (upper.includes(k)) return v;
  }
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 5);
}

// ── Single Logo Tile ─────────────────────────────────────────
function LogoTile({ inst }: { inst: Institution }) {
  const [imgErr, setImgErr] = useState(false);
  const logo = resolveLogoUrl(inst.slug, inst.institution_image_embed_url || inst.institution_image || undefined);
  const acronym = getAcronym(inst.name);

  return (
    <Link
      href={`/institutions/${inst.slug}`}
      className="group flex items-center justify-center bg-white border border-gray-100 rounded-xl p-4 aspect-[3/2] hover:border-blue-300 hover:shadow-md hover:scale-[1.03] transition-all duration-200"
      title={inst.name}
      aria-label={`View ${inst.name} technologies`}
    >
      {logo && !imgErr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={inst.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="w-full h-full object-contain max-h-14"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-sm font-black text-[#2563EB] leading-none">{acronym}</span>
          <span className="text-[9px] text-gray-400 text-center line-clamp-2 leading-tight">{inst.name}</span>
        </div>
      )}
    </Link>
  );
}

// ── Marquee Item (needs own component for useState) ─────────
function MarqueeItem({ inst, index }: { inst: Institution; index: number }) {
  const [imgErr, setImgErr] = useState(false);
  const logo = resolveLogoUrl(inst.slug, inst.institution_image_embed_url || inst.institution_image || undefined);
  const acronym = getAcronym(inst.name);
  return (
    <div
      key={`${inst.slug}-${index}`}
      className="flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 rounded-xl px-5 py-3 h-14 min-w-[120px] max-w-[160px] hover:border-blue-200 hover:shadow-sm transition-all duration-200"
      title={inst.name}
    >
      {logo && !imgErr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={inst.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-[11px] font-bold text-[#2563EB]">{acronym}</span>
      )}
    </div>
  );
}

// ── Slow Marquee Strip ───────────────────────────────────────
function LogoMarquee({ institutions }: { institutions: Institution[] }) {
  const [paused, setPaused] = useState(false);
  const items = [...institutions, ...institutions, ...institutions];

  return (
    <div
      className="relative overflow-hidden mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-[#F8FAFF] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#F8FAFF] to-transparent" />
      <style>{`
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .logo-scroll-track {
          animation: logo-scroll 60s linear infinite;
          will-change: transform;
        }
        .logo-scroll-track.paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .logo-scroll-track { animation: none; } }
      `}</style>
      <div className={`logo-scroll-track flex items-center gap-6 py-3 ${paused ? 'paused' : ''}`}>
        {items.map((inst, i) => (
          <MarqueeItem key={`${inst.slug}-${i}`} inst={inst} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
interface Props {
  institutions: Institution[];
  showMarquee?: boolean;
}

export default function PartnerLogoWall({ institutions, showMarquee = true }: Props) {
  return (
    <section className="relative py-20 bg-[#F8FAFF] overflow-hidden border-b border-gray-100">
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="logo-wall-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="#2563EB" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#logo-wall-dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">
            Partner Institutions
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
                {institutions.length} Partner Institutes
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl leading-relaxed font-sans">
                Kerala&apos;s leading universities, research organisations, centres of excellence and
                technology institutions contributing to the RINK ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="flex flex-wrap gap-6 mb-10">
          {[
            { value: `${institutions.length}`, label: 'Partner Institutes' },
            { value: '160+', label: 'Technologies Available' },
            { value: '11+', label: 'Technology Sectors' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xl font-black text-[#2563EB] font-heading">{stat.value}</span>
              <span className="text-sm text-gray-500 font-sans">{stat.label}</span>
              <span className="text-gray-300 ml-4 last:hidden">|</span>
            </div>
          ))}
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {institutions.map(inst => (
            <LogoTile key={inst.slug} inst={inst} />
          ))}
        </div>

        {/* Trusted Research Partners marquee strip */}
        {showMarquee && (
          <div className="mt-14">
            <div className="text-center mb-4">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Trusted Research Partners
              </div>
            </div>
            <LogoMarquee institutions={institutions} />
            <p className="text-center text-[11px] text-gray-400 mt-3 font-sans">
              Hover to pause
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
