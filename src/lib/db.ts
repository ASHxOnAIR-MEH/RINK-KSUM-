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
  fetchAllTechnologies, fetchSectors, fetchMergedInstitutions
} from '@/lib/sheets';
import { hybridSearch } from '@/lib/search-engine';

// ── Search helper (delegated to hybrid engine) ────────────────
// Kept as a thin wrapper so any future callers that reference matchesSearch still compile.
function matchesSearch(tech: Technology, query: string): boolean {
  // Simple fallback — the main path now goes through hybridSearch() in searchTechnologies()
  return tech.name.toLowerCase().includes(query.toLowerCase().trim());
}

// ── Technologies ──────────────────────────────────────────────

export async function getAllTechnologies(): Promise<Technology[]> {
  return fetchAllTechnologies();
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  const techs = await fetchAllTechnologies();
  return techs.find(t => t.id === id) ?? null;
}

export async function getFeaturedTechnologies(limit = 100): Promise<Technology[]> {
  const techs = await fetchAllTechnologies();

  const hasImage = (t: Technology) =>
    !!(t.image_embed_url || t.technology_image_embed_url || t.image_url || t.technology_image);

  return techs
    .filter(t => (t.startup_potential || '').toLowerCase() === 'high' && hasImage(t))
    .sort((a, b) => a.name.localeCompare(b.name))
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
  let allTechs = await fetchAllTechnologies();

  // ── Build lightweight search index items for the engine ──
  const indexItems: SearchIndexItem[] = allTechs.map(t => ({
    id: t.id,
    name: t.name,
    institution: t.institution,
    institution_slug: t.institution_slug,
    sector: t.sector,
    sector_slug: t.sector_slug,
    technology_type: t.technology_type,
    startup_potential: t.startup_potential,
    ip_status: t.ip_status,
    trl: t.trl,
    keywords: t.keywords,
    applications: t.applications,
    problem_solved: t.problem_solved,
    description: t.description,
  }));

  // ── Apply hard filters first (sector, institution, TRL, etc.) ──
  // These always narrow the dataset regardless of query.
  if (filters.sector) {
    allTechs = allTechs.filter(t => t.sector_slug === filters.sector);
  }
  if (filters.institution) {
    allTechs = allTechs.filter(t => t.institution_slug === filters.institution);
  }
  if (filters.trl) {
    allTechs = allTechs.filter(t =>
      t.trl.toLowerCase() === filters.trl!.toLowerCase()
    );
  }
  if (filters.patent_status) {
    allTechs = allTechs.filter(t =>
      t.ip_status.toLowerCase() === filters.patent_status!.toLowerCase()
    );
  }
  if (filters.startup_potential) {
    allTechs = allTechs.filter(t => t.startup_potential === filters.startup_potential);
  }
  if (filters.featured) {
    if (filters.featured === 'featured') {
      allTechs = allTechs.filter(t => (t.startup_potential || '').toLowerCase() === 'high');
    } else if (filters.featured === 'non-featured') {
      allTechs = allTechs.filter(t => (t.startup_potential || '').toLowerCase() !== 'high');
    }
  }

  // ── Apply hybrid search engine if query is present ──
  if (filters.query?.trim()) {
    // Rebuild index from filtered set
    const filteredIndex: SearchIndexItem[] = allTechs.map(t => ({
      id: t.id,
      name: t.name,
      institution: t.institution,
      institution_slug: t.institution_slug,
      sector: t.sector,
      sector_slug: t.sector_slug,
      technology_type: t.technology_type,
      startup_potential: t.startup_potential,
      ip_status: t.ip_status,
      trl: t.trl,
      keywords: t.keywords,
      applications: t.applications,
      problem_solved: t.problem_solved,
      description: t.description,
    }));

    const { primary, related, queryInfo } = hybridSearch(filteredIndex, filters.query);

    // Map scored IDs back to full Technology objects
    const techById = new Map(allTechs.map(t => [t.id, t]));
    const primaryTechs = primary.map(r => techById.get(r.id)).filter(Boolean) as Technology[];
    const relatedTechs = related.map(r => techById.get(r.id)).filter(Boolean) as Technology[];

    const total = primaryTechs.length;
    const paginated = primaryTechs.slice((page - 1) * perPage, page * perPage);

    return {
      technologies: paginated,
      total,
      page,
      per_page: perPage,
      related: relatedTechs,
      queryInfo,
    };
  }

  // ── No query — return all filtered results ──
  const total = allTechs.length;
  const paginated = allTechs.slice((page - 1) * perPage, page * perPage);

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
  const insts = await fetchMergedInstitutions();
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

    return {
      ...inst,
      specializations: sortedSectors.length > 0 ? sortedSectors : ['General Technology'],
    };
  });
}

export async function getInstitutionBySlug(slug: string): Promise<(Institution & { specializations?: string[] }) | null> {
  const insts = await getAllInstitutions();
  return insts.find(i => i.slug === slug) ?? null;
}

export async function getInstitutionTechnologyCount(slug: string): Promise<number> {
  const techs = await fetchAllTechnologies();
  return techs.filter(t => t.institution_slug === slug).length;
}

// ── Stats ─────────────────────────────────────────────────────
export async function getPlatformStats() {
  const techs = await fetchAllTechnologies();
  const insts = await fetchMergedInstitutions();
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
    institution_slug: t.institution_slug,
    sector: t.sector,
    sector_slug: t.sector_slug,
    technology_type: t.technology_type,
    startup_potential: t.startup_potential,
    ip_status: t.ip_status,
    trl: t.trl,
    keywords: t.keywords,
    applications: t.applications,
    problem_solved: t.problem_solved,
    description: t.description,
  }));
}


// ── Removed Technology types list (replaced by TRL) ───────────────

export async function getPatentStatuses(): Promise<string[]> {
  // Returns the normalized IP Status values (from the "IP Status for frontend" column)
  // in canonical order, limited to values that actually exist in the data.
  // Used to populate the "IP Status" filter dropdown — NEVER exposes patent numbers.
  const CANONICAL_ORDER = [
    'Patented',
    'Published',
    'Filed',
    'Patent Pending',
    'Not Patented',
    'Not Available',
  ];
  const techs = await fetchAllTechnologies();
  const present = new Set(
    techs
      .map(t => (t.ip_status || '').trim())
      .filter(Boolean)
  );

  // Order by canonical list first, then append any unexpected values alphabetically
  const ordered: string[] = [];
  for (const v of CANONICAL_ORDER) {
    const match = Array.from(present).find(p => p.toLowerCase() === v.toLowerCase());
    if (match) {
      ordered.push(v);
      present.delete(match);
    }
  }
  const extras = Array.from(present).sort();
  return [...ordered, ...extras];
}
