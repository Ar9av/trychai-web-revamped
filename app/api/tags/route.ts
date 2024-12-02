import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const TAG_COST = 5;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const tags = await prisma.user_tags.findMany({
      where: { 
        user_id: userId,
        removed: false
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, tag } = await req.json();

    if (!userId || !tag) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check user credits
    const history = await prisma.credit_history.findMany({
      where: { user_id: userId }
    });

    const totalCredits = history.reduce((total, record) => {
      return total + (record.type === 'credit' ? record.value : -record.value);
    }, 0);

    if (totalCredits < TAG_COST) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        requiredCredits: TAG_COST,
        currentCredits: totalCredits
      }, { status: 400 });
    }

    // Create tag and deduct credits
    const [newTag] = await prisma.$transaction([
      prisma.user_tags.create({
        data: {
          user_id: userId,
          tag,
          removed: false
        }
      }),
      prisma.credit_history.create({
        data: {
          user_id: userId,
          type: 'debit',
          description: `New tag: ${tag}`,
          value: TAG_COST
        }
      })
    ]);

    return NextResponse.json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tag = searchParams.get('tag');

  if (!userId || !tag) {
    return NextResponse.json({ error: 'User ID and tag are required' }, { status: 400 });
  }

  try {
    await prisma.user_tags.updateMany({
      where: {
        user_id: userId,
        tag: tag
      },
      data: {
        removed: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}