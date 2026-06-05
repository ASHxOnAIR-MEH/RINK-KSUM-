import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/db';

export const revalidate = 60; // 1 minute

export async function GET() {
  const index = await getSearchIndex();
  return NextResponse.json(index, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
