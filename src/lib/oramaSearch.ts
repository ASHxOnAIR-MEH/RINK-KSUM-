// ============================================================
// RINK Technology Transfer Portal — Orama Search Engine
// High-performance full-text search with typo tolerance
// Replaces Gemini as primary search. Google Sheet remains source of truth.
// ============================================================

import { create, insert, search } from '@orama/orama';
import { Technology } from '@/types';
import { fetchAllTechnologies } from '@/lib/sheets';

// ── Orama schema ─────────────────────────────────────────────
const SCHEMA = {
  technology_id: 'string' as const,
  technology_name: 'string' as const,
  institution: 'string' as const,
  primary_sector: 'string' as const,
  secondary_sector: 'string' as const,
  technology_type: 'string' as const,
  problem_solved: 'string' as const,
  description: 'string' as const,
  applications: 'string' as const,
  startup_potential: 'string' as const,
  keywords: 'string' as const,
  trl: 'string' as const,
  patent_status: 'string' as const,
  ip_status: 'string' as const,
};

// ── Normalization ────────────────────────────────────────────
function normalizeText(text: string): string {
  if (!text) return '';
  // 1 & 2. Lowercase / ignore capitalization
  let normalized = text.toLowerCase();
  // 3 & 4. Ignore punctuation & hyphens (replace with space)
  normalized = normalized.replace(/[^\w\s]/g, ' ');
  // 5. Ignore multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // 6. Treat compound words and spaced words as equivalent
  // Append joined variations directly to the index text
  const words = normalized.split(' ');
  const joinedPairs = [];
  for (let i = 0; i < words.length - 1; i++) {
    joinedPairs.push(words[i] + words[i + 1]);
  }
  const fullyJoined = words.join('');

  // Example: "waste water management" -> "waste water management wastewater watermanagement wastewatermanagement"
  return `${normalized} ${joinedPairs.join(' ')} ${fullyJoined}`.trim();
}

// ── Singleton index ──────────────────────────────────────────
let _oramaDB: Awaited<ReturnType<typeof create>> | null = null;
let _indexedTechs: Technology[] = [];
let _indexTs = 0;
const INDEX_TTL = 60 * 1000; // Rebuild every 60s (matches ISR)

async function getIndex() {
  if (_oramaDB && Date.now() - _indexTs < INDEX_TTL) {
    return { db: _oramaDB, techs: _indexedTechs };
  }

  const techs = await fetchAllTechnologies();

  const db = await create({
    schema: SCHEMA,
  });

  for (const tech of techs) {
    await insert(db, {
      technology_id: tech.id,
      technology_name: normalizeText(tech.name),
      institution: normalizeText(tech.institution),
      primary_sector: normalizeText(tech.sector),
      secondary_sector: '', // populated from secondary_sector if available
      technology_type: normalizeText(tech.technology_type),
      problem_solved: normalizeText(tech.problem_solved),
      description: normalizeText(tech.description),
      applications: normalizeText(tech.applications.join(', ')),
      startup_potential: normalizeText(tech.startup_potential),
      keywords: normalizeText(tech.keywords.join(', ')),
      trl: tech.trl,
      patent_status: tech.patent_status,
      ip_status: tech.ip_status,
    });
  }

  _oramaDB = db;
  _indexedTechs = techs;
  _indexTs = Date.now();

  console.log(`[RINK Orama] Indexed ${techs.length} technologies`);
  return { db, techs };
}

// ── Search interface ─────────────────────────────────────────
export interface OramaSearchResult {
  technology: Technology;
  score: number;
  highlight?: string;
}

export interface OramaSearchResponse {
  results: OramaSearchResult[];
  query: string;
  totalFound: number;
  elapsed: number; // milliseconds
}

// ── Main search function ─────────────────────────────────────
export async function oramaSearch(
  query: string,
  filters?: {
    sector?: string;
    institution?: string;
    type?: string;
    patent?: string;
    potential?: string;
  },
  limit = 20
): Promise<OramaSearchResponse> {
  const startTime = Date.now();
  const { db, techs } = await getIndex();
  const q = query.trim();

  if (!q) {
    // No query — return all techs (optionally filtered)
    let filtered = techs;
    if (filters?.sector) filtered = filtered.filter(t => t.sector_slug === filters.sector);
    if (filters?.institution) filtered = filtered.filter(t => t.institution_slug === filters.institution);
    if (filters?.type) filtered = filtered.filter(t => t.technology_type.toLowerCase() === filters.type!.toLowerCase());
    if (filters?.patent) filtered = filtered.filter(t => t.ip_status.toLowerCase() === filters.patent!.toLowerCase());
    if (filters?.potential) {
      if (filters.potential === 'featured') filtered = filtered.filter(t => t.featured);
      else if (filters.potential === 'non-featured') filtered = filtered.filter(t => !t.featured);
    }

    return {
      results: filtered.slice(0, limit).map(t => ({ technology: t, score: 1 })),
      query: q,
      totalFound: filtered.length,
      elapsed: Date.now() - startTime,
    };
  }

  // 1. Exact ID Match Override (Priority 1)
  const qLower = q.toLowerCase();
  const exactIdMatch = techs.find(t => t.id.toLowerCase() === qLower);
  if (exactIdMatch) {
    return {
      results: [{ technology: exactIdMatch, score: 1000 }],
      query: q,
      totalFound: 1,
      elapsed: Date.now() - startTime,
    };
  }

  // 2. Remove Stop Words and normalize query
  const STOP_WORDS = new Set(['the', 'and', 'for', 'of', 'with', 'using', 'based', 'system', 'method', 'technology']);
  const cleanTokens = q.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => !STOP_WORDS.has(w));

  const cleanQuery = cleanTokens.join(' ');
  const joinedQuery = cleanTokens.join(''); // e.g. "sea weed" -> "seaweed"

  // 3. Search Configuration with User-Defined Weights
  const searchConfig = {
    term: cleanQuery,
    boost: {
      technology_id: 100,
      technology_name: 90,
      keywords: 80,
      problem_solved: 70,
      description: 60,
      applications: 50,
      institution: 40,
      primary_sector: 35,
      technology_type: 30,
    },
    limit: 100,
  };

  // 4. First Pass: Exact Matches Only (Tolerance: 0)
  let oramaResults = await search(db, { ...searchConfig, tolerance: 0 });

  // 5. Concurrent Pass: if user typed multiple words, also search the joined version (e.g. "seaweed")
  if (cleanTokens.length > 1 && joinedQuery) {
    const joinedResults = await search(db, { ...searchConfig, term: joinedQuery, tolerance: 0 });
    
    // Merge hits safely (avoiding duplicates)
    const seen = new Set(oramaResults.hits.map(h => h.id));
    for (const hit of joinedResults.hits) {
      if (!seen.has(hit.id)) {
        oramaResults.hits.push(hit);
        seen.add(hit.id);
      }
    }
    // Sort combined hits by score descending
    oramaResults.hits.sort((a, b) => b.score - a.score);
  }

  // 6. Fallback Pass: Fuzzy Matching (Tolerance: 1) only if exact matches yield nothing
  if (oramaResults.hits.length === 0) {
    oramaResults = await search(db, { ...searchConfig, tolerance: 1 });
  }

  // Map Orama hits back to Technology objects
  let results: OramaSearchResult[] = [];
  for (const hit of oramaResults.hits) {
    const techId = (hit.document as { technology_id: string }).technology_id;
    const tech = techs.find(t => t.id === techId);
    if (tech) {
      results.push({ technology: tech, score: hit.score });
    }
  }

  // Apply filters on top of search results
  if (filters?.sector) results = results.filter(r => r.technology.sector_slug === filters.sector);
  if (filters?.institution) results = results.filter(r => r.technology.institution_slug === filters.institution);
  if (filters?.type) results = results.filter(r => r.technology.technology_type.toLowerCase() === filters.type!.toLowerCase());
  if (filters?.patent) results = results.filter(r => r.technology.ip_status.toLowerCase() === filters.patent!.toLowerCase());
  if (filters?.potential) {
    if (filters.potential === 'featured') results = results.filter(r => r.technology.featured);
    else if (filters.potential === 'non-featured') results = results.filter(r => !r.technology.featured);
  }

  return {
    results: results.slice(0, limit),
    query: q,
    totalFound: results.length,
    elapsed: Date.now() - startTime,
  };
}

// ── Conversational intent detection (preserved from old system) ──
const GREETING_PATTERNS = [
  /^hi+\s*[!?.]*$/i, /^hey+\s*[!?.]*$/i, /^hello+\s*[!?.]*$/i,
  /^good\s*(morning|afternoon|evening|day)\s*[!?.]*$/i,
  /^greetings\s*[!?.]*$/i, /^howdy\s*[!?.]*$/i,
  /^how are you/i, /^how r u/i,
  /^thanks?\s*[!?.]*$/i, /^thank you\s*[!?.]*$/i,
  /^thx\s*[!?.]*$/i, /^cheers?\s*[!?.]*$/i,
];

export function isConversational(query: string): boolean {
  return GREETING_PATTERNS.some(p => p.test(query.trim()));
}

export function getConversationalReply(query: string): string {
  const q = query.trim().toLowerCase();
  if (/^(hi|hey|hello|greetings|howdy)/i.test(q)) {
    return "Hello! I can help you discover technologies from Kerala's research institutions. Tell me about your idea, industry, challenge, or product concept.";
  }
  if (/^good\s*(morning|afternoon|evening|day)/i.test(q)) {
    return "Good day! What technology area would you like to explore? You can search by sector, institution, or describe your startup idea.";
  }
  if (/how are you|how r u/i.test(q)) {
    return "I'm doing well, thank you! I'm here to help you discover commercializable technologies. What area interests you?";
  }
  if (/thanks|thank you|thx|cheers/i.test(q)) {
    return "You're welcome! Feel free to search for more technologies anytime.";
  }
  return "I can help you discover technologies. Try searching by technology name, sector, institution, or describe what you're looking for.";
}
