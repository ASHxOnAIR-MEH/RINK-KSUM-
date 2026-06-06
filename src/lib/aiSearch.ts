// ============================================================
// RINK Technology Transfer Portal — AI Search Engine
// - Intent detection (startup, problem, product, machinery, patent, sector)
// - Weighted scoring: Sector (40%), Problem (25%), Tech (20%), Inst (10%), Startup Potential (5%)
// - Dynamic grouping of core and supporting technologies for Startup mode
// - Advanced filtering capabilities
// ============================================================

import { Technology } from '@/types';

export interface StartupOpportunity {
  title: string;
  coreTechnology: Technology;
  supportingTechnologies: Technology[];
  relevanceScore: number;
}

export interface AISearchResult {
  technology: Technology;
  score: number;
  matchedOn: string[];
}

export interface AISearchResponse {
  results: AISearchResult[];
  startupOpportunities?: StartupOpportunity[];
  query: string;
  intent: ConversationIntent;
  responseMessage: string;
  totalFound: number;
  mode?: 'technology' | 'startup';
}

export interface AISearchFilters {
  institution?: string;
  sector?: string;
  technology_type?: string;
  patented_only?: boolean;
  trl_min?: number;
  featured_only?: boolean;
  recently_added?: boolean;
  commercialization_ready?: boolean;
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
  | 'problem'
  | 'product'
  | 'machinery'
  | 'patent'
  | 'sector'
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

export function detectSearchIntent(query: string): ConversationIntent {
  const q = query.toLowerCase();
  
  if (/patented|patent|ip available|licensing/i.test(q)) {
    return 'patent';
  }
  if (/start a business|startup|commercialize|entrepreneurship|build a startup|start a|launch a/i.test(q)) {
    return 'startup';
  }
  if (/machine|equipment|processing unit|fabrication|extractor|dryer|drier|harvester/i.test(q)) {
    return 'machinery';
  }
  if (/coconut oil|biofertilizer|fish feed|nutraceuticals|juice|milk|beverage|powder|flour|feed|fertilizer/i.test(q)) {
    return 'product';
  }
  if (/reduce|prevent|increase|improve|yield|loss|waste|monitor|detect|control|treat/i.test(q)) {
    return 'problem';
  }
  if (/agriculture|food|biotech|medtech|digital|energy|water|robotics/i.test(q)) {
    return 'sector';
  }
  return 'search';
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

    search: '',
    startup: '',
    problem: '',
    product: '',
    machinery: '',
    patent: '',
    sector: '',
  };

  return {
    results: [],
    query,
    intent,
    responseMessage: messages[intent] || messages.empty,
    totalFound: 0,
  };
}

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
  'device', 'devices', 'machine', 'machines', 'process', 'processes',
]);

// ── Minimum token length (prevents short word over-matching) ──
const MIN_TOKEN_LEN = 3;

// ── Tokenise: lowercase, remove punctuation, filter stops ────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= MIN_TOKEN_LEN && !STOP_WORDS.has(t));
}

export function cleanTopic(query: string, intent: ConversationIntent): string {
  let q = query.trim();
  q = q.replace(/^[!?.,\s]+|[!?.,\s]+$/g, '');

  const phrasesToRemove = [
    /i want to start a/i, /i want to start/i, /how can i start a/i, /how can i start/i,
    /how to start a/i, /how to start/i, /starting a/i, /start a/i, /start/i,
    /i want to build a/i, /i want to build/i, /build a/i, /build/i,
    /i want to launch a/i, /i want to launch/i, /launch a/i, /launch/i,
    /startup idea for/i, /startup idea/i, /startup/i, /business idea/i, /business/i,
    /opportunities in/i, /opportunities/i, /commercialize/i, /entrepreneurship/i,
    /i need a device to/i, /i need a/i, /i need/i, /device to/i, /device/i,
    /technologies for/i, /technology for/i, /technologies/i, /technology/i,
    /innovations for/i, /innovation for/i, /innovations/i, /innovation/i,
    /patented technology for/i, /patented technology/i, /patented/i, /patents/i, /patent/i,
    /ip available for/i, /ip available/i, /licensing/i,
    /for reducing/i, /for increasing/i, /for improving/i, /for/i,
  ];

  for (const regex of phrasesToRemove) {
    q = q.replace(regex, '');
  }

  q = q.trim().replace(/\s+/g, ' ');
  if (q.length > 0) {
    return q.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return 'General Innovation';
}

function buildMessage(
  query: string,
  count: number,
  intent: ConversationIntent,
  topic: string
): string {
  if (count === 0) {
    return `We couldn't find an exact match for **"${query}"** in the RINK database.`;
  }
  switch (intent) {
    case 'startup':
      return `We found **${count} technologies** that could help build your **${topic} Startup**`;
    case 'problem':
      return `Technologies relevant to **${topic}**`;
    case 'sector':
      return `**${count} commercialization opportunities** in **${topic}**`;
    case 'product':
      return `Product technologies matched for **${topic}**:`;
    case 'machinery':
      return `Machinery & equipment technologies matched for **${topic}**:`;
    case 'patent':
      return `Found **${count} patented technologies** relevant to **${topic}**:`;
    default:
      return `We found **${count} technologies** matching **"${query}"**`;
  }
}

// ── Weighted Relevance Scoring Engine ──────────────────────────
export function computeRelevanceScore(
  tech: Technology,
  query: string,
  tokens: string[]
): { score: number; matchedOn: string[] } {
  const matchedOn: string[] = [];

  // Technology ID Direct Match check (immediate 100%)
  if (query.toLowerCase().trim() === tech.id.toLowerCase().trim()) {
    return { score: 100, matchedOn: ['id'] };
  }

  // 1. Sector Match (40% weight)
  let sectorMatch = 0;
  const sectorLower = tech.sector.toLowerCase();
  const sectorSlug = tech.sector_slug.toLowerCase();
  const matchedSectorTokens = tokens.filter(tok => sectorLower.includes(tok) || sectorSlug.includes(tok));
  if (matchedSectorTokens.length > 0) {
    sectorMatch = Math.min(matchedSectorTokens.length / tokens.length, 1.0);
    matchedOn.push('sector');
  }

  // 2. Problem Match (25% weight)
  let problemMatch = 0;
  const problemLower = tech.problem_solved.toLowerCase();
  const descLower = tech.description.toLowerCase();
  const problemHits = tokens.filter(tok => problemLower.includes(tok) || descLower.includes(tok)).length;
  if (problemHits > 0) {
    problemMatch = Math.min(problemHits / tokens.length, 1.0);
    matchedOn.push('problem_solved');
  }

  // 3. Tech Match - Name/Keywords (20% weight)
  let techMatch = 0;
  const nameLower = tech.name.toLowerCase();
  const nameHits = tokens.filter(tok => nameLower.includes(tok)).length;

  let keywordHits = 0;
  if (tech.keywords && tech.keywords.length > 0) {
    const kws = tech.keywords.map(k => k.toLowerCase());
    keywordHits = tokens.filter(tok => kws.some(k => k.includes(tok))).length;
  }

  if (nameHits > 0 || keywordHits > 0) {
    const nameRatio = nameHits / tokens.length;
    const kwRatio = keywordHits / tokens.length;
    techMatch = Math.min(Math.max(nameRatio, kwRatio), 1.0);
    matchedOn.push('name');
  }

  // 4. Institution Match (10% weight)
  let instMatch = 0;
  const instLower = tech.institution.toLowerCase();
  const instSlug = tech.institution_slug.toLowerCase();
  const matchedInstTokens = tokens.filter(tok => instLower.includes(tok) || instSlug.includes(tok));
  if (matchedInstTokens.length > 0) {
    instMatch = Math.min(matchedInstTokens.length / tokens.length, 1.0);
    matchedOn.push('institution');
  }

  // If there are no actual text matches, return 0
  if (matchedOn.length === 0) {
    return { score: 0, matchedOn };
  }

  // 5. Startup Potential (5% weight)
  let startupMatch = 0.2;
  if (tech.startup_potential === 'High') startupMatch = 1.0;
  else if (tech.startup_potential === 'Medium') startupMatch = 0.6;
  else if (tech.startup_potential === 'Low') startupMatch = 0.2;

  const score = Math.round(
    (sectorMatch * 40) +
    (problemMatch * 25) +
    (techMatch * 20) +
    (instMatch * 10) +
    (startupMatch * 5)
  );

  return { score, matchedOn };
}

// ── Main search function ──────────────────────────────────────
export function runAISearch(
  query: string,
  technologies: Technology[],
  filters?: AISearchFilters,
  mode: 'technology' | 'startup' = 'technology'
): AISearchResponse {
  const q = query.trim();

  // ── Step 1: Intent classification ───────────────────────────
  const baseIntent = classifyIntent(q);

  // ── Step 2: If conversational, return without DB search ─────
  if (baseIntent !== 'search') {
    return getConversationalResponse(baseIntent, q);
  }

  // Determine specific search sub-intent
  const searchIntent = detectSearchIntent(q);

  // ── Step 3: Tokenise for search ──────────────────────────
  const tokens = tokenise(q);

  // No meaningful search tokens
  if (tokens.length === 0) {
    return {
      results: [],
      query: q,
      intent: 'empty',
      responseMessage: `Please describe your startup idea or the technology you are looking for.`,
      totalFound: 0,
      mode,
    };
  }

  // ── Step 4: Filter and score all technologies ────────────────
  const scored: AISearchResult[] = [];

  for (const tech of technologies) {
    // Apply hard advanced filters
    if (filters) {
      if (filters.institution && tech.institution_slug !== filters.institution) continue;
      if (filters.sector && tech.sector_slug !== filters.sector) continue;
      if (filters.technology_type && tech.technology_type !== filters.technology_type) continue;
      if (filters.patented_only) {
        const ps = tech.patent_status.toLowerCase();
        if (!ps.includes('patent') || ps.includes('not patent') || ps === 'not specified') continue;
      }
      if (filters.trl_min) {
        const trlNum = parseInt(tech.trl?.replace(/[^0-9]/g, '') || '0');
        if (isNaN(trlNum) || trlNum < filters.trl_min) continue;
      }
      if (filters.featured_only && !tech.featured) continue;
      if (filters.commercialization_ready) {
        const cs = tech.commercialization_status.toLowerCase();
        if (cs.includes('evaluation') || cs.includes('not ready') || cs.includes('not specified')) continue;
      }
    }

    const { score, matchedOn } = computeRelevanceScore(tech, q, tokens);

    if (score > 0) {
      // Prioritize specific intents during scoring
      let finalScore = score;
      if (searchIntent === 'patent' && tech.patent_status.toLowerCase().includes('patented')) {
        finalScore += 15;
      }
      if (searchIntent === 'startup' && tech.startup_potential === 'High') {
        finalScore += 15;
      }
      if (searchIntent === 'machinery' && /machine|equipment|unit|drier|dryer|device/i.test(tech.technology_type)) {
        finalScore += 15;
      }
      scored.push({ technology: tech, score: Math.min(finalScore, 100), matchedOn });
    }
  }

  // Sort by score descending
  const sorted = scored.sort((a, b) => b.score - a.score);
  const cappedResults = sorted.slice(0, 8);
  const topic = cleanTopic(q, searchIntent);

  const responseMessage = buildMessage(q, cappedResults.length, searchIntent, topic);

  // ── Technology Transfer Startup Mode Grouping ────────────────
  if (mode === 'startup' && cappedResults.length > 0) {
    const startupOpportunities: StartupOpportunity[] = [];
    const usedIds = new Set<string>();

    // Take top results and build opportunities
    for (const res of cappedResults) {
      if (usedIds.has(res.technology.id)) continue;

      const coreTech = res.technology;
      usedIds.add(coreTech.id);

      // Find supporting technologies (other technologies matching topic, same sector, or same institution)
      const supporting = technologies
        .filter(t => {
          if (t.id === coreTech.id || usedIds.has(t.id)) return false;
          const isSameSector = t.sector_slug === coreTech.sector_slug;
          const isSameInst = t.institution_slug === coreTech.institution_slug;
          const matchesQuery = tokens.some(tok => t.name.toLowerCase().includes(tok) || t.keywords.some(k => k.toLowerCase().includes(tok)));
          return isSameSector && (isSameInst || matchesQuery);
        })
        .slice(0, 3);

      supporting.forEach(t => usedIds.add(t.id));

      const title = `${topic} Production & Commercialization Venture`;

      startupOpportunities.push({
        title,
        coreTechnology: coreTech,
        supportingTechnologies: supporting,
        relevanceScore: res.score,
      });
    }

    return {
      results: cappedResults,
      startupOpportunities: startupOpportunities.slice(0, 3), // return top 3 opportunities
      query: q,
      intent: searchIntent,
      responseMessage,
      totalFound: cappedResults.length,
      mode,
    };
  }

  return {
    results: cappedResults,
    query: q,
    intent: searchIntent,
    responseMessage,
    totalFound: cappedResults.length,
    mode,
  };
}
