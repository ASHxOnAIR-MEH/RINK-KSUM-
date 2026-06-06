// ============================================================
// RINK AI Search API Route
// POST /api/ai-search  { query: string }
// Returns matched technologies from the live Google Sheets DB
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchAllTechnologies } from '@/lib/sheets';
import { runAISearch } from '@/lib/aiSearch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query: string = (body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query too long' },
        { status: 400 }
      );
    }

    // Fetch all technologies from live Google Sheet
    const technologies = await fetchAllTechnologies();

    const filters = body.filters || undefined;
    const mode = body.mode || 'technology';

    // Run AI search scoring
    const result = runAISearch(query, technologies, filters, mode);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[RINK AI] Search error:', err);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Also support GET for quick testing
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  const technologies = await fetchAllTechnologies();
  const result = runAISearch(query, technologies);
  return NextResponse.json(result);
}
