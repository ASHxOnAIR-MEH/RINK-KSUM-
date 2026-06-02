// ============================================================
// RINK AI Discovery Engine
// Smart search + scoring — ZERO hallucination.
// Only recommends technologies that exist in the database.
// ============================================================

import { Technology } from '@/types';

export interface AISearchResult {
  technology: Technology;
  score: number;
  matchedOn: string[];
}

export interface AISearchResponse {
  results: AISearchResult[];
  query: string;
  intent: string;
  responseMessage: string;
  totalFound: number;
}

// ── Stop words to ignore during tokenisation ──────────────────
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
  'to', 'for', 'of', 'with', 'by', 'from', 'about', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can', 'want', 'need',
  'show', 'find', 'get', 'give', 'tell', 'help', 'suggest', 'recommend',
  'me', 'us', 'please', 'any', 'some', 'all', 'related', 'using', 'use',
  'technology', 'technologies', 'startup', 'startups', 'innovation',
  'innovations', 'available', 'based', 'like', 'into', 'this', 'that',
  'what', 'which', 'how', 'where', 'when', 'who',
]);

// ── Startup intent patterns ───────────────────────────────────
const STARTUP_PATTERNS = [
  /i want to start/i, /i want to build/i, /i want to launch/i,
  /i want to create/i, /starting a/i, /build a/i, /launch a/i,
  /create a/i, /establish a/i, /set up a/i, /open a/i,
  /business idea/i, /startup idea/i, /new venture/i,
];

// ── TRL extract ───────────────────────────────────────────────
function extractTRLFilter(q: string): number | null {
  const match = q.match(/trl\s*(\d+)/i) || q.match(/readiness level\s*(\d+)/i);
  if (match) return parseInt(match[1]);
  if (/trl\s*7\s*(and|or|&|\+)?\s*above/i.test(q)) return 7;
  if (/trl\s*8\s*(and|or|&|\+)?\s*above/i.test(q)) return 8;
  if (/trl\s*9/i.test(q)) return 9;
  return null;
}

// ── Tokenise query ────────────────────────────────────────────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

// ── Field text match score (0–1) ──────────────────────────────
function fieldScore(fieldText: string, tokens: string[]): number {
  if (!fieldText || tokens.length === 0) return 0;
  const lower = fieldText.toLowerCase();
  let hits = 0;
  for (const t of tokens) {
    if (lower.includes(t)) hits++;
  }
  return hits / tokens.length;
}

// ── Array field score ─────────────────────────────────────────
function arrayFieldScore(arr: string[], tokens: string[]): number {
  if (!arr || arr.length === 0) return 0;
  const combined = arr.join(' ').toLowerCase();
  return fieldScore(combined, tokens);
}

// ── Detect startup intent ─────────────────────────────────────
function detectStartupIntent(query: string): boolean {
  return STARTUP_PATTERNS.some(p => p.test(query));
}

// ── Generate friendly response message ───────────────────────
function buildResponseMessage(
  query: string,
  count: number,
  isStartup: boolean,
  trlFilter: number | null,
  patentFilter: boolean,
  commercialFilter: boolean,
): string {
  if (count === 0) {
    return `No matching technologies currently available in the RINK database for **"${query}"**. Try a broader search term or explore our sectors.`;
  }

  if (isStartup) {
    return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** from the RINK database that could power your startup idea:`;
  }
  if (patentFilter) {
    return `Found **${count} patented technolog${count === 1 ? 'y' : 'ies'}** in the RINK database:`;
  }
  if (trlFilter !== null) {
    return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** with TRL ${trlFilter}+:`;
  }
  if (commercialFilter) {
    return `Found **${count} commercially-ready technolog${count === 1 ? 'y' : 'ies'}** in the RINK database:`;
  }
  return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** matching your search:`;
}

// ── Main search function ──────────────────────────────────────
export function runAISearch(query: string, technologies: Technology[]): AISearchResponse {
  const q = query.trim();
  const tokens = tokenise(q);

  const isStartup = detectStartupIntent(q);
  const trlFilter = extractTRLFilter(q);
  const patentFilter = /patent/i.test(q);
  const commercialFilter = /commercial|ready to use|market.?ready|trl\s*[89]/i.test(q);

  const scored: AISearchResult[] = [];

  for (const tech of technologies) {
    // ── Hard filters ──────────────────────────────────────────
    if (patentFilter) {
      const ps = tech.patent_status.toLowerCase();
      if (!ps.includes('patent') || ps.includes('not') || ps.includes('no patent')) continue;
    }
    if (trlFilter !== null) {
      const trlNum = parseInt(tech.trl?.replace(/[^0-9]/g, '') || '0');
      if (isNaN(trlNum) || trlNum < trlFilter) continue;
    }
    if (commercialFilter && !patentFilter && trlFilter === null) {
      const trlNum = parseInt(tech.trl?.replace(/[^0-9]/g, '') || '0');
      if (isNaN(trlNum) || trlNum < 7) continue;
    }

    if (tokens.length === 0) {
      // Empty query after filtering = show all (won't happen in practice)
      scored.push({ technology: tech, score: 1, matchedOn: [] });
      continue;
    }

    let score = 0;
    const matchedOn: string[] = [];

    // Name — highest weight
    const nameS = fieldScore(tech.name, tokens);
    if (nameS > 0) { score += nameS * 100; matchedOn.push('name'); }

    // Keywords
    const kwS = arrayFieldScore(tech.keywords, tokens);
    if (kwS > 0) { score += kwS * 70; matchedOn.push('keywords'); }

    // Applications
    const appS = arrayFieldScore(tech.applications, tokens);
    if (appS > 0) { score += appS * 55; matchedOn.push('applications'); }

    // Problem solved
    const probS = fieldScore(tech.problem_solved, tokens);
    if (probS > 0) { score += probS * 45; matchedOn.push('problem_solved'); }

    // Description
    const descS = fieldScore(tech.description, tokens);
    if (descS > 0) { score += descS * 35; matchedOn.push('description'); }

    // Sector
    const secS = fieldScore(tech.sector, tokens);
    if (secS > 0) { score += secS * 60; matchedOn.push('sector'); }

    // Institution
    const instS = fieldScore(tech.institution, tokens);
    if (instS > 0) { score += instS * 65; matchedOn.push('institution'); }

    // Technology type
    const typeS = fieldScore(tech.technology_type, tokens);
    if (typeS > 0) { score += typeS * 40; matchedOn.push('technology_type'); }

    // Startup potential bonus
    if (tech.startup_potential === 'High') score += 12;
    else if (tech.startup_potential === 'Medium') score += 6;

    if (score > 0) {
      scored.push({ technology: tech, score, matchedOn });
    }
  }

  // Sort and cap at 8
  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);

  let intent = 'search';
  if (isStartup) intent = 'startup';
  else if (patentFilter) intent = 'patent';
  else if (trlFilter !== null) intent = 'trl';
  else if (commercialFilter) intent = 'commercial';

  const message = buildResponseMessage(q, sorted.length, isStartup, trlFilter, patentFilter, commercialFilter);

  return {
    results: sorted,
    query: q,
    intent,
    responseMessage: message,
    totalFound: sorted.length,
  };
}
