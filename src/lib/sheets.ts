// ============================================================
// RINK Technology Explorer — Google Sheets Data Layer
//
// Fetches live data from the Google Sheets CSV export.
// Uses Next.js ISR (revalidate: 300 = 5 minutes) so new
// rows in the sheet appear automatically without redeploy.
//
// Sheet URL:
// https://docs.google.com/spreadsheets/d/1HXlzT504-AhqzfU6Nm3bktAspIjaQm2l1z45qROZrFc
// ============================================================

import { Technology, Sector, Institution, StartupPotential } from '@/types';

const SHEET_ID = '1HXlzT504-AhqzfU6Nm3bktAspIjaQm2l1z45qROZrFc';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// ── Sector metadata (icon + color) ──────────────────────────
const SECTOR_META: Record<string, { icon: string; color: string }> = {
  'agriculture':        { icon: '🌾', color: '#16a34a' },
  'food-processing':    { icon: '🍽️', color: '#ea580c' },
  'food-technology':    { icon: '🧪', color: '#7c3aed' },
  'biotechnology':      { icon: '🔬', color: '#0891b2' },
  'aquaculture':        { icon: '🐟', color: '#0284c7' },
  'environment':        { icon: '🌿', color: '#15803d' },
  'materials':          { icon: '⚗️',  color: '#9333ea' },
  'construction':       { icon: '🏗️', color: '#b45309' },
  'agritech':           { icon: '📡', color: '#0d9488' },
  'post-harvest':       { icon: '📦', color: '#d97706' },
  'water-technology':   { icon: '💧', color: '#2563eb' },
  'renewable-energy':   { icon: '⚡', color: '#ca8a04' },
  'climate-tech':       { icon: '🌱', color: '#65a30d' },
  'manufacturing':      { icon: '⚙️', color: '#dc2626' },
  'sustainable-materials': { icon: '♻️', color: '#059669' },
  'healthcare':         { icon: '🏥', color: '#be185d' },
  'smart-systems':      { icon: '🤖', color: '#4f46e5' },
  'transportation':     { icon: '🚗', color: '#0369a1' },
  'default':            { icon: '🔧', color: '#6b7280' },
};

// ── Slug helpers ─────────────────────────────────────────────
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getSectorMeta(slug: string) {
  return SECTOR_META[slug] ?? SECTOR_META['default'];
}

// ── Google Drive URL converter ────────────────────────────────
export function toDriveEmbedUrl(url: string): string {
  if (!url || url === 'Not Specified' || url === 'NA') return '';

  // Already a direct embed
  if (url.includes('drive.google.com/uc?')) return url;

  // Pattern: https://drive.google.com/file/d/FILE_ID/view?...
  const match = url.match(/\/file\/d\/([^/]+)\//);
  if (match) {
    return `https://drive.google.com/uc?id=${match[1]}&export=view`;
  }

  // Pattern: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?id=${openMatch[1]}&export=view`;
  }

  return url; // return as-is if can't parse
}

// ── Startup potential mapping ─────────────────────────────────
function potentialScore(level: string): number {
  const l = level.toLowerCase();
  if (l === 'high') return 5;
  if (l === 'medium') return 3;
  if (l === 'low') return 2;
  return 1;
}

// ── CSV Parser (handles quoted multi-line fields) ─────────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        // Escaped quote
        field += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(field.trim());
      field = '';
      i++;
      continue;
    }

    if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field.trim());
      if (row.some(f => f !== '')) rows.push(row);
      row = [];
      field = '';
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Last field
  if (field.trim() || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f !== '')) rows.push(row);
  }

  return rows;
}

// ── Row → Technology ──────────────────────────────────────────
// Sheet columns (0-indexed):
// 0: Technology ID
// 1: Technology Name
// 2: Institution
// 3: Sector
// 4: Technology Type
// 5: Problem Solved
// 6: Description
// 7: Applications
// 8: Startup Potential
// 9: TRL
// 10: Patent Status
// 11: Contact Person
// 12: Phone
// 13: Email
// 14: Source PDF (ignore)
// 15: Page No (ignore)
// 16: Keywords
// 17: Image URL
// 18: Institution Website

function rowToTechnology(row: string[], idx: number): Technology | null {
  const id = row[0]?.trim();
  const name = row[1]?.trim();

  if (!id || !name || id === 'Technology ID') return null;

  const institution = row[2]?.trim() || 'Unknown Institution';
  const sector = row[3]?.trim() || 'General';
  const phone = (row[12] || '')
    .replace(/[\r\n]+/g, '') // remove embedded newlines
    .trim();
  const email = (row[13] || '').trim();
  const imageUrl = (row[17] || '').trim();
  const startupPotentialRaw = (row[8] || 'Not Specified').trim() as StartupPotential;

  const keywordsRaw = (row[16] || '').trim();
  const keywords = keywordsRaw
    ? keywordsRaw.split(/[,;]/).map(k => k.trim()).filter(Boolean)
    : [];

  const applicationsRaw = (row[7] || '').trim();
  const applications = applicationsRaw
    ? applicationsRaw.split(/[,;]/).map(a => a.trim()).filter(Boolean)
    : [];

  const sectorSlug = toSlug(sector);
  const institutionSlug = toSlug(institution);
  const embedUrl = toDriveEmbedUrl(imageUrl);

  return {
    id,
    name,
    institution,
    institution_slug: institutionSlug,
    sector,
    sector_slug: sectorSlug,
    technology_type: (row[4] || '').trim() || 'Not Specified',
    problem_solved: (row[5] || '').trim() || 'Information being updated',
    description: (row[6] || '').trim() || 'Information being updated',
    applications: applications.length ? applications : ['Information being updated'],
    startup_potential: startupPotentialRaw,
    startup_potential_score: potentialScore(startupPotentialRaw),
    trl: (row[9] || 'Not Specified').trim(),
    patent_status: (row[10] || 'Not Specified').trim(),
    contact_person: (row[11] || '').trim() || 'Contact Institution',
    phone,
    email,
    keywords,
    image_url: imageUrl,
    image_embed_url: embedUrl,
    institution_website: (row[18] || '').trim(),
    featured: startupPotentialRaw === 'High',
  };
}

// ── Main fetch function ───────────────────────────────────────
let _cache: { data: Technology[]; ts: number } | null = null;

// Dev mode: no cache (always live from sheet)
// Production: 5-minute cache to reduce API calls
const CACHE_TTL = process.env.NODE_ENV === 'development'
  ? 0                  // instant refresh in dev
  : 5 * 60 * 1000;    // 5 minutes in production

// Call this to force-clear the cache (used by /api/revalidate)
export function clearCache() {
  _cache = null;
  console.log('[RINK] Cache cleared — next request will fetch fresh sheet data');
}

export async function fetchAllTechnologies(): Promise<Technology[]> {
  // In-memory cache for server-side deduplication within a render cycle
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
    return _cache.data;
  }

  try {
    const res = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error(`[RINK] Sheet fetch failed: ${res.status}`);
      return [];
    }

    const text = await res.text();
    const rows = parseCSV(text);

    // Skip header row (row[0] = "Technology ID")
    const technologies: Technology[] = [];
    for (let i = 1; i < rows.length; i++) {
      const tech = rowToTechnology(rows[i], i);
      if (tech) technologies.push(tech);
    }

    _cache = { data: technologies, ts: Date.now() };
    console.log(`[RINK] Loaded ${technologies.length} technologies from Google Sheets`);
    return technologies;
  } catch (err) {
    console.error('[RINK] Failed to fetch sheet data:', err);
    return _cache?.data ?? [];
  }
}

// ── Derived data helpers ──────────────────────────────────────

export async function fetchSectors(): Promise<Sector[]> {
  const techs = await fetchAllTechnologies();
  const map = new Map<string, { name: string; count: number }>();

  for (const t of techs) {
    const existing = map.get(t.sector_slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(t.sector_slug, { name: t.sector, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({
      slug,
      name,
      tech_count: count,
      ...getSectorMeta(slug),
    }))
    .sort((a, b) => b.tech_count - a.tech_count);
}

export async function fetchInstitutions(): Promise<Institution[]> {
  const techs = await fetchAllTechnologies();
  const map = new Map<string, { name: string; count: number }>();

  for (const t of techs) {
    const existing = map.get(t.institution_slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(t.institution_slug, { name: t.institution, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({
      slug,
      name,
      tech_count: count,
    }))
    .sort((a, b) => b.tech_count - a.tech_count);
}
