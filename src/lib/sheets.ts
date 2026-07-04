// ============================================================
// RINK Technology Explorer — Data Layer (Migrated to JSON API)
// ============================================================

import { Technology, Sector, Institution } from '@/types';
import { RawTechnology, RawInstitutionDetail } from '@/types/raw';
import { mapTechnology, mapInstitutionDetail, toSlug } from './mapper';
import { CDN_HOST } from './config';

// ── Sector metadata (color only — icons are SVGs in SectorIcons.tsx) ──────
const SECTOR_META: Record<string, { icon: string; color: string }> = {
  'agriculture':                                    { icon: '🌾', color: '#16a34a' },
  'biotechnology-life-sciences':                    { icon: '🔬', color: '#7c3aed' },
  'biotechnology-life-sciences-1':                  { icon: '🔬', color: '#7c3aed' },
  'food-technology':                                { icon: '🍽️', color: '#ea580c' },
  'advanced-materials-chemicals':                   { icon: '⚗️', color: '#9333ea' },
  'medtech-health-care':                            { icon: '🏥', color: '#be185d' },
  'robotics-automation-drones':                     { icon: '🤖', color: '#4f46e5' },
  'infrastructure-construction-smart-cities':       { icon: '🏗️', color: '#b45309' },
  'digital-technologies-al-software':              { icon: '💻', color: '#0891b2' },
  'digital-technologies-ai-software':              { icon: '💻', color: '#0891b2' },
  'manufacturing-industrial-technologies':          { icon: '⚙️', color: '#dc2626' },
  'consumer-products-cosmetics-lifestyle':          { icon: '🛍️', color: '#db2777' },
  'energy-climate-sustainability':                  { icon: '⚡', color: '#ca8a04' },
  'water-environment-waste-management':             { icon: '💧', color: '#2563eb' },
  'food-processing':         { icon: '🍽️', color: '#ea580c' },
  'biotechnology':           { icon: '🔬', color: '#7c3aed' },
  'aquaculture':             { icon: '🐟', color: '#0284c7' },
  'environment':             { icon: '🌿', color: '#15803d' },
  'materials':               { icon: '⚗️', color: '#9333ea' },
  'construction':            { icon: '🏗️', color: '#b45309' },
  'agritech':                { icon: '📡', color: '#0d9488' },
  'post-harvest':            { icon: '📦', color: '#d97706' },
  'water-technology':        { icon: '💧', color: '#2563eb' },
  'renewable-energy':        { icon: '⚡', color: '#ca8a04' },
  'climate-tech':            { icon: '🌱', color: '#65a30d' },
  'manufacturing':           { icon: '⚙️', color: '#dc2626' },
  'sustainable-materials':   { icon: '♻️', color: '#059669' },
  'healthcare':              { icon: '🏥', color: '#be185d' },
  'smart-systems':           { icon: '🤖', color: '#4f46e5' },
  'transportation':          { icon: '🚗', color: '#0369a1' },
  'ict':                     { icon: '💻', color: '#0891b2' },
  'energy':                  { icon: '⚡', color: '#ca8a04' },
  'sustainability':          { icon: '🌱', color: '#059669' },
  'cosmetics':               { icon: '🛍️', color: '#db2777' },
  'electronics':             { icon: '💡', color: '#4f46e5' },
  'electronics-and-communication': { icon: '📡', color: '#0891b2' },
  'chemical-sciences':       { icon: '⚗️', color: '#9333ea' },
  'food-processing-iot':     { icon: '🍽️', color: '#ea580c' },
  'food-processing-food-technology': { icon: '🍽️', color: '#ea580c' },
  'sector':                  { icon: '🔧', color: '#6b7280' },
  'default':                 { icon: '🔧', color: '#6b7280' },
};

function getSectorMeta(slug: string) {
  return SECTOR_META[slug] ?? SECTOR_META['default'];
}

// ── Main fetch function ───────────────────────────────────────
let _cache: { data: Technology[]; ts: number } | null = null;
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 60 * 1000;

export function clearCache() {
  _cache = null;
  _instDetailsCache = null;
  console.log('[RINK] Cache cleared — next request will fetch fresh data');
}

export async function fetchAllTechnologies(): Promise<Technology[]> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
    return _cache.data;
  }

  const fetchOptions: RequestInit =
    process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' }
      : { next: { revalidate: 60 } } as RequestInit;

  try {
    const res = await fetch(`${CDN_HOST}/rink_tech.json`, fetchOptions);

    if (!res.ok) {
      console.error(`[RINK] API fetch failed: ${res.status}`);
      return _cache?.data ?? [];
    }

    const rawData = await res.json();
    
    // Support if JSON comes as an object map instead of flat array
    let tabRows: any[] = [];
    if (Array.isArray(rawData)) {
      tabRows = rawData;
    } else {
      // Access the specific technologies tab from the backend response
      tabRows = rawData.technologies || rawData[Object.keys(rawData)[0]] || [];
    }

    const technologies: Technology[] = tabRows
      .map((row) => mapTechnology(row))
      .filter((tech): tech is Technology => tech !== null);

    _cache = { data: technologies, ts: Date.now() };
    console.log(`[RINK] Loaded ${technologies.length} technologies from JSON API`);
    return technologies;
  } catch (err) {
    console.error('[RINK] Failed to fetch data:', err);
    return _cache?.data ?? [];
  }
}

// ── Derived data helpers ──────────────────────────────────────
export async function fetchSectors(): Promise<Sector[]> {
  const techs = await fetchAllTechnologies();
  const map = new Map<string, { name: string; count: number; types: Map<string, number> }>();

  for (const t of techs) {
    let existing = map.get(t.sector_slug);
    if (!existing) {
      existing = { name: t.sector, count: 0, types: new Map<string, number>() };
      map.set(t.sector_slug, existing);
    }
    
    existing.count++;
    
    if (t.technology_type && t.technology_type !== 'Not Specified' && t.technology_type !== 'NA') {
      const types = t.technology_type.split(/[,;]/).map(type => type.trim()).filter(type => type.length > 0);
      for (const type of types) {
        existing.types.set(type, (existing.types.get(type) || 0) + 1);
      }
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count, types }]) => {
      const top_tags = Array.from(types.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([type]) => type);

      return {
        slug,
        name,
        tech_count: count,
        top_tags: top_tags.length > 0 ? top_tags : ['Research', 'Innovation'],
        ...getSectorMeta(slug),
      };
    })
    .sort((a, b) => b.tech_count - a.tech_count);
}

export async function fetchInstitutions(): Promise<Institution[]> {
  const techs = await fetchAllTechnologies();
  const map = new Map<string, { name: string; count: number; image?: string; imageEmbed?: string; lastUpdated?: string }>();

  for (const t of techs) {
    const existing = map.get(t.institution_slug);
    if (existing) {
      existing.count++;
      if (!existing.image && t.institution_image) {
        existing.image = t.institution_image;
        existing.imageEmbed = t.institution_image_embed_url;
      }
      if (!existing.lastUpdated && t.last_updated) {
        existing.lastUpdated = t.last_updated;
      }
    } else {
      map.set(t.institution_slug, {
        name: t.institution,
        count: 1,
        image: t.institution_image,
        imageEmbed: t.institution_image_embed_url,
        lastUpdated: t.last_updated
      });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count, image, imageEmbed, lastUpdated }]) => ({
      slug,
      name,
      tech_count: count,
      institution_image: image,
      institution_image_embed_url: imageEmbed,
      last_updated: lastUpdated
    }))
    .sort((a, b) => b.tech_count - a.tech_count);
}


// ── Institution Details Sheet ─────────────────────────────────
export interface InstitutionDetailRow {
  name: string;
  slug: string;
  logo_url: string;
  logo_embed_url: string;
  address: string;
  website: string;
  contact_email: string;
  contact_phone: string;
}

let _instDetailsCache: { data: InstitutionDetailRow[]; ts: number } | null = null;

export async function fetchInstitutionDetails(): Promise<InstitutionDetailRow[]> {
  if (_instDetailsCache && Date.now() - _instDetailsCache.ts < CACHE_TTL) {
    return _instDetailsCache.data;
  }

  const fetchOptions: RequestInit =
    process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' }
      : { next: { revalidate: 60 } } as RequestInit;

  try {
    const res = await fetch(`${CDN_HOST}/rink_tech.json`, fetchOptions);
    if (!res.ok) {
      console.error(`[RINK] Institution API fetch failed: ${res.status}`);
      return _instDetailsCache?.data ?? [];
    }

    const rawData = await res.json();
    let tabRows: any[] = [];
    if (Array.isArray(rawData)) {
      tabRows = rawData;
    } else {
      // Access the specific institutions tab from the backend response
      tabRows = rawData.institutions || rawData[Object.keys(rawData)[1]] || [];
    }

    const details: InstitutionDetailRow[] = tabRows
      .map((row) => mapInstitutionDetail(row))
      .filter((detail): detail is InstitutionDetailRow => detail !== null);

    _instDetailsCache = { data: details, ts: Date.now() };
    console.log(`[RINK] Loaded ${details.length} institution details from JSON`);
    return details;
  } catch (err) {
    console.error('[RINK] Failed to fetch institution details:', err);
    return _instDetailsCache?.data ?? [];
  }
}

// ── Merged institution data (Details + Technology counts) ─────
export async function fetchMergedInstitutions(): Promise<Institution[]> {
  const [techs, details] = await Promise.all([
    fetchAllTechnologies(),
    fetchInstitutionDetails(),
  ]);

  const countMap = new Map<string, { name: string; count: number; image?: string; imageEmbed?: string }>();
  for (const t of techs) {
    const existing = countMap.get(t.institution_slug);
    if (existing) {
      existing.count++;
    } else {
      countMap.set(t.institution_slug, {
        name: t.institution,
        count: 1,
        image: t.institution_image,
        imageEmbed: t.institution_image_embed_url,
      });
    }
  }

  const detailsMap = new Map<string, InstitutionDetailRow>();
  for (const d of details) {
    detailsMap.set(d.slug, d);
  }

  function findDetail(slug: string): InstitutionDetailRow | undefined {
    const exact = detailsMap.get(slug);
    if (exact) return exact;
    for (const [dSlug, d] of detailsMap.entries()) {
      if (slug.includes(dSlug) || dSlug.includes(slug)) return d;
    }
    return undefined;
  }

  const merged: Institution[] = [];
  for (const [slug, info] of countMap.entries()) {
    const detail = findDetail(slug);
    merged.push({
      slug,
      name: detail?.name || info.name,
      tech_count: info.count,
      institution_image: detail?.logo_url || info.image,
      institution_image_embed_url: detail?.logo_embed_url || info.imageEmbed,
      logo_url: detail?.logo_url,
      logo_embed_url: detail?.logo_embed_url,
      address: detail?.address,
      website: detail?.website,
      contact_email: detail?.contact_email,
      contact_phone: detail?.contact_phone,
    });
  }

  for (const d of details) {
    if (!countMap.has(d.slug)) {
      merged.push({
        slug: d.slug,
        name: d.name,
        tech_count: 0,
        logo_url: d.logo_url,
        logo_embed_url: d.logo_embed_url,
        institution_image: d.logo_url,
        institution_image_embed_url: d.logo_embed_url,
        address: d.address,
        website: d.website,
        contact_email: d.contact_email,
        contact_phone: d.contact_phone,
      });
    }
  }

  return merged.sort((a, b) => b.tech_count - a.tech_count);
}
