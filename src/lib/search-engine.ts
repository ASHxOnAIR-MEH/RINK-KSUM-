// ============================================================
// RINK Technology Explorer — Hybrid Search Engine v2.0
//
// Architecture:
//   Priority 1: Exact substring match (weighted by field)
//   Priority 2: Conservative fuzzy match via Fuse.js (typo correction only)
//   Priority 3: Controlled synonym expansion (fallback only)
//
// This module is pure TypeScript — no React, no I/O.
// It can run on server (db.ts) and client (SearchBar).
// ============================================================

import Fuse from 'fuse.js';
import type { SearchIndexItem } from '@/types';

// ─────────────────────────────────────────────────────────────
// FIELD WEIGHTS
// ─────────────────────────────────────────────────────────────
const WEIGHTS = {
  name:          10,
  keywords:       9,
  problem_solved: 8,
  applications:   6,
  technology_type:4,
  description:    3,
  institution:    2,
  sector:         2,
} as const;

// ─────────────────────────────────────────────────────────────
// SCORE THRESHOLDS
// ─────────────────────────────────────────────────────────────
export const SCORE_PRIMARY = 80;   // ≥ 80 → primary results
export const SCORE_RELATED = 40;   // 40–79 → related results
                                   // < 40 → hidden

// ─────────────────────────────────────────────────────────────
// SYNONYM DICTIONARY  (static, manually maintained, v-controlled)
// Extend this object to add new synonyms. Never generate dynamically.
// ─────────────────────────────────────────────────────────────
export const SYNONYMS: Record<string, string[]> = {
  // ── Medical ───────────────────────────────────────────────
  cancer:       ['oncology', 'tumor', 'tumour', 'carcinoma', 'biopsy', 'malignant', 'carcinogen', 'neoplasm'],
  kidney:       ['renal', 'nephrology', 'ckd', 'creatinine', 'albumin', 'urine', 'nephron', 'dialysis'],
  diabetes:     ['glucose', 'insulin', 'hba1c', 'glycemic', 'pancreas', 'hypoglycemia', 'diabetic'],
  heart:        ['cardiac', 'cardiology', 'cardiovascular', 'myocardial', 'coronary', 'artery'],
  brain:        ['neural', 'neurology', 'cognitive', 'alzheimer', 'dementia', 'stroke', 'epilepsy'],
  skin:         ['dermatology', 'dermal', 'wound', 'psoriasis', 'eczema'],
  eye:          ['ophthalmic', 'retinal', 'glaucoma', 'cataract', 'ocular', 'vision'],
  blood:        ['haematology', 'hematology', 'hemoglobin', 'platelet', 'anemia', 'sickle'],
  infection:    ['antimicrobial', 'antibiotic', 'pathogen', 'bacteria', 'virus', 'fungal', 'antifungal', 'antiviral'],
  drug:         ['pharmaceutical', 'therapeutics', 'medicine', 'dosage', 'formulation'],
  vaccine:      ['immunization', 'antibody', 'immunology', 'antigen', 'serum'],
  // ── Agriculture ───────────────────────────────────────────
  agriculture:  ['farming', 'crop', 'cultivation', 'harvest', 'agri', 'agronomic', 'horticulture'],
  fertilizer:   ['nutrient', 'npk', 'soil', 'compost', 'manure', 'biofertilizer'],
  pest:         ['pesticide', 'insecticide', 'biopesticide', 'fungicide', 'herbicide', 'weed'],
  irrigation:   ['water management', 'drip', 'sprinkler', 'hydroponics'],
  // ── Aquaculture & Marine ──────────────────────────────────
  fish:         ['aquaculture', 'marine', 'fishery', 'seafood', 'prawn', 'shrimp', 'tilapia'],
  seaweed:      ['algae', 'macroalgae', 'marine plant'],
  // ── Coconut & Plantation ──────────────────────────────────
  coconut:      ['coir', 'neera', 'kalparasa', 'palm', 'copra', 'coconut oil', 'vco'],
  rubber:       ['latex', 'elastomer', 'vulcanization'],
  // ── Energy ────────────────────────────────────────────────
  solar:        ['photovoltaic', 'pv', 'renewable', 'sunlight', 'photovoltaics'],
  wind:         ['turbine', 'wind energy', 'wind power'],
  battery:      ['energy storage', 'lithium', 'electrochemical', 'cell'],
  biofuel:      ['biodiesel', 'bioethanol', 'biomass', 'biogas', 'bioenergy'],
  // ── Water & Environment ───────────────────────────────────
  water:        ['purification', 'filtration', 'wastewater', 'desalination', 'effluent', 'treatment'],
  waste:        ['recycling', 'upcycling', 'landfill', 'composting', 'bioremediation'],
  pollution:    ['contaminant', 'toxin', 'remediation', 'effluent', 'emission'],
  // ── Bio & Biotech ─────────────────────────────────────────
  bio:          ['biological', 'microbe', 'microbial', 'bacteria', 'enzyme', 'fermentation', 'bioreactor'],
  biomarker:    ['diagnostic marker', 'biosensor', 'detection', 'assay'],
  protein:      ['peptide', 'amino acid', 'proteomic', 'enzyme'],
  // ── Food ──────────────────────────────────────────────────
  food:         ['nutrition', 'nutraceutical', 'probiotic', 'prebiotic', 'processing', 'preservation'],
  packaging:    ['container', 'film', 'biodegradable', 'shelf life'],
  // ── Digital / Tech ────────────────────────────────────────
  ai:           ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'ml'],
  iot:          ['internet of things', 'sensor', 'embedded', 'telemetry', 'smart'],
  drone:        ['uav', 'unmanned aerial', 'autonomous aerial'],
  blockchain:   ['distributed ledger', 'decentralized', 'smart contract'],
  // ── Materials ─────────────────────────────────────────────
  nanoparticle: ['nanomaterial', 'nanotech', 'nano', 'quantum dot'],
  polymer:      ['plastic', 'composite', 'resin', 'bioplastic'],
};

// ─────────────────────────────────────────────────────────────
// MATCH TYPE (for result transparency)
// ─────────────────────────────────────────────────────────────
export type MatchType =
  | 'title'
  | 'keyword'
  | 'problem'
  | 'application'
  | 'type'
  | 'description'
  | 'institution'
  | 'sector'
  | 'synonym'
  | 'fuzzy';

export interface SearchMatch {
  score: number;
  matchTypes: MatchType[];
  matchedTerms: string[];
}

export interface ScoredItem extends SearchIndexItem {
  _search: SearchMatch;
}

// ─────────────────────────────────────────────────────────────
// TEXT NORMALIZATION
// ─────────────────────────────────────────────────────────────
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')  // strip punctuation
    .replace(/\s+/g, ' ')           // collapse spaces
    .trim();
}

/** Returns both spaced and joined forms for compound-word matching.
 *  e.g. "waste water" → ["waste water", "wastewater"] */
function forms(s: string): string[] {
  const n = normalizeText(s);
  return [n, n.replace(/\s+/g, '')];
}

// ─────────────────────────────────────────────────────────────
// SYNONYM EXPANSION
// Returns all synonyms for every token in the query.
// ─────────────────────────────────────────────────────────────
export function expandQuery(query: string): string[] {
  const norm = normalizeText(query);
  const tokens = norm.split(' ').filter(Boolean);
  const expanded = new Set<string>([norm]);

  for (const token of tokens) {
    if (SYNONYMS[token]) {
      for (const syn of SYNONYMS[token]) {
        expanded.add(normalizeText(syn));
      }
    }
    // Also check if the query itself is a synonym value → find its key
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (syns.some(s => normalizeText(s) === token)) {
        expanded.add(key);
      }
    }
  }

  return Array.from(expanded);
}

// ─────────────────────────────────────────────────────────────
// EXACT FIELD SCORING
// Returns score 0–100 for a single technology against a query.
// Does NOT use synonyms (called first, pure exact matching).
// ─────────────────────────────────────────────────────────────
function scoreExact(item: SearchIndexItem, queryForms: string[]): { score: number; matchTypes: MatchType[]; matchedTerms: string[] } {
  let rawScore = 0;
  const matchTypes: MatchType[] = [];
  const matchedTerms: string[] = [];

  const hits = (field: string, weight: number, type: MatchType) => {
    if (!field) return;
    const fieldForms = forms(field);
    for (const q of queryForms) {
      if (fieldForms.some(f => f.includes(q) || q.includes(f.slice(0, Math.max(f.length - 2, 3))))) {
        rawScore += weight;
        if (!matchTypes.includes(type)) matchTypes.push(type);
        matchedTerms.push(q);
        break;
      }
    }
  };

  const hitsArr = (fields: string[], weight: number, type: MatchType) => {
    for (const field of fields) hits(field, weight, type);
  };

  hits(item.name,           WEIGHTS.name,           'title');
  hitsArr(item.keywords,    WEIGHTS.keywords,        'keyword');
  hits(item.problem_solved, WEIGHTS.problem_solved,  'problem');
  hitsArr(item.applications,WEIGHTS.applications,    'application');
  hits(item.technology_type,WEIGHTS.technology_type, 'type');
  hits(item.description,    WEIGHTS.description,     'description');
  hits(item.institution,    WEIGHTS.institution,     'institution');
  hits(item.sector,         WEIGHTS.sector,          'sector');

  // Normalize to 0–100 scale based on max possible score
  const maxPossible = WEIGHTS.name + WEIGHTS.keywords + WEIGHTS.problem_solved + WEIGHTS.applications + WEIGHTS.technology_type + WEIGHTS.description + WEIGHTS.institution + WEIGHTS.sector;
  const score = Math.min(100, Math.round((rawScore / maxPossible) * 100));

  return { score, matchTypes, matchedTerms: [...new Set(matchedTerms)] };
}

// ─────────────────────────────────────────────────────────────
// FUSE.JS FUZZY INDEX (memoized, built once per session)
// ─────────────────────────────────────────────────────────────
let _fuseInstance: Fuse<SearchIndexItem> | null = null;
let _fuseItems: SearchIndexItem[] = [];

function getFuseInstance(items: SearchIndexItem[]): Fuse<SearchIndexItem> {
  // Rebuild only if dataset changed
  if (_fuseInstance && _fuseItems === items) return _fuseInstance;

  _fuseItems = items;
  _fuseInstance = new Fuse(items, {
    // Conservative threshold — typo correction ONLY, not semantic expansion
    threshold: 0.30,
    ignoreLocation: true,
    minMatchCharLength: 3,
    includeScore: true,
    keys: [
      { name: 'name',           weight: WEIGHTS.name },
      { name: 'keywords',       weight: WEIGHTS.keywords },
      { name: 'problem_solved', weight: WEIGHTS.problem_solved },
      { name: 'applications',   weight: WEIGHTS.applications },
      { name: 'technology_type',weight: WEIGHTS.technology_type },
      { name: 'description',    weight: WEIGHTS.description },
      { name: 'institution',    weight: WEIGHTS.institution },
      { name: 'sector',         weight: WEIGHTS.sector },
    ],
  });

  return _fuseInstance;
}

// ─────────────────────────────────────────────────────────────
// MAIN HYBRID SEARCH
// Returns { primary, related } with scores attached.
// ─────────────────────────────────────────────────────────────
export interface HybridSearchResult {
  primary: ScoredItem[];
  related: ScoredItem[];
  queryInfo: {
    normalized: string;
    synonymsUsed: string[];
    matchMode: 'exact' | 'fuzzy' | 'synonym' | 'none';
  };
}

export function hybridSearch(
  items: SearchIndexItem[],
  rawQuery: string,
  mode: 'keyword' | 'hybrid' | 'semantic' = 'hybrid'
): HybridSearchResult {
  const normalized = normalizeText(rawQuery);

  if (!normalized || normalized.length < 2) {
    return { primary: [], related: [], queryInfo: { normalized, synonymsUsed: [], matchMode: 'none' } };
  }

  const qForms = forms(normalized);

  // ── PASS 1: Exact matching ───────────────────────────────
  const exactScored: ScoredItem[] = items
    .map(item => {
      const { score, matchTypes, matchedTerms } = scoreExact(item, qForms);
      return { ...item, _search: { score, matchTypes, matchedTerms } };
    })
    .filter(item => item._search.score >= SCORE_RELATED);

  if (exactScored.length > 0) {
    const primary = exactScored
      .filter(i => i._search.score >= SCORE_PRIMARY)
      .sort((a, b) => b._search.score - a._search.score);
    const related = exactScored
      .filter(i => i._search.score < SCORE_PRIMARY)
      .sort((a, b) => b._search.score - a._search.score);

    return {
      primary,
      related,
      queryInfo: { normalized, synonymsUsed: [], matchMode: 'exact' },
    };
  }

  // ── PASS 2: Conservative fuzzy (typo correction) ─────────
  if (mode !== 'keyword') {
    const fuse = getFuseInstance(items);
    const fuseResults = fuse.search(normalized);

    const fuzzyScored: ScoredItem[] = fuseResults
      .filter(r => r.score !== undefined && r.score <= 0.6) // Fuse score is inverse (0=perfect)
      .map(r => {
        // Convert Fuse's 0–1 inverse score to our 0–100 scale
        const convertedScore = Math.round((1 - (r.score ?? 1)) * 100);
        return {
          ...r.item,
          _search: {
            score: convertedScore,
            matchTypes: ['fuzzy' as MatchType],
            matchedTerms: [normalized],
          },
        };
      })
      .filter(i => i._search.score >= SCORE_RELATED);

    if (fuzzyScored.length > 0) {
      const primary = fuzzyScored
        .filter(i => i._search.score >= SCORE_PRIMARY)
        .sort((a, b) => b._search.score - a._search.score);
      const related = fuzzyScored
        .filter(i => i._search.score < SCORE_PRIMARY)
        .sort((a, b) => b._search.score - a._search.score);

      return {
        primary,
        related,
        queryInfo: { normalized, synonymsUsed: [], matchMode: 'fuzzy' },
      };
    }
  }

  // ── PASS 3: Synonym expansion (last resort) ───────────────
  const synonymTerms = expandQuery(normalized).filter(t => t !== normalized);

  if (synonymTerms.length > 0) {
    const synForms = synonymTerms.flatMap(t => forms(t));
    const synScored: ScoredItem[] = items
      .map(item => {
        const { score, matchTypes, matchedTerms } = scoreExact(item, synForms);
        // Penalize synonym matches by 20 points to rank below exact
        const penalizedScore = Math.max(0, score - 20);
        return {
          ...item,
          _search: {
            score: penalizedScore,
            matchTypes: matchTypes.map(() => 'synonym' as MatchType),
            matchedTerms,
          },
        };
      })
      .filter(item => item._search.score >= SCORE_RELATED);

    if (synScored.length > 0) {
      return {
        primary: [],
        related: synScored.sort((a, b) => b._search.score - a._search.score),
        queryInfo: { normalized, synonymsUsed: synonymTerms, matchMode: 'synonym' },
      };
    }
  }

  // ── No results ────────────────────────────────────────────
  return {
    primary: [],
    related: [],
    queryInfo: { normalized, synonymsUsed: [], matchMode: 'none' },
  };
}

// ─────────────────────────────────────────────────────────────
// AUTOCOMPLETE (fast path — no Fuse.js, pure includes/startsWith)
// Used by SearchBar for instant suggestions while typing.
// ─────────────────────────────────────────────────────────────
export interface AutocompleteSuggestion {
  id: string;
  name: string;
  institution: string;
  sector: string;
  matchSource: 'name' | 'institution' | 'sector';
}

export function getAutocompleteSuggestions(
  items: SearchIndexItem[],
  rawQuery: string,
  limit = 8
): AutocompleteSuggestion[] {
  const q = rawQuery.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const seen = new Set<string>();
  const results: AutocompleteSuggestion[] = [];

  // Priority: startsWith name > includes name > institution > sector
  const add = (item: SearchIndexItem, src: 'name' | 'institution' | 'sector') => {
    if (seen.has(item.id) || results.length >= limit) return;
    seen.add(item.id);
    results.push({ id: item.id, name: item.name, institution: item.institution, sector: item.sector, matchSource: src });
  };

  // 1. Name starts with query
  for (const item of items) {
    if (item.name.toLowerCase().startsWith(q)) add(item, 'name');
    if (results.length >= limit) return results;
  }
  // 2. Name includes query
  for (const item of items) {
    if (item.name.toLowerCase().includes(q) && !seen.has(item.id)) add(item, 'name');
    if (results.length >= limit) return results;
  }
  // 3. Institution includes query
  for (const item of items) {
    if (item.institution.toLowerCase().includes(q) && !seen.has(item.id)) add(item, 'institution');
    if (results.length >= limit) return results;
  }
  // 4. Sector includes query
  for (const item of items) {
    if (item.sector.toLowerCase().includes(q) && !seen.has(item.id)) add(item, 'sector');
    if (results.length >= limit) return results;
  }

  return results;
}
