import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const savedPeople = await prisma.saved_people.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(savedPeople);
  } catch (error) {
    console.error('Error fetching saved people:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, person, tags } = await req.json();

    if (!userId || !person) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const savedPerson = await prisma.saved_people.create({
      data: {
        user_id: userId,
        author: person.author || null,
        external_id: person.id || null,
        image_url: person.image || null,
        published_date: person.publishedDate ? new Date(person.publishedDate) : null,
        score: person.score || null,
        summary: person.summary || null,
        title: person.title || null,
        url: person.url || null,
        tags: tags || null
      },
    });

    return NextResponse.json(savedPerson);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Profile already saved' }, { status: 400 });
    }
    console.error('Error saving person:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const url = searchParams.get('url');

  if (!userId || !url) {
    return NextResponse.json({ error: 'User ID and URL are required' }, { status: 400 });
  }

  try {
    await prisma.saved_people.deleteMany({
      where: {
        user_id: userId,
        url: url,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved person:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}