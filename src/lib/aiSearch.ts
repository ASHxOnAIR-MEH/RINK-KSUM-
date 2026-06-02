// ============================================================
// RINK Technology Explorer — Smart Search Engine
// Zero hallucination: only returns technologies from the DB.
// Strict relevance threshold — low confidence = no results.
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

// ── Minimum token length (prevents "ca" matching "cassava") ──
const MIN_TOKEN_LEN = 4;

// ── Minimum score to show a result (prevents false positives) ─
const MIN_SCORE_THRESHOLD = 30;

// ── Common stop words ─────────────────────────────────────────
const STOP_WORDS = new Set([
  'want', 'need', 'show', 'find', 'get', 'give', 'tell', 'help',
  'suggest', 'recommend', 'please', 'looking', 'search', 'display',
  'related', 'using', 'about', 'with', 'from', 'that', 'this',
  'what', 'which', 'where', 'when', 'available', 'based',
  'into', 'like', 'some', 'any', 'all', 'will', 'would',
  'could', 'should', 'have', 'been', 'being', 'does', 'more',
  'technology', 'technologies', 'innovation', 'innovations',
  'startup', 'startups', 'opportunities', 'business', 'venture',
  'start', 'build', 'launch', 'create', 'establish', 'open',
  'make', 'develop', 'produce', 'manufacture',
]);

// ── Startup intent patterns ───────────────────────────────────
const STARTUP_PATTERNS = [
  /i want to start/i, /i want to build/i, /i want to launch/i,
  /starting a/i, /build a/i, /launch a/i, /open a/i,
  /i am looking for/i, /looking for/i, /show me/i,
  /find me/i, /suggest/i, /recommend/i,
];

// ── Extract TRL filter from query ─────────────────────────────
function extractTRLFilter(q: string): number | null {
  const m = q.match(/trl\s*(\d+)/i) || q.match(/readiness level\s*(\d+)/i);
  if (m) return parseInt(m[1]);
  if (/trl\s*[78]\s*(and|or|&|\+)?\s*above/i.test(q)) return 7;
  if (/trl\s*9/i.test(q)) return 9;
  return null;
}

// ── Tokenise: min length + stop word removal ──────────────────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= MIN_TOKEN_LEN && !STOP_WORDS.has(t));
}

// ── Strict field match: whole-word or significant substring ───
// Returns match count. Requires token >= 4 chars AND actual
// containment to prevent "cancer" → "cassava" (ca = partial).
function strictFieldScore(fieldText: string, tokens: string[]): number {
  if (!fieldText || tokens.length === 0) return 0;
  const lower = fieldText.toLowerCase();
  let hits = 0;
  for (const tok of tokens) {
    // Require the token to appear as a whole word OR as a
    // substantial match (token >= 5 chars AND contained).
    const wordBoundary = new RegExp(`\\b${tok}`, 'i');
    if (wordBoundary.test(lower)) {
      hits++;
    } else if (tok.length >= 5 && lower.includes(tok)) {
      // Partial match only for longer tokens
      hits += 0.5;
    }
  }
  return hits;
}

function strictArrayScore(arr: string[], tokens: string[]): number {
  if (!arr || arr.length === 0) return 0;
  return strictFieldScore(arr.join(' '), tokens);
}

// ── Detect startup intent ─────────────────────────────────────
function detectStartupIntent(query: string): boolean {
  return STARTUP_PATTERNS.some(p => p.test(query));
}

// ── Build user-facing response message ───────────────────────
function buildMessage(
  query: string,
  count: number,
  isStartup: boolean,
  trlFilter: number | null,
  patentFilter: boolean,
): string {
  if (count === 0) {
    return `No relevant technologies found in the current database for **"${query}"**. Try a different term or browse by sector.`;
  }
  if (patentFilter) return `Found **${count} patented technolog${count === 1 ? 'y' : 'ies'}** in the RINK database:`;
  if (trlFilter !== null) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** with TRL ${trlFilter}+:`;
  if (isStartup) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** relevant to your startup idea:`;
  return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** matching your search:`;
}

// ── Main search function ──────────────────────────────────────
export function runAISearch(query: string, technologies: Technology[]): AISearchResponse {
  const q = query.trim();
  const tokens = tokenise(q);

  const isStartup = detectStartupIntent(q);
  const trlFilter = extractTRLFilter(q);
  const patentFilter = /patent/i.test(q);
  const commercialFilter = /commercial|market.?ready|trl\s*[89]/i.test(q);

  // If no meaningful tokens after filtering, return empty
  if (tokens.length === 0) {
    return {
      results: [],
      query: q,
      intent: 'empty',
      responseMessage: `Please describe your startup idea or the technology you are looking for.`,
      totalFound: 0,
    };
  }

  const scored: AISearchResult[] = [];

  for (const tech of technologies) {
    // ── Hard filters ──────────────────────────────────────────
    if (patentFilter) {
      const ps = tech.patent_status.toLowerCase();
      if (!ps.includes('patent') || ps.includes('not patent') || ps === 'not specified') continue;
    }
    if (trlFilter !== null) {
      const trlNum = parseInt(tech.trl?.replace(/[^0-9]/g, '') || '0');
      if (isNaN(trlNum) || trlNum < trlFilter) continue;
    }
    if (commercialFilter && !patentFilter && trlFilter === null) {
      const trlNum = parseInt(tech.trl?.replace(/[^0-9]/g, '') || '0');
      if (!isNaN(trlNum) && trlNum > 0 && trlNum < 7) continue;
    }

    let score = 0;
    const matchedOn: string[] = [];

    // Technology Name — HIGHEST weight (exact match gets huge boost)
    const nameS = strictFieldScore(tech.name, tokens);
    if (nameS > 0) {
      score += nameS * 120;
      matchedOn.push('name');
      // Bonus: if ALL tokens match in name → very high confidence
      if (nameS >= tokens.length * 0.8) score += 50;
    }

    // Keywords — 2nd priority
    const kwS = strictArrayScore(tech.keywords, tokens);
    if (kwS > 0) { score += kwS * 80; matchedOn.push('keywords'); }

    // Problem Solved — 3rd priority
    const probS = strictFieldScore(tech.problem_solved, tokens);
    if (probS > 0) { score += probS * 50; matchedOn.push('problem_solved'); }

    // Applications — 4th priority
    const appS = strictArrayScore(tech.applications, tokens);
    if (appS > 0) { score += appS * 45; matchedOn.push('applications'); }

    // Sector — medium weight
    const secS = strictFieldScore(tech.sector, tokens);
    if (secS > 0) { score += secS * 60; matchedOn.push('sector'); }

    // Institution — medium weight
    const instS = strictFieldScore(tech.institution, tokens);
    if (instS > 0) { score += instS * 65; matchedOn.push('institution'); }

    // Technology type — lower weight
    const typeS = strictFieldScore(tech.technology_type, tokens);
    if (typeS > 0) { score += typeS * 35; matchedOn.push('technology_type'); }

    // Description — lowest weight (avoid over-matching)
    const descS = strictFieldScore(tech.description, tokens);
    if (descS > 0) { score += descS * 20; matchedOn.push('description'); }

    // ── Apply minimum confidence threshold ──────────────────
    if (score >= MIN_SCORE_THRESHOLD) {
      scored.push({ technology: tech, score, matchedOn });
    }
  }

  // Sort by score and cap at 8
  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);

  let intent = 'search';
  if (isStartup) intent = 'startup';
  else if (patentFilter) intent = 'patent';
  else if (trlFilter !== null) intent = 'trl';
  else if (commercialFilter) intent = 'commercial';

  return {
    results: sorted,
    query: q,
    intent,
    responseMessage: buildMessage(q, sorted.length, isStartup, trlFilter, patentFilter),
    totalFound: sorted.length,
  };
}
