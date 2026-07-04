# RINK Technology Explorer 🔬

**Discover Research. Build Startups.**

A sub-portal of the [Research Innovation Network Kerala (RINK)](https://startupmission.in) under the **Kerala Startup Mission (KSUM)**.
DEV BY MUHAMMED ASHIK UKFCET
---

## 🎯 Purpose

RINK Technology Explorer helps early-stage startup founders discover commercializable technologies developed by Kerala research institutions and identify technologies suitable for building startups.

> This is NOT a research repository. It's a **startup discovery platform**.

---

## 🌐 Live Demo

Run locally:
```bash
cd rink-explorer
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Data | Local JSON (Supabase-ready) |
| Fonts | Inter + Outfit (Google Fonts) |

---

## 📁 Project Structure

```
rink-explorer/
├── src/
│   ├── types/index.ts              ← TypeScript interfaces
│   ├── data/
│   │   ├── technologies.ts         ← 25 MVP technologies
│   │   ├── sectors.ts              ← 10 sectors
│   │   └── institutions.ts         ← 8 institutions
│   ├── lib/db.ts                   ← DATA ACCESS LAYER (swap to Supabase here)
│   ├── components/
│   │   ├── layout/Navbar.tsx       ← KSUM + RINK logo, navigation
│   │   ├── layout/Footer.tsx       ← Footer with CTA
│   │   └── ui/                     ← All UI components
│   └── app/                        ← All 52 pages
└── supabase/schema.sql             ← Ready-to-run DB schema
```

---

## 🚀 Features

- ✅ **Homepage** — Hero, stats, sectors, featured technologies, startup discovery
- ✅ **Technology Search** — Live search with 5 filters + sort
- ✅ **25 Technologies** — Full dataset from CTCRI, CPCRI, NIIST, and more
- ✅ **Startup Discovery** — "I Want To Build A Startup In..." with 9 categories
- ✅ **Sector & Institution Browse** — Organized by domain and institution
- ✅ **Contact Modal** — Direct institution contact (no form)
- ✅ **Mobile Responsive** — Full mobile support
- ✅ **Supabase Ready** — Only `src/lib/db.ts` needs to change for backend

---

## 🏛️ Partner Institutions

CTCRI · CPCRI · NIIST · NCRMI · KSCSTE · KFRI · CWRDM · JNTBGRI

---

## 🔄 Supabase Migration

When ready to move from local JSON to Supabase:

1. Run `supabase/schema.sql` in Supabase SQL editor
2. Add `.env.local` with your Supabase keys
3. Edit only `src/lib/db.ts` — uncomment Supabase blocks
4. Zero frontend changes required ✨

---

## 👥 Target Users

- Early-stage startup founders
- Student entrepreneurs  
- MSMEs and innovators
- Incubators and investors

---

## 📄 License

© Kerala Startup Mission. Built for the RINK ecosystem.
