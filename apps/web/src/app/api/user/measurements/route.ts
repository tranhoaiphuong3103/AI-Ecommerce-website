import { prisma } from '@/lib/prisma';
import type { UserMeasurements } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const measurements = await prisma.userMeasurements.findUnique({
      where: { userId },
    });

    return NextResponse.json({ measurements });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, measurements } = body;

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const existingMeasurements = await prisma.userMeasurements.findUnique({
      where: { userId },
    });

    let result: UserMeasurements;
    if (existingMeasurements) {
      result = await prisma.userMeasurements.update({
        where: { userId },
        data: {
          height: measurements.height,
          weight: measurements.weight,
          chest: measurements.chest,
          waist: measurements.waist,
          hips: measurements.hips,
          shoulder: measurements.shoulder,
          skinTone: measurements.skinTone,
          hairColor: measurements.hairColor,
          gender: measurements.gender,
        },
      });
    } else {
      result = await prisma.userMeasurements.create({
        data: {
          userId,
          height: measurements.height,
          weight: measurements.weight,
          chest: measurements.chest,
          waist: measurements.waist,
          hips: measurements.hips,
          shoulder: measurements.shoulder,
          skinTone: measurements.skinTone,
          hairColor: measurements.hairColor,
          gender: measurements.gender,
        },
      });
    }

    return NextResponse.json({ success: true, measurements: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save measurements';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
