import { NextResponse } from 'next/server';
import { getCachedExaSearch, cacheExaSearch } from '@/lib/cache/exa-cache';
import { performExaSearch } from '@/lib/search/exa-search';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const startDate = searchParams.get('startDate');
    const category = searchParams.get('category');
    const numResults = searchParams.get('numResults');
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const searchPayload = {
      topic,
      ...(startDate && { startDate }),
      ...(category && { category }),
      ...(numResults && { numResults: parseInt(numResults) })
    };
    // Try to get cached results first
    const cachedResults = await getCachedExaSearch(searchPayload);
    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    // If no cache hit, perform the search
    const results = await performExaSearch(searchPayload);

    // Cache the results for future use
    await cacheExaSearch(searchPayload, results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching topic:', error);
    return NextResponse.json(
      { error: 'Failed to search topic' },
      { status: 500 }
    );
  }
}