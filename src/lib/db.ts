// ============================================================
// RINK Technology Explorer — Data Access Layer (DAL)
//
// All pages/components import from this file.
// Data source: Google Sheets via /src/lib/sheets.ts
// ============================================================

import {
  Technology, Sector, Institution, TechnologyFilters, SearchResult, SearchIndexItem
} from '@/types';
import {
  fetchAllTechnologies, fetchSectors, fetchInstitutions
} from '@/lib/sheets';

// ── Search helper ─────────────────────────────────────────────
function matchesSearch(tech: Technology, query: string): boolean {
  const q = query.toLowerCase();
  return (
    tech.name.toLowerCase().includes(q) ||
    tech.description.toLowerCase().includes(q) ||
    tech.problem_solved.toLowerCase().includes(q) ||
    tech.institution.toLowerCase().includes(q) ||
    tech.sector.toLowerCase().includes(q) ||
    tech.technology_type.toLowerCase().includes(q) ||
    tech.keywords.some(k => k.toLowerCase().includes(q)) ||
    tech.applications.some(a => a.toLowerCase().includes(q))
  );
}

// ── Technologies ──────────────────────────────────────────────

export async function getAllTechnologies(): Promise<Technology[]> {
  return fetchAllTechnologies();
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  const techs = await fetchAllTechnologies();
  return techs.find(t => t.id === id) ?? null;
}

export async function getFeaturedTechnologies(limit = 6): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return techs.filter(t => t.featured).slice(0, limit);
}

export async function getRecentTechnologies(limit = 6): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  // "Recent" = last added to the sheet (last rows)
  return [...techs].reverse().slice(0, limit);
}

export async function searchTechnologies(
  filters: TechnologyFilters,
  page = 1,
  perPage = 12
): Promise<SearchResult> {
  let results = await fetchAllTechnologies();

  if (filters.query?.trim()) {
    results = results.filter(t => matchesSearch(t, filters.query!));
  }
  if (filters.sector) {
    results = results.filter(t => t.sector_slug === filters.sector);
  }
  if (filters.institution) {
    results = results.filter(t => t.institution_slug === filters.institution);
  }
  if (filters.technology_type) {
    results = results.filter(t =>
      t.technology_type.toLowerCase() === filters.technology_type!.toLowerCase()
    );
  }
  if (filters.patent_status) {
    results = results.filter(t =>
      t.patent_status.toLowerCase() === filters.patent_status!.toLowerCase()
    );
  }
  if (filters.startup_potential) {
    results = results.filter(t => t.startup_potential === filters.startup_potential);
  }

  const total = results.length;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return { technologies: paginated, total, page, per_page: perPage };
}

export async function getTechnologiesBySector(sectorSlug: string): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return techs.filter(t => t.sector_slug === sectorSlug);
}

export async function getTechnologiesByInstitution(institutionSlug: string): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return techs.filter(t => t.institution_slug === institutionSlug);
}

// ── Sectors ───────────────────────────────────────────────────

export async function getAllSectors(): Promise<Sector[]> {
  return fetchSectors();
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  const sectors = await fetchSectors();
  return sectors.find(s => s.slug === slug) ?? null;
}

// ── Institutions ──────────────────────────────────────────────

export async function getAllInstitutions(): Promise<Institution[]> {
  return fetchInstitutions();
}

export async function getInstitutionBySlug(slug: string): Promise<Institution | null> {
  const insts = await fetchInstitutions();
  return insts.find(i => i.slug === slug) ?? null;
}

// ── Stats ─────────────────────────────────────────────────────
export async function getPlatformStats() {
  const techs = await fetchAllTechnologies();
  const insts = await fetchInstitutions();
  const sectors = await fetchSectors();

  return {
    technology_count: techs.length,
    institution_count: insts.length,
    sector_count: sectors.length,
    high_potential_count: techs.filter(t => t.startup_potential === 'High').length,
  };
}

// ── Search Index ──────────────────────────────────────────────
export async function getSearchIndex(): Promise<SearchIndexItem[]> {
  const techs = await fetchAllTechnologies();
  return techs.map(t => ({
    id: t.id,
    name: t.name,
    institution: t.institution,
    sector: t.sector,
    keywords: t.keywords,
    applications: t.applications,
    problem_solved: t.problem_solved,
  }));
}

// ── Technology types list (for filter dropdown) ───────────────
export async function getTechnologyTypes(): Promise<string[]> {
  const techs = await fetchAllTechnologies();
  const types = new Set(techs.map(t => t.technology_type).filter(v => v && v !== 'Not Specified'));
  return Array.from(types).sort();
}

export async function getPatentStatuses(): Promise<string[]> {
  const techs = await fetchAllTechnologies();
  const statuses = new Set(techs.map(t => t.patent_status).filter(v => v && v !== 'Not Specified'));
  return Array.from(statuses).sort();
}
