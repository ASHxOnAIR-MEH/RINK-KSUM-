import { Technology, StartupPotential } from '@/types';
import { RawTechnology, RawInstitutionDetail } from '@/types/raw';

// ── Slug helpers ─────────────────────────────────────────────
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── Google Drive URL converter ────────────────────────────────
export function toDriveEmbedUrl(url: string | null | undefined): string {
  if (!url || url === 'Not Specified' || url === 'NA' || url.trim() === '') return '';

  const trimmed = url.trim();

  if (trimmed.includes('drive.google.com/thumbnail')) return trimmed;
  if (trimmed.includes('drive.google.com/uc?')) {
    const idMatch = trimmed.match(/[?&]id=([^&]+)/);
    if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
    return trimmed;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w800`;
  const openMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w800`;
  if (trimmed.includes('drive.google.com/drive/')) return '';

  return trimmed;
}

// ── Startup potential normalizer ──────────────────────────────
export function normalizeStartupPotential(raw: string | null | undefined): string {
  if (!raw || raw === 'None') return 'not specified';
  return String(raw).replace(/[^\x20-\x7E]/g, '').trim().toLowerCase() || 'not specified';
}

function potentialScore(level: string): number {
  const l = level.toLowerCase();
  if (l === 'featured') return 10;
  if (l === 'very high') return 8;
  if (l === 'high') return 5;
  if (l === 'medium') return 3;
  if (l === 'low') return 2;
  return 1;
}

// ── Application Text Normalizer ───────────────────────────────
export function normalizeApplications(raw: string | undefined | null): string[] {
  if (!raw || raw === 'None' || !String(raw).trim()) return [];

  const items = String(raw)
    .split(/[\n\r]+|[;]|[,]|[•]|(?:^|\n)\s*[-–—]\s*|(?:^|\n)\s*\d+[.)]\s*/gm)
    .map(item => {
      let cleaned = item
        .replace(/^\s*[-–—•.)\d]+\s*/, '')
        .replace(/\s+/g, ' ')
        .trim();
        
      if (cleaned.toLowerCase().startsWith('and ')) {
        cleaned = cleaned.substring(4).trim();
      }
      if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
      return cleaned;
    })
    .filter(item => item.length > 2);

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}

// ── Flexible Getter ───────────────────────────────────────────
// Normalizes keys (removes non-alphanumeric) to match JSON keys
export function getValFromObj(obj: Record<string, any>, possibleKeys: string[], fallback: string = ''): string {
  if (!obj) return fallback;
  
  // Create a normalized version of the object keys mapping to actual values
  const normalizedObj: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    normalizedObj[cleanKey] = v;
  }

  for (const key of possibleKeys) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const val = normalizedObj[cleanKey];
    if (val !== undefined && val !== null && String(val) !== 'None' && String(val).trim() !== '') {
      return String(val).trim();
    }
  }
  return fallback;
}

// ── Mapper: RawTechnology -> Technology ───────────────────────
export function mapTechnology(raw: RawTechnology): Technology | null {
  const getVal = (keys: string[], fallback: string = '') => getValFromObj(raw, keys, fallback);

  const id = getVal(['technologyid', 'id']);
  const name = getVal(['technologyname', 'name']);

  if (!id || !name || id === 'Technology ID') return null;

  const institution = getVal(['institution']) || 'Unknown Institution';
  const sector = getVal(['primarysector', 'primary_sector', 'sector']) || 'General';
  
  const phone = getVal(['phone', 'contactno', 'contactphone', 'mobile'], '')
    .replace(/[\r\n]+/g, '')
    .trim();
  const email = getVal(['email', 'contactemail']);
  const imageUrl = getVal(['imageurl', 'image', 'photourl', 'embedurl', 'imagelink', 'imgurl']);

  const startupPotentialRaw = getVal(['startuppotential', 'potential'], 'Not Specified');
  const startupPotentialNormalized = normalizeStartupPotential(startupPotentialRaw);
  
  const startupPotentialCanonical: StartupPotential =
    startupPotentialNormalized === 'featured' ? 'Featured' :
    startupPotentialNormalized === 'very high' ? 'Very High' :
    startupPotentialNormalized === 'high' ? 'High' :
    startupPotentialNormalized === 'medium' ? 'Medium' :
    startupPotentialNormalized === 'low' ? 'Low' :
    startupPotentialNormalized === 'emerging' ? 'Medium' :
    'Not Specified';

  const keywordsRaw = getVal(['keywords', 'tags']);
  const keywords = keywordsRaw
    ? keywordsRaw.split(/[,;]/).map((k: string) => k.trim()).filter(Boolean)
    : [];

  const applicationsRaw = getVal(['applications', 'usecases']);
  const applications = normalizeApplications(applicationsRaw);

  const sectorSlug = toSlug(sector);
  const institutionSlug = toSlug(institution);
  const embedUrl = toDriveEmbedUrl(imageUrl);

  const trlVal = getVal(['trl', 'trllevel']);
  const trl = trlVal && trlVal !== 'Not Specified' && trlVal !== 'NA' ? trlVal : 'TRL Not Available';

  const patentVal = getVal(['patentstatus', 'patent']);
  const patent_status = patentVal && patentVal !== 'Not Specified' && patentVal !== 'NA' ? patentVal : 'Patent Status Not Available';

  const ipStatusVal = getVal(['ipstatusforfrontend', 'ipstatus', 'ipstatusfrontend'], '');
  const ip_status = ipStatusVal && ipStatusVal !== 'Not Specified' && ipStatusVal !== 'NA' ? ipStatusVal : 'Not Available';

  const commVal = getVal(['commercializationstatus', 'commercialization', 'status']);
  const commercialization_status = commVal && commVal !== 'Not Specified' && commVal !== 'NA' ? commVal : 'Commercialization Status Not Available';

  const techImage = getVal(['technologyimage', 'technologyphotourl', 'techimage', 'technologyimageurl']);
  const instImage = getVal(['institutionimage', 'institutionlogo', 'logo', 'institutionlogourl']);
  const lastUpdated = getVal(['lastupdated', 'updated', 'lastupdateddate']);

  const techImageEmbedUrl = techImage ? toDriveEmbedUrl(techImage) : '';
  const instImageEmbedUrl = instImage ? toDriveEmbedUrl(instImage) : '';

  return {
    id,
    name,
    institution,
    institution_slug: institutionSlug,
    sector,
    sector_slug: sectorSlug,
    technology_type: getVal(['technologytype', 'type'], 'Not Specified'),
    problem_solved: getVal(['problemsolved', 'problem'], 'Information being updated'),
    description: getVal(['description', 'desc'], 'Information being updated'),
    applications: applications.length ? applications : ['Information being updated'],
    startup_potential: startupPotentialCanonical,
    startup_potential_score: potentialScore(startupPotentialCanonical),
    trl,
    patent_status,
    ip_status,
    commercialization_status,
    contact_person: getVal(['contactperson', 'contact'], 'Contact Institution'),
    phone,
    email,
    keywords,
    image_url: imageUrl,
    image_embed_url: embedUrl,
    institution_website: getVal(['institutionwebsite', 'website', 'url']),
    featured: startupPotentialNormalized === 'high' || startupPotentialNormalized === 'featured' || startupPotentialNormalized === 'very high',
    technology_image: techImage,
    technology_image_embed_url: techImageEmbedUrl,
    institution_image: instImage,
    institution_image_embed_url: instImageEmbedUrl,
    last_updated: lastUpdated
  };
}

// ── Mapper: RawInstitutionDetail -> InstitutionDetailRow ──────
export function mapInstitutionDetail(raw: RawInstitutionDetail) {
  const getVal = (keys: string[], fallback = '') => getValFromObj(raw, keys, fallback);

  const name = getVal(['institutionname', 'name', 'institution']);
  if (!name) return null;

  const logoRaw = getVal(['institutionlogourl', 'institutionlogo', 'logo', 'logourl', 'institutionimage', 'image']);
  const logoEmbed = toDriveEmbedUrl(logoRaw);

  return {
    name,
    slug: toSlug(name),
    logo_url: logoRaw,
    logo_embed_url: logoEmbed,
    address: getVal(['address', 'location', 'institutionaddress']),
    website: getVal(['locationwebsitelink', 'website', 'officialwebsite', 'url', 'institutionwebsite']),
    contact_email: getVal(['email', 'contactemail']),
    contact_phone: getVal(['phone', 'contactphone']),
  };
}
