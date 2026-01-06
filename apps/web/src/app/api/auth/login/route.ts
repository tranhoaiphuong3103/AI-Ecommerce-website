import { comparePassword, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const userResponse: User = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json({
      token,
      user: userResponse,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
