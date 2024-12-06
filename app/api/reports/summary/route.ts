import { NextResponse } from 'next/server'
import { generateSummaryFromAzure } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { results } = await req.json()
    console.log("Results", results);
    
    // Prepare the content for summarization
    const contentToSummarize = results.map((result: any) => 
      `Title: ${result.title}\nContent: ${result.content}`
    ).join('\n\n')

    const summary = await generateSummaryFromAzure(contentToSummarize)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
} 