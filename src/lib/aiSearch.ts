// ============================================================
// RINK Technology Explorer — Smart Search Engine v2
// - Intent detection (greetings, small talk, help, search)
// - Priority-ranked scoring: exact name > exact field > partial
// - Hard score threshold prevents false positives
// - Zero hallucination: only real DB records returned
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
  intent: ConversationIntent;
  responseMessage: string;
  totalFound: number;
}

// ── Intent classification ────────────────────────────────────
export type ConversationIntent =
  | 'greeting'
  | 'smalltalk'
  | 'who_are_you'
  | 'help'
  | 'thanks'
  | 'search'
  | 'startup'
  | 'patent'
  | 'trl'
  | 'commercial'
  | 'empty';

// ── Intent detection rules ───────────────────────────────────
const GREETING_PATTERNS = [
  /^hi+\s*[!?.]*$/i, /^hey+\s*[!?.]*$/i, /^hello+\s*[!?.]*$/i,
  /^good\s*(morning|afternoon|evening|day)\s*[!?.]*$/i,
  /^greetings\s*[!?.]*$/i, /^howdy\s*[!?.]*$/i,
  /^sup\s*[!?.]*$/i, /^yo\s*[!?.]*$/i,
];

const SMALLTALK_PATTERNS = [
  /how are you/i, /how r u/i, /how do you do/i,
  /what('?s| is) up/i, /wassup/i, /you good/i,
  /are you (ok|okay|fine|well|there)/i,
];

const WHO_ARE_YOU_PATTERNS = [
  /who are you/i, /what are you/i, /introduce yourself/i,
  /tell me about yourself/i, /what (can|do) you do/i,
  /what('?s| is) your (name|purpose|role)/i, /about (rink|this)/i,
  /how (does this|do you) work/i,
];

const HELP_PATTERNS = [
  /^help\s*[!?.]*$/i, /how (to|can i) (use|search|find|discover)/i,
  /what (should i|can i) (ask|search|type)/i,
  /give me (an )?(example|hint|tip)/i,
  /how does (this|search|it) work/i,
  /what (kind of|types of) (questions|queries)/i,
];

const THANKS_PATTERNS = [
  /^thanks?\s*[!?.]*$/i, /^thank you\s*[!?.]*$/i,
  /^thx\s*[!?.]*$/i, /^ty\s*[!?.]*$/i,
  /^cheers?\s*[!?.]*$/i, /^great\s*[!?.]*$/i,
  /^awesome\s*[!?.]*$/i, /^perfect\s*[!?.]*$/i,
  /^cool\s*[!?.]*$/i, /^nice\s*[!?.]*$/i,
];

export function classifyIntent(query: string): ConversationIntent {
  const q = query.trim();
  if (!q) return 'empty';
  if (GREETING_PATTERNS.some(p => p.test(q))) return 'greeting';
  if (SMALLTALK_PATTERNS.some(p => p.test(q))) return 'smalltalk';
  if (WHO_ARE_YOU_PATTERNS.some(p => p.test(q))) return 'who_are_you';
  if (HELP_PATTERNS.some(p => p.test(q))) return 'help';
  if (THANKS_PATTERNS.some(p => p.test(q))) return 'thanks';
  return 'search'; // Default — run database search
}

// ── Conversational responses (no DB search) ──────────────────
export function getConversationalResponse(intent: ConversationIntent, query: string): AISearchResponse {
  const messages: Record<ConversationIntent, string> = {
    greeting:
      `Hello! Welcome to **RINK Technology Explorer**.\n\nI'm the RINK Discovery Assistant. I help founders, startups, MSMEs, researchers and innovators discover technologies from Kerala's leading research institutions.\n\nWhat startup idea or technology area would you like to explore today?`,

    smalltalk:
      `I'm doing well, thank you!\n\nI'm here to help you discover technologies available for commercialization through Kerala's research ecosystem.\n\nWhat area would you like to explore? You can describe a startup idea, an industry, or a problem you're trying to solve.`,

    who_are_you:
      `I'm the **RINK Discovery Assistant**.\n\nI help users discover technologies developed by Kerala's leading research institutions — and connect with RINK for technology transfer and commercialization opportunities.\n\nTry asking me something like:\n- *"Show me water purification technologies"*\n- *"I want to start a food processing business"*\n- *"Find agriculture startup opportunities"*`,

    help:
      `Here's how to get the best results:\n\n**Describe your startup idea:**\n→ *"I want to start a coconut processing business"*\n\n**Search by industry:**\n→ *"Agriculture technologies"*\n→ *"Solar energy innovations"*\n\n**Search by problem:**\n→ *"Water purification"*\n→ *"Cancer detection"*\n\n**Filter by type:**\n→ *"Patented technologies"*\n→ *"TRL 7 and above"*\n\nWhat would you like to discover today?`,

    thanks:
      `You're welcome!\n\nFeel free to describe a startup idea, challenge, or industry and I'll help you discover relevant technologies from the RINK database.`,

    empty:
      `Please describe your startup idea or the technology area you're interested in, and I'll search the RINK database for you.`,

    // These won't be used for conversational responses, but need to be defined
    search: '',
    startup: '',
    patent: '',
    trl: '',
    commercial: '',
  };

  return {
    results: [],
    query,
    intent,
    responseMessage: messages[intent] || messages.empty,
    totalFound: 0,
  };
}

// ── Minimum score threshold (prevents false positives) ───────
// Raised from 30 to 50 to require stronger matches
const MIN_SCORE_THRESHOLD = 50;

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
  'also', 'very', 'just', 'most', 'best', 'good', 'great',
]);

// ── Minimum token length (prevents "ca" matching "cassava") ──
const MIN_TOKEN_LEN = 4;

// ── Tokenise: lowercase, remove punctuation, filter stops ────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= MIN_TOKEN_LEN && !STOP_WORDS.has(t));
}

// ── Extract TRL filter ────────────────────────────────────────
function extractTRLFilter(q: string): number | null {
  const m = q.match(/trl\s*(\d+)/i) || q.match(/readiness level\s*(\d+)/i);
  if (m) return parseInt(m[1]);
  if (/trl\s*[78]\s*(and|or|&|\+)?\s*above/i.test(q)) return 7;
  if (/trl\s*9/i.test(q)) return 9;
  return null;
}

// ── Startup intent patterns ───────────────────────────────────
function detectStartupIntent(query: string): boolean {
  return /i want to start|i want to build|i want to launch|starting a|build a|launch a|open a|i am looking for|looking for|show me|find me|suggest|recommend/i.test(query);
}

// ──────────────────────────────────────────────────────────────
// FIELD SCORING
// Priority 1: Exact phrase match (highest score)
// Priority 2: All tokens present (high score)
// Priority 3: Most tokens present (medium score)
// Priority 4: Word-boundary match (lower score)
// Priority 5: Substring match for longer tokens only (lowest)
// ──────────────────────────────────────────────────────────────

function scoreField(fieldText: string, rawQuery: string, tokens: string[], weight: number): number {
  if (!fieldText || !fieldText.trim()) return 0;
  const lower = fieldText.toLowerCase();
  const queryLower = rawQuery.toLowerCase().trim();

  let score = 0;

  // P1 — Exact phrase match in field (very high confidence)
  if (queryLower.length >= 3 && lower.includes(queryLower)) {
    score += weight * 3.0;
    return score; // No need to check further
  }

  // P2 & P3 — Token-level matching
  let hits = 0;
  let partialHits = 0;

  for (const tok of tokens) {
    // Word-boundary match
    const wb = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (wb.test(lower)) {
      hits++;
    } else if (tok.length >= 5 && lower.includes(tok)) {
      // Substring match only for tokens >= 5 chars
      partialHits++;
    }
  }

  if (tokens.length === 0) return 0;

  const hitRatio = hits / tokens.length;
  const partialRatio = partialHits / tokens.length;

  // P2 — All tokens match = high confidence
  if (hitRatio >= 1.0) {
    score += weight * 2.0;
  }
  // P3 — Most tokens match (>= 75%)
  else if (hitRatio >= 0.75) {
    score += weight * hitRatio * 1.5;
  }
  // P4 — Partial word-boundary matches
  else if (hitRatio > 0) {
    score += weight * hitRatio * 1.0;
  }

  // P5 — Substring-only matches (penalised)
  if (partialHits > 0) {
    score += weight * partialRatio * 0.4;
  }

  return score;
}

function scoreArrayField(arr: string[], rawQuery: string, tokens: string[], weight: number): number {
  if (!arr || arr.length === 0) return 0;
  return scoreField(arr.join(' '), rawQuery, tokens, weight);
}

// ── Build response message ────────────────────────────────────
function buildMessage(
  query: string,
  count: number,
  isStartup: boolean,
  trlFilter: number | null,
  patentFilter: boolean,
): string {
  if (count === 0) {
    return `No closely matching technologies found in the RINK database for **"${query}"**.\n\nTry a more specific keyword, or browse by sector to explore all available technologies.`;
  }
  if (patentFilter) return `Found **${count} patented technolog${count === 1 ? 'y' : 'ies'}** in the RINK database:`;
  if (trlFilter !== null) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** with TRL ${trlFilter}+:`;
  if (isStartup) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** relevant to your startup idea:`;
  return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** matching **"${query}"**:`;
}

// ── Main search function ──────────────────────────────────────
export function runAISearch(query: string, technologies: Technology[]): AISearchResponse {
  const q = query.trim();

  // ── Step 1: Intent classification ───────────────────────────
  const intent = classifyIntent(q);

  // ── Step 2: If conversational, return without DB search ─────
  if (intent !== 'search') {
    return getConversationalResponse(intent, q);
  }

  // ── Step 3: Tokenise for DB search ──────────────────────────
  const tokens = tokenise(q);
  const isStartup = detectStartupIntent(q);
  const trlFilter = extractTRLFilter(q);
  const patentFilter = /patent/i.test(q);
  const commercialFilter = /commercial|market.?ready|trl\s*[89]/i.test(q);

  // No meaningful search tokens
  if (tokens.length === 0) {
    return {
      results: [],
      query: q,
      intent: 'empty',
      responseMessage: `Please describe your startup idea or the technology you are looking for.`,
      totalFound: 0,
    };
  }

  // ── Step 4: Score all technologies ──────────────────────────
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

    // ── Field scoring (priority-weighted) ──────────────────

    // 1. Technology Name — Highest weight. Exact name match = massive boost.
    const nameScore = scoreField(tech.name, q, tokens, 100);
    if (nameScore > 0) { score += nameScore; matchedOn.push('name'); }

    // 2. Keywords — 2nd priority
    const kwScore = scoreArrayField(tech.keywords, q, tokens, 70);
    if (kwScore > 0) { score += kwScore; matchedOn.push('keywords'); }

    // 3. Problem Solved — 3rd priority
    const probScore = scoreField(tech.problem_solved, q, tokens, 55);
    if (probScore > 0) { score += probScore; matchedOn.push('problem_solved'); }

    // 4. Applications — 4th priority
    const appScore = scoreArrayField(tech.applications, q, tokens, 50);
    if (appScore > 0) { score += appScore; matchedOn.push('applications'); }

    // 5. Sector — medium weight
    const secScore = scoreField(tech.sector, q, tokens, 60);
    if (secScore > 0) { score += secScore; matchedOn.push('sector'); }

    // 6. Institution — medium weight
    const instScore = scoreField(tech.institution, q, tokens, 55);
    if (instScore > 0) { score += instScore; matchedOn.push('institution'); }

    // 7. Technology Type — lower weight
    const typeScore = scoreField(tech.technology_type, q, tokens, 40);
    if (typeScore > 0) { score += typeScore; matchedOn.push('technology_type'); }

    // 8. Description — lowest weight (broad field, avoid over-matching)
    const descScore = scoreField(tech.description, q, tokens, 15);
    if (descScore > 0) { score += descScore; matchedOn.push('description'); }

    // ── Bonus: single strong name match always clears threshold ─
    // This ensures "coconut" always returns coconut technologies
    const nameLower = tech.name.toLowerCase();
    const qLower = q.toLowerCase();
    if (tokens.some(tok => tok.length >= 4 && nameLower.includes(tok))) {
      score += 30; // Name-hit bonus ensures threshold is cleared
    }

    // ── Apply threshold ───────────────────────────────────────
    if (score >= MIN_SCORE_THRESHOLD) {
      scored.push({ technology: tech, score, matchedOn });
    }
  }

  // Sort by score descending, cap at 8 results
  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);

  let finalIntent: ConversationIntent = 'search';
  if (isStartup) finalIntent = 'startup';
  else if (patentFilter) finalIntent = 'patent';
  else if (trlFilter !== null) finalIntent = 'trl';
  else if (commercialFilter) finalIntent = 'commercial';

  return {
    results: sorted,
    query: q,
    intent: finalIntent,
    responseMessage: buildMessage(q, sorted.length, isStartup, trlFilter, patentFilter),
    totalFound: sorted.length,
  };
}
