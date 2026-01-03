import { uploadFile } from '@/lib/minio';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and user ID required' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `user-${userId}-${Date.now()}.${file.name.split('.').pop()}`;
    const photoUrl = await uploadFile('avatars', fileName, buffer, {
      'Content-Type': file.type,
    });
    const measurements = await prisma.userMeasurements.upsert({
      where: { userId },
      update: { photoUrl },
      create: {
        userId,
        height: 170,
        weight: 65,
        photoUrl,
      },
    });

    return NextResponse.json({ success: true, photoUrl, measurements });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to upload photo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
