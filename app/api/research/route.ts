import { NextResponse } from 'next/server';
import { generateResearchReport, generateSummaryFromAzure } from '@/lib/openai';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

const REPORT_COST = 50;
const SEARCH_COST = 10;

export async function POST(req: Request) {
  try {
    const { topic, outline, persona, user_email, user_id, isAssisted } = await req.json();
    const fixed_outline = outline || "";
    const fixed_persona = persona || "";
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Check user credits
    const history = await prisma.credit_history.findMany({
      where: { user_id: user_id }
    });

    const totalCredits = history.reduce((total, record) => {
      return total + (record.type === 'credit' ? record.value : -record.value);
    }, 0);
    console.log("Total credits", totalCredits);
    const requiredCredits = isAssisted ? 0 : (outline ? REPORT_COST : SEARCH_COST);
    console.log("Required credits", requiredCredits);
    console.log("Is assisted", isAssisted);

    if (totalCredits < requiredCredits) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        requiredCredits: requiredCredits,
        currentCredits: totalCredits
      }, { status: 400 });
    }
    const hash = crypto.createHash('md5')
      .update(JSON.stringify({ topic, fixed_outline, fixed_persona }))
      .digest('hex');
    
    const existingReport = await prisma.data_table_v2.findUnique({
      where: { md5_hash: hash },
      select: { md5_hash: true }
    });

    if (existingReport) {
      return NextResponse.json({ reportId: hash });
    }

    // Generate the research report
    console.log("Generating report");
    console.log("Topic", topic);
    console.log("Outline", fixed_outline);
    console.log("Persona", fixed_persona);
    console.log("Is assisted", isAssisted);
    let output = "";
    if (!isAssisted) {
      output = await generateSummaryFromAzure(topic) || "";
    } else {
      output = await generateResearchReport(topic, fixed_outline, fixed_persona) || "";
    }
    if (!output) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }

    // Save to database and deduct credits
    const [report] = await prisma.$transaction([
      prisma.data_table_v2.create({
        data: {
          md5_hash: hash,
          title: topic,
          payload: JSON.stringify({ topic, fixed_outline, fixed_persona }),
          output: JSON.stringify({ summary: output }),
          created_at: new Date(),
        },
      }),
      prisma.user_data.create({
        data: {
          user_email: String(user_email),
          md5_hash: hash,
          created_at: new Date(),
          private: true,
        },
      }),
      prisma.credit_history.create({
        data: {
          user_id: user_id,
          type: 'debit',
          description: `New ${outline ? 'report' : 'search'}: ${topic}`,
          value: requiredCredits
        }
      })
    ]);
    console.log("Report saved", report.md5_hash);
    return NextResponse.json({ reportId: report.md5_hash });
  } catch (error) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}