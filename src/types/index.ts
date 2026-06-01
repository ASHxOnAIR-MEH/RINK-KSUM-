// ============================================================
// RINK Technology Explorer — Core Type Definitions
// Aligned with the actual Google Sheet schema
// ============================================================

export interface Technology {
  id: string;               // Technology ID (e.g. CPCRI-001)
  name: string;             // Technology Name
  institution: string;      // Institution (display name)
  institution_slug: string; // Derived slug for routing
  sector: string;           // Sector (display)
  sector_slug: string;      // Derived slug for routing
  technology_type: string;  // Technology Type (freeform from sheet)
  problem_solved: string;   // Problem Solved
  description: string;      // Description
  applications: string[];   // Applications (split from comma/semicolon)
  startup_potential: StartupPotential; // High / Medium / Low
  startup_potential_score: number;     // 5 / 3 / 2 for star display
  trl: string;              // TRL (may be "Not Specified")
  patent_status: string;    // Patent Status (freeform from sheet)
  contact_person: string;   // Contact Person
  phone: string;            // Phone
  email: string;            // Email
  keywords: string[];       // Keywords (split from comma)
  image_url: string;        // Image URL (Google Drive or other)
  image_embed_url: string;  // Converted embed URL for <img>
  institution_website: string; // Institution Website
  // Derived / computed
  featured: boolean;        // High startup potential = featured
}

export type StartupPotential = 'High' | 'Medium' | 'Low' | 'Not Specified';

// ── Derived aggregates ──────────────────────────────────────

export interface Sector {
  slug: string;
  name: string;
  tech_count: number;
  icon: string;
  color: string;
}

export interface Institution {
  slug: string;
  name: string;
  tech_count: number;
}

// ── Search & Filter Types ───────────────────────────────────

export interface TechnologyFilters {
  query?: string;
  sector?: string;
  institution?: string;
  technology_type?: string;
  patent_status?: string;
  startup_potential?: StartupPotential;
}

export interface SearchResult {
  technologies: Technology[];
  total: number;
  page: number;
  per_page: number;
}

export interface SearchIndexItem {
  id: string;
  name: string;
  institution: string;
  sector: string;
  keywords: string[];
  applications: string[];
  problem_solved: string;
}
