import { NextResponse } from 'next/server';
import { generateResearchReport } from '@/lib/openai';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

const REPORT_COST = 50;

export async function POST(req: Request) {
  try {
    const { topic, outline, persona, user_email, user_id } = await req.json();
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
    if (totalCredits < REPORT_COST) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        requiredCredits: REPORT_COST,
        currentCredits: totalCredits
      }, { status: 400 });
    }

    const hash = crypto.createHash('md5')
      .update(JSON.stringify({ topic, outline, persona }))
      .digest('hex');
    
    const existingReport = await prisma.data_table_v2.findUnique({
      where: { md5_hash: hash },
      select: { md5_hash: true }
    });

    if (existingReport) {
      return NextResponse.json({ reportId: hash });
    }

    // Generate the research report
    const output = await generateResearchReport(topic, outline, persona);
    if (!output) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }

    // Save to database and deduct credits
    const [report] = await prisma.$transaction([
      prisma.data_table_v2.create({
        data: {
          md5_hash: hash,
          title: topic,
          payload: JSON.stringify({ topic, outline, persona }),
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
          user_id: user_email,
          type: 'debit',
          description: `New report: ${topic}`,
          value: REPORT_COST
        }
      })
    ]);

    return NextResponse.json({ reportId: report.md5_hash });
  } catch (error) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}