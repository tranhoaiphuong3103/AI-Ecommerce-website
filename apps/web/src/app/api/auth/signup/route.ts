import { generateToken, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';
import { NextResponse } from 'next/server';

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

    return NextResponse.json({
      token,
      user: userResponse,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
