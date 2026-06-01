import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/db';

export const revalidate = 300; // 5 minutes

export async function GET() {
  const index = await getSearchIndex();
  return NextResponse.json(index, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
