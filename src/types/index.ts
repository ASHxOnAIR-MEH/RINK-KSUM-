// ============================================================
// RINK Technology Explorer — Core Type Definitions
// Designed to mirror Supabase schema for zero-migration swap
// ============================================================

export interface Technology {
  id: string;
  name: string;
  institution: string;
  institution_slug: string;
  inventor: string;
  description: string;
  problem_solved: string;
  applications: string[];
  sector: string;
  sector_slug: string;
  technology_type: TechnologyType;
  patent_status: PatentStatus;
  startup_potential: number; // 1-5
  technology_readiness: number; // TRL 1-9
  commercialization_status: CommercializationStatus;
  contact: TechnologyContact;
  related_technology_ids: string[];
  downloads: TechnologyDownload[];
  image_url: string;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TechnologyContact {
  name: string;
  designation: string;
  phone: string;
  email: string;
  website: string;
  institution: string;
}

export interface TechnologyDownload {
  label: string;
  url: string;
  type: 'pdf' | 'brochure' | 'report';
}

export type TechnologyType =
  | 'Process'
  | 'Product'
  | 'Device'
  | 'Software'
  | 'Material'
  | 'Formulation'
  | 'Method'
  | 'System';

export type PatentStatus =
  | 'Patented'
  | 'Patent Applied'
  | 'Trade Secret'
  | 'Open Source'
  | 'Copyright'
  | 'Not Patented';

export type CommercializationStatus =
  | 'Commercial Ready'
  | 'Pilot Stage'
  | 'Lab Stage'
  | 'Technology Transfer Available';

export interface Sector {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tech_count: number;
}

export interface Institution {
  id: string;
  slug: string;
  acronym: string;
  full_name: string;
  description: string;
  location: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  contact_person: string;
  tech_count: number;
  logo_url?: string;
}

// ============================================================
// Search & Filter Types
// ============================================================

export interface TechnologyFilters {
  query?: string;
  sector?: string;
  institution?: string;
  technology_type?: TechnologyType;
  commercialization_status?: CommercializationStatus;
  startup_potential_min?: number;
  patent_status?: PatentStatus;
}

export interface SearchResult {
  technologies: Technology[];
  total: number;
  page: number;
  per_page: number;
}
