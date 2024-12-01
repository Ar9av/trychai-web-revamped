import { NextResponse } from 'next/server';
import { generateResearchReport } from '@/lib/openai';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { topic, outline, persona } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Generate the research report
    const output = await generateResearchReport(topic, outline, persona);
    console.log("outt:", output);
    if (!output) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }

    // Create MD5 hash of the input parameters
    const hash = crypto.createHash('md5')
      .update(JSON.stringify({ topic, outline, persona }))
      .digest('hex');

    // Save to database
    const report = await prisma.data_table_v2.create({
      data: {
        md5_hash: hash,
        title: topic,
        payload: JSON.stringify({ topic, outline, persona }),
        output: JSON.stringify({ content: output }),
        created_at: new Date(),
      },
    });

    return NextResponse.json({ reportId: report.md5_hash });
  } catch (error) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}