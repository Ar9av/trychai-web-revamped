import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const COUPONS = {
  'trych500': 500
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const history = await prisma.credit_history.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    const totalCredits = history.reduce((total, record) => {
      return total + (record.type === 'credit' ? record.value : -record.value);
    }, 0);

    return NextResponse.json({ history, totalCredits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, couponCode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const credits = COUPONS[couponCode as keyof typeof COUPONS];
    if (!credits) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    // Check if coupon was already used
    const existingCoupon = await prisma.credit_history.findFirst({
      where: {
        user_id: userId,
        description: `Coupon: ${couponCode}`
      }
    });

    if (existingCoupon) {
      return NextResponse.json({ error: 'Coupon already used' }, { status: 400 });
    }

    const record = await prisma.credit_history.create({
      data: {
        user_id: userId,
        type: 'credit',
        description: `Coupon: ${couponCode}`,
        value: credits
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}