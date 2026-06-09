// ============================================================
// RINK Technology Explorer — Data Access Layer (DAL)
//
// All pages/components import from this file.
// Data source: Google Sheets via /src/lib/sheets.ts
// ============================================================

import {
  Technology, Sector, Institution, TechnologyFilters, SearchResult, SearchIndexItem, StartupPotential
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

export async function getFeaturedTechnologies(limit = 20): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return techs
    .filter(t => t.featured)
    .sort((a, b) => b.startup_potential_score - a.startup_potential_score)
    .slice(0, limit);
}

export async function getRecentTechnologies(limit = 8): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  
  // Sort by last_updated date if parseable, falling back to reverse row index order
  return [...techs]
    .sort((a, b) => {
      const timeA = a.last_updated ? Date.parse(a.last_updated) : NaN;
      const timeB = b.last_updated ? Date.parse(b.last_updated) : NaN;
      
      const isValidA = !isNaN(timeA);
      const isValidB = !isNaN(timeB);
      
      if (isValidA && isValidB) {
        return timeB - timeA; // Descending order (newest first)
      }
      if (isValidA) return -1; // Valid date comes first
      if (isValidB) return 1;
      
      // Fallback: reverse row index order (newer rows at the bottom)
      const idxA = techs.indexOf(a);
      const idxB = techs.indexOf(b);
      return idxB - idxA;
    })
    .slice(0, limit);
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

// ── Sort by startup potential: Featured → Very High → High → Medium → Low ─────────
function sortByPotential(techs: Technology[]): Technology[] {
  const order: Record<StartupPotential, number> = {
    'Featured': 0,
    'Very High': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
    'Not Specified': 5
  };
  return [...techs].sort(
    (a, b) => (order[a.startup_potential] ?? 5) - (order[b.startup_potential] ?? 5)
  );
}

export async function getTechnologiesBySector(sectorSlug: string): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return sortByPotential(techs.filter(t => t.sector_slug === sectorSlug));
}

export async function getTechnologiesByInstitution(institutionSlug: string): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();
  return sortByPotential(techs.filter(t => t.institution_slug === institutionSlug));
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

export async function getAllInstitutions(): Promise<(Institution & { specializations?: string[] })[]> {
  const insts = await fetchInstitutions();
  const techs = await fetchAllTechnologies();

  return insts.map(inst => {
    const instTechs = techs.filter(t => t.institution_slug === inst.slug);
    const sectorCounts = new Map<string, number>();
    for (const t of instTechs) {
      sectorCounts.set(t.sector, (sectorCounts.get(t.sector) ?? 0) + 1);
    }
    const sortedSectors = Array.from(sectorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    
    // Apply curated sectors for KAU & CPCRI to ensure premium branding:
    let specs = sortedSectors;
    if (inst.slug.includes('kau')) {
      specs = ['Agriculture', 'Food Processing', 'Machinery'];
    } else if (inst.slug.includes('cpcri')) {
      specs = ['Coconut Technologies', 'Food Tech', 'Biotechnology'];
    } else if (specs.length === 0) {
      specs = ['General Technology'];
    }

    return {
      ...inst,
      specializations: specs,
    };
  });
}

export async function getInstitutionBySlug(slug: string): Promise<(Institution & { specializations?: string[] }) | null> {
  const insts = await getAllInstitutions();
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
