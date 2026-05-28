-- ============================================================
-- RINK Technology Explorer — Supabase Schema
-- Run this in your Supabase SQL editor to migrate from JSON data
-- ============================================================

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Technologies Table
CREATE TABLE technologies (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  institution             TEXT NOT NULL,
  institution_slug        TEXT NOT NULL,
  inventor                TEXT NOT NULL,
  description             TEXT NOT NULL,
  problem_solved          TEXT NOT NULL,
  applications            TEXT[] NOT NULL DEFAULT '{}',
  sector                  TEXT NOT NULL,
  sector_slug             TEXT NOT NULL,
  technology_type         TEXT NOT NULL CHECK (technology_type IN ('Process','Product','Device','Software','Material','Formulation','Method','System')),
  patent_status           TEXT NOT NULL CHECK (patent_status IN ('Patented','Patent Applied','Trade Secret','Open Source','Copyright','Not Patented')),
  startup_potential       INTEGER NOT NULL CHECK (startup_potential BETWEEN 1 AND 5),
  technology_readiness    INTEGER NOT NULL CHECK (technology_readiness BETWEEN 1 AND 9),
  commercialization_status TEXT NOT NULL CHECK (commercialization_status IN ('Commercial Ready','Pilot Stage','Lab Stage','Technology Transfer Available')),
  contact_name            TEXT,
  contact_designation     TEXT,
  contact_phone           TEXT,
  contact_email           TEXT,
  contact_website         TEXT,
  contact_institution     TEXT,
  related_technology_ids  TEXT[] DEFAULT '{}',
  image_url               TEXT,
  featured                BOOLEAN DEFAULT FALSE,
  tags                    TEXT[] DEFAULT '{}',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  -- Full-text search vector (auto-updated by trigger)
  search_vector           TSVECTOR
);

-- Full-text search index
CREATE INDEX technologies_search_idx ON technologies USING GIN (search_vector);
CREATE INDEX technologies_sector_idx ON technologies (sector_slug);
CREATE INDEX technologies_institution_idx ON technologies (institution_slug);
CREATE INDEX technologies_featured_idx ON technologies (featured) WHERE featured = TRUE;

-- Auto-update search_vector
CREATE OR REPLACE FUNCTION update_technology_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.sector, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.institution, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.problem_solved, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER technology_search_vector_update
  BEFORE INSERT OR UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION update_technology_search_vector();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_technologies_updated_at
  BEFORE UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sectors Table
CREATE TABLE sectors (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Institutions Table
CREATE TABLE institutions (
  id             TEXT PRIMARY KEY,
  slug           TEXT UNIQUE NOT NULL,
  acronym        TEXT NOT NULL,
  full_name      TEXT NOT NULL,
  description    TEXT,
  location       TEXT,
  website        TEXT,
  contact_email  TEXT,
  contact_phone  TEXT,
  contact_person TEXT,
  logo_url       TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (public read access)
ALTER TABLE technologies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON technologies  FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON sectors        FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON institutions   FOR SELECT USING (TRUE);

-- ============================================================
-- MIGRATION NOTES for src/lib/db.ts:
--
-- 1. Create .env.local with:
--    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
--
-- 2. In src/lib/db.ts, uncomment all Supabase blocks and
--    remove the local JSON imports.
--
-- 3. Run seed script: supabase/seed.sql to populate data.
-- ============================================================
