import { NextResponse } from 'next/server';
import Exa from 'exa-js';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const startDate = searchParams.get('startDate');

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate MD5 hash of the search parameters
    const payloadHash = crypto
      .createHash('md5')
      .update(JSON.stringify({ topic, startDate }))
      .digest('hex');

    // Check cache
    const cached = await prisma.exa_responses.findUnique({
      where: { payload_md5: payloadHash }
    });

    if (cached) {
      return NextResponse.json(cached.response_json);
    }

    // Perform search
    console.log("searching", topic, startDate);
    const result = await exa.searchAndContents(
      topic,
      {
        type: "auto",
        useAutoprompt: true,
        numResults: 20,
        summary: true,
        ...(startDate && { startPublishedDate: startDate })
      }
    );

    // Process results
    const processedResults = result.results.map(item => ({
      title: item.title || "",
      url: item.url || "",
      content: item.summary || item.content || "",
      domain: new URL(item.url).hostname.replace('www.', '')
    }));

    // Cache results
    await prisma.exa_responses.create({
      data: {
        payload_md5: payloadHash,
        payload_json: { topic, startDate },
        response_json: processedResults
      }
    });

    return NextResponse.json(processedResults);
  } catch (error) {
    console.error('Error searching topic:', error);
    return NextResponse.json(
      { error: 'Failed to search topic' },
      { status: 500 }
    );
  }
}