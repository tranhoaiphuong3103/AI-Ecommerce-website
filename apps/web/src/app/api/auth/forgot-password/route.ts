import { generateResetToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      const response = NextResponse.json({ error: 'Email is required' }, { status: 400 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const response = NextResponse.json({
        message: 'If an account with that email exists, we sent a password reset link',
      });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const resetToken = generateResetToken(email);
    const resetUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/resetpassword/${resetToken}`;

    console.log('Password reset link:', resetUrl);

    const response = NextResponse.json({
      message: 'If an account with that email exists, we sent a password reset link',
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch {
    const response = NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 },
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
