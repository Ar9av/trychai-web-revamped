import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const perPage = 20;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [articles, total] = await Promise.all([
      prisma.saved_articles.findMany({
        where: {
          user_id: userId,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { domain: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.saved_articles.count({
        where: {
          user_id: userId,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { domain: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      articles,
      total,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, title, url, content, domain, sourceType } = await req.json();

    if (!userId || !title || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const article = await prisma.saved_articles.create({
      data: {
        user_id: userId,
        title,
        url,
        content,
        domain,
        source_type: sourceType || 'news',
      },
    });

    return NextResponse.json(article);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Article already saved' },
        { status: 400 }
      );
    }
    console.error('Error saving article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const url = searchParams.get('url');

  if (!userId || !url) {
    return NextResponse.json(
      { error: 'User ID and URL are required' },
      { status: 400 }
    );
  }

  try {
    await prisma.saved_articles.deleteMany({
      where: {
        user_id: userId,
        url: url,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}