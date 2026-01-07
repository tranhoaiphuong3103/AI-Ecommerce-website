import { hashPassword, verifyResetToken } from '@/lib/auth';
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
    const { token, password } = body;

    if (!token || !password) {
      const response = NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    if (password.length < 6) {
      const response = NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const payload = verifyResetToken(token);

    if (!payload) {
      const response = NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 },
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { email: payload.email },
      data: { password: hashedPassword },
    });

    const response = NextResponse.json({
      message: 'Password reset successfully',
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch {
    const response = NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
