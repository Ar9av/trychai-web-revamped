import { generateRelevantIndexesFromAzure } from '@/lib/openai-ai-search';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, data } = await request.json();
    
    const analysis = await generateRelevantIndexesFromAzure(topic, data);

    console.log("Analysis:", analysis);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze search results' },
      { status: 500 }
    );
  }
} 