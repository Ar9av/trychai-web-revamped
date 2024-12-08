import Exa from 'exa-js';
import { NextResponse } from 'next/server';

const EXA_API_KEY = process.env.NEXT_PUBLIC_EXA_API_KEY;
const exa = new Exa(EXA_API_KEY);

export async function POST(request: Request) {
  try {
    const { query, linksPerQuery } = await request.json();
    
    const searchResponse = await exa.searchAndContents(query, {
      numResults: linksPerQuery,
      useAutoprompt: true,
      summary: true,
      category: "linkedin profile"
    });

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Exa API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
} 