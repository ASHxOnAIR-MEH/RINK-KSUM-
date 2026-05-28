// ============================================================
// RINK Technology Explorer — Data Access Layer (DAL)
//
// This is the ONLY file that needs to change to migrate from
// local JSON to Supabase. All pages and components import from
// this file — never directly from /data/*.
//
// To enable Supabase: set NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, and uncomment
// the Supabase implementation blocks below.
// ============================================================

import { Technology, Sector, Institution, TechnologyFilters, SearchResult } from '@/types';
import { technologies as localTechnologies, getFeaturedTechnologies as localFeatured } from '@/data/technologies';
import { sectors as localSectors } from '@/data/sectors';
import { institutions as localInstitutions } from '@/data/institutions';

// ── Search / full text match helper ────────────────────────────
function matchesSearch(tech: Technology, query: string): boolean {
  const q = query.toLowerCase();
  return (
    tech.name.toLowerCase().includes(q) ||
    tech.description.toLowerCase().includes(q) ||
    tech.problem_solved.toLowerCase().includes(q) ||
    tech.institution.toLowerCase().includes(q) ||
    tech.sector.toLowerCase().includes(q) ||
    tech.technology_type.toLowerCase().includes(q) ||
    tech.inventor.toLowerCase().includes(q) ||
    tech.tags.some((t) => t.toLowerCase().includes(q)) ||
    tech.applications.some((a) => a.toLowerCase().includes(q))
  );
}

// ── Technologies ────────────────────────────────────────────────

export async function getAllTechnologies(): Promise<Technology[]> {
  // TODO: Replace with Supabase fetch when migrating
  // const { data } = await supabase.from('technologies').select('*').order('created_at', { ascending: false });
  // return data ?? [];
  return localTechnologies;
}

export async function searchTechnologies(
  filters: TechnologyFilters,
  page = 1,
  perPage = 12
): Promise<SearchResult> {
  // TODO: Replace with Supabase full-text search when migrating
  // const { data, count } = await supabase.from('technologies').select('*', { count: 'exact' })
  //   .textSearch('search_vector', filters.query ?? '')
  //   ...additional filters...
  //   .range((page - 1) * perPage, page * perPage - 1);

  let results = [...localTechnologies];

  if (filters.query && filters.query.trim()) {
    results = results.filter((t) => matchesSearch(t, filters.query!));
  }
  if (filters.sector) {
    results = results.filter((t) => t.sector_slug === filters.sector);
  }
  if (filters.institution) {
    results = results.filter((t) => t.institution_slug === filters.institution);
  }
  if (filters.technology_type) {
    results = results.filter((t) => t.technology_type === filters.technology_type);
  }
  if (filters.commercialization_status) {
    results = results.filter((t) => t.commercialization_status === filters.commercialization_status);
  }
  if (filters.startup_potential_min) {
    results = results.filter((t) => t.startup_potential >= filters.startup_potential_min!);
  }
  if (filters.patent_status) {
    results = results.filter((t) => t.patent_status === filters.patent_status);
  }

  const total = results.length;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return { technologies: paginated, total, page, per_page: perPage };
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  // TODO: Replace with Supabase fetch when migrating
  // const { data } = await supabase.from('technologies').select('*').eq('id', id).single();
  return localTechnologies.find((t) => t.id === id) ?? null;
}

export async function getFeaturedTechnologies(): Promise<Technology[]> {
  // TODO: Replace with Supabase fetch when migrating
  return localFeatured();
}

export async function getTechnologiesBySector(sectorSlug: string): Promise<Technology[]> {
  // TODO: Replace with Supabase fetch
  return localTechnologies.filter((t) => t.sector_slug === sectorSlug);
}

export async function getTechnologiesByInstitution(institutionSlug: string): Promise<Technology[]> {
  // TODO: Replace with Supabase fetch
  return localTechnologies.filter((t) => t.institution_slug === institutionSlug);
}

export async function getRelatedTechnologies(tech: Technology): Promise<Technology[]> {
  // TODO: Replace with Supabase fetch
  return localTechnologies.filter(
    (t) => tech.related_technology_ids.includes(t.id) && t.id !== tech.id
  );
}

// ── Sectors ────────────────────────────────────────────────────

export async function getAllSectors(): Promise<Sector[]> {
  // TODO: Replace with Supabase fetch
  // Dynamically compute tech counts from local data
  const sectorCounts = localTechnologies.reduce<Record<string, number>>((acc, t) => {
    acc[t.sector_slug] = (acc[t.sector_slug] ?? 0) + 1;
    return acc;
  }, {});
  return localSectors.map((s) => ({ ...s, tech_count: sectorCounts[s.slug] ?? 0 }));
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  // TODO: Replace with Supabase fetch
  return localSectors.find((s) => s.slug === slug) ?? null;
}

// ── Institutions ────────────────────────────────────────────────

export async function getAllInstitutions(): Promise<Institution[]> {
  // TODO: Replace with Supabase fetch
  const instCounts = localTechnologies.reduce<Record<string, number>>((acc, t) => {
    acc[t.institution_slug] = (acc[t.institution_slug] ?? 0) + 1;
    return acc;
  }, {});
  return localInstitutions.map((i) => ({ ...i, tech_count: instCounts[i.slug] ?? 0 }));
}

export async function getInstitutionBySlug(slug: string): Promise<Institution | null> {
  // TODO: Replace with Supabase fetch
  return localInstitutions.find((i) => i.slug === slug) ?? null;
}

// ── Stats ───────────────────────────────────────────────────────
export async function getPlatformStats() {
  const techs = await getAllTechnologies();
  const insts = await getAllInstitutions();
  const sects = await getAllSectors();
  return {
    technology_count: techs.length,
    institution_count: insts.filter((i) => i.tech_count > 0).length,
    sector_count: sects.filter((s) => s.tech_count > 0).length,
    commercial_ready_count: techs.filter((t) => t.commercialization_status === 'Commercial Ready').length,
  };
}
