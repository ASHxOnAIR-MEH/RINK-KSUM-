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
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  let greetingMsg = `Hello! Welcome to the **RINK Technology Transfer Portal**.\n\nWhat startup idea or technology area are you exploring today?`;
  if (normalizedQuery === 'hi') {
    greetingMsg = 'Hello! What startup idea are you exploring today?';
  } else if (normalizedQuery === 'hello') {
    greetingMsg = 'Welcome to the RINK Technology Transfer Portal.';
  }

  const messages: Record<ConversationIntent, string> = {
    greeting: greetingMsg,

    smalltalk:
      `I'm doing well, thank you!\n\nI'm here to help you discover technologies available for commercialization through Kerala's research ecosystem.\n\nWhat area would you like to explore? You can describe a startup idea, an industry, or a problem you're trying to solve.`,

    who_are_you:
      `I am the **RINK Discovery Assistant**.\n\nI help entrepreneurs and founders discover commercializable technologies developed by Kerala's leading research institutions and turn deep-tech patents into startups.`,

    help:
      `Here's how to get the best results:\n\n**Describe your startup idea:**\n→ *"I want to start a coconut processing business"*\n\n**Search by industry:**\n→ *"Agriculture technologies"*\n\n**Search by problem:**\n→ *"Water purification"*\n\nWhat would you like to discover today?`,

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
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else',
  'to', 'for', 'of', 'in', 'on', 'at', 'by', 'from', 'with',
  'about', 'as', 'into', 'through', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
]);

// ── Generic modifier terms that should not be used as primary search hooks ──
const GENERIC_MODIFIERS = new Set([
  // Actions and processes
  'monitoring', 'monitor', 'monitors', 'system', 'systems', 'device', 'devices',
  'machine', 'machines', 'process', 'processes', 'processing', 'method', 'methods',
  'apparatus', 'equipment', 'tool', 'tools', 'instrument', 'instruments',
  'unit', 'units', 'solution', 'solutions', 'product', 'products', 'idea', 'ideas',
  'technology', 'technologies', 'innovation', 'innovations', 'opportunity', 'opportunities',
  'startup', 'startups', 'business', 'venture', 'technological', 'technique', 'techniques',
  'kit', 'kits', 'mechanism', 'mechanisms', 'concept', 'concepts', 'prototype', 'prototypes',
  
  // Detection and analysis
  'detection', 'detecting', 'detect', 'detector', 'detectors',
  'screening', 'screen', 'screens', 'diagnostic', 'diagnostics', 'diagnosis',
  'analysis', 'analyzing', 'analyze', 'analyzer', 'analyzers', 'estimation',
  'identification', 'identifying', 'identify', 'assessment', 'assessing',
  
  // Extraction and production
  'extraction', 'extracting', 'extract', 'extractor', 'extractors',
  'production', 'producing', 'produce', 'producer', 'producers',
  'cultivation', 'cultivating', 'cultivate',
  'harvesting', 'harvest', 'harvester', 'harvesters',
  'preservation', 'preserving', 'preserve', 'preservative',
  
  // Treatment and control
  'treatment', 'treating', 'treat',
  'purification', 'purifying', 'purifier', 'purifiers',
  'separation', 'separating', 'separate', 'separator', 'separators',
  'fabrication', 'fabricating', 'fabricate',
  'manufacturing', 'manufacture',
  'management', 'managing', 'manage',
  'control', 'controlling', 'control', 'controller', 'controllers',
  'generation', 'generating', 'generate', 'generator', 'generators',
  'conversion', 'converting', 'convert', 'converter', 'converters',
  'formulation', 'formulating', 'formulate', 'formula',
  
  // Quality and improvement
  'improvement', 'improving', 'improve',
  'enhancement', 'enhancing', 'enhance',
  'reduction', 'reducing', 'reduce',
  'prevention', 'preventing', 'prevent',
  'development', 'developing', 'develop',
  'application', 'applying', 'apply', 'applications',
  'utilization', 'utilizing', 'utilize'
]);

// ── Minimum token length (prevents "ca" matching "cassava") ──
const MIN_TOKEN_LEN = 3;

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
  const escapedQuery = queryLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // P1 — Exact full field match
  if (lower === queryLower) {
    return weight * 5.0;
  }

  // P2 — Exact phrase match with word boundaries (e.g., \bcontrol\b matches "pest control" but not "pest controller")
  const exactPhraseRegex = new RegExp(`\\b${escapedQuery}\\b`, 'i');
  if (exactPhraseRegex.test(lower)) {
    return weight * 3.5;
  }

  // P3 — Partial/substring match of the entire phrase (e.g. matching "control" in "controller")
  if (lower.includes(queryLower)) {
    return weight * 1.5;
  }

  // P4 — Token-level matching
  if (tokens.length === 0) return 0;

  let exactTokenHits = 0;
  let prefixTokenHits = 0;
  let substringTokenHits = 0;

  for (const tok of tokens) {
    const escapedTok = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactWord = new RegExp(`\\b${escapedTok}\\b`, 'i');
    const prefixWord = new RegExp(`\\b${escapedTok}`, 'i');

    if (exactWord.test(lower)) {
      exactTokenHits++;
    } else if (prefixWord.test(lower)) {
      prefixTokenHits++;
    } else if (lower.includes(tok)) {
      substringTokenHits++;
    }
  }

  const totalHits = exactTokenHits + prefixTokenHits + substringTokenHits;
  if (totalHits === 0) return 0;

  // Prefer exact token hits, then prefix hits, then substring hits
  let tokenScore = 0;
  tokenScore += (exactTokenHits / tokens.length) * weight * 1.0;
  tokenScore += (prefixTokenHits / tokens.length) * weight * 0.5;
  tokenScore += (substringTokenHits / tokens.length) * weight * 0.15;

  return tokenScore;
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

// ── Gemini Search Integration ────────────────────────────────
interface GeminiResponseJSON {
  intent: string;
  responseMessage: string;
  matchedIds: string[];
}

async function runGeminiSearch(query: string, technologies: Technology[]): Promise<AISearchResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[RINK AI] GEMINI_API_KEY is not defined. Falling back to local search.');
    return null;
  }

  try {
    const minimalTechList = technologies.map(t => ({
      id: t.id,
      name: t.name,
      sector: t.sector,
      institution: t.institution,
      problem_solved: t.problem_solved,
      trl: t.trl,
      patent_status: t.patent_status
    }));

    const prompt = `You are the RINK AI Discovery Assistant, the intelligent brain behind Kerala Startup Mission's Technology Transfer & Commercialization Portal.
Your task is to analyze the user's natural language input and match it with the most relevant technologies in our database.

Here is the database of 160 available technologies in Kerala's research ecosystem:
${JSON.stringify(minimalTechList)}

User Query: "${query}"

Instructions:
1. Classify the user query into one of these intents:
   - "greeting": if the user is saying hello (e.g. "hi", "hello")
   - "smalltalk": if the user is asking how you are or chatting generically
   - "who_are_you": if the user asks about your identity or what you do
   - "help": if the user asks how to use the search or what they can ask
   - "thanks": if the user says thank you or generic closing words
   - "search": if the user is searching for technologies, problem solutions, products, etc.
   - "empty": if the query is blank or doesn't have words

2. Response Message:
   - If the intent is conversational (greeting, smalltalk, help, thanks, who_are_you), write a helpful, friendly, natural response in markdown.
   - If the intent is "search", write a concise, professional summary response in markdown introducing the matches found (e.g., "I found 3 technologies matching your request..."). Highlight key enablers.

3. Matched IDs:
   - If the intent is "search", return an array of up to 8 technology IDs that are most relevant to the user query, ordered by relevance.
   - If the intent is conversational and no search is needed, return an empty array.

Return a JSON object matching this schema:
{
  "intent": "greeting" | "smalltalk" | "who_are_you" | "help" | "thanks" | "search" | "empty",
  "responseMessage": string,
  "matchedIds": string[]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              intent: {
                type: "STRING",
                enum: ["greeting", "smalltalk", "who_are_you", "help", "thanks", "search", "empty"]
              },
              responseMessage: { type: "STRING" },
              matchedIds: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["intent", "responseMessage", "matchedIds"]
          }
        }
      })
    });

    if (!response.ok) {
      console.error('[RINK AI] Gemini API request failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
      console.error('[RINK AI] Gemini returned empty response');
      return null;
    }

    const parsed: GeminiResponseJSON = JSON.parse(textResult.trim());

    // Map matched IDs back to Technology objects and compute scores
    const results: AISearchResult[] = [];
    const techMap = new Map(technologies.map(t => [t.id.toLowerCase(), t]));

    for (let idx = 0; idx < parsed.matchedIds.length; idx++) {
      const id = parsed.matchedIds[idx];
      const tech = techMap.get(id.toLowerCase());
      if (tech) {
        // Assign descending scores based on Gemini's ranking
        const score = Math.max(50, 100 - idx * 5);
        results.push({
          technology: tech,
          score,
          matchedOn: ['gemini_match']
        });
      }
    }

    return {
      results,
      query,
      intent: parsed.intent as ConversationIntent,
      responseMessage: parsed.responseMessage,
      totalFound: results.length
    };
  } catch (error) {
    console.error('[RINK AI] Error in runGeminiSearch:', error);
    return null;
  }
}

// ── Main search function ──────────────────────────────────────
export async function runAISearch(query: string, technologies: Technology[]): Promise<AISearchResponse> {
  const q = query.trim();

  // Try calling Gemini first
  const geminiResult = await runGeminiSearch(q, technologies);
  if (geminiResult) {
    return geminiResult;
  }

  // Fallback to local search logic
  return runLocalSearch(q, technologies);
}

// ── Local search function (reliable offline fallback) ─────────
export function runLocalSearch(query: string, technologies: Technology[]): AISearchResponse {
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

  // Identify specific tokens (excluding generic modifiers)
  const specificTokens = tokens.filter(tok => !GENERIC_MODIFIERS.has(tok));

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
    // ── Specific token check (prevents cross-domain false positives) ─
    // If specific tokens exist in the query, the technology MUST match at least one of them.
    if (specificTokens.length > 0) {
      const nameLower = tech.name.toLowerCase();
      const keywordsLower = (tech.keywords || []).map(k => k.toLowerCase()).join(' ');
      const problemLower = (tech.problem_solved || '').toLowerCase();
      const appsLower = (tech.applications || []).map(a => a.toLowerCase()).join(' ');
      const sectorLower = (tech.sector || '').toLowerCase();
      const descLower = (tech.description || '').toLowerCase();
      const typeLower = (tech.technology_type || '').toLowerCase();

      const fullSearchableText = `${nameLower} ${keywordsLower} ${problemLower} ${appsLower} ${sectorLower} ${descLower} ${typeLower}`;

      const hasSpecificMatch = specificTokens.some(tok => {
        const escapedTok = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedTok}`, 'i');
        return regex.test(fullSearchableText);
      });

      if (!hasSpecificMatch) {
        continue; // Exclude this technology entirely
      }
    }

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
