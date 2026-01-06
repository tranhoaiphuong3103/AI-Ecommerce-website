import { generateToken, hashPassword } from '@/lib/auth';
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
    const { name, email, password } = body;

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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
    const response = NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
