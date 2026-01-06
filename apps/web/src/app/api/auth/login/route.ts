import { comparePassword, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';
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
    const { email, password } = body;

    if (!email || !password) {
      const response = NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const response = NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      const response = NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const userResponse: User = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const response = NextResponse.json({
      token,
      user: userResponse,
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch {
    const response = NextResponse.json({ error: 'Failed to login' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
