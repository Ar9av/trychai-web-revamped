import { NextResponse } from "next/server";
import { generateResearchReport } from "@/lib/openai";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

export async function GET() {}

export async function POST(request: Request) {
  try {
    const { topic, outline, persona } = await request.json();

    // Generate report
    const report = await generateResearchReport(topic, outline, persona);

    // Create MD5 hash of the report
    const md5Hash = createHash('md5').update(report).digest('hex');

    // Save to database
    const savedReport = await prisma.data_table_v2.create({
      data: {
        title: topic,
        md5_hash: md5Hash,
        payload: JSON.stringify({ topic, outline, persona }),
        output: report,
      },
    });

    return NextResponse.json({
      success: true,
      report,
      reportId: savedReport.id,
    });
  } catch (error) {
    console.error('Error in research endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate research report' },
      { status: 500 }
    );
  }
}