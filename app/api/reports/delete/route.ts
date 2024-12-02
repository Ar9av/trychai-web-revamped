import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const { user_email, md5_hash } = await request.json();

    if (!user_email || !md5_hash) {
      return NextResponse.json(
        { error: 'User email and hash are required' },
        { status: 400 }
      );
    }

    // Delete from user_data first due to foreign key constraint
    await prisma.user_data.deleteMany({
      where: {
        user_email,
        md5_hash,
      },
    });

    // Then delete from data_table_v2
    await prisma.data_table_v2.delete({
      where: {
        md5_hash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}