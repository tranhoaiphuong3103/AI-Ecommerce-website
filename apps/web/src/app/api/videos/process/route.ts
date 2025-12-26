import { generateTryOnVideo } from '@/lib/huggingface';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, productImageUrl, modelHeight, modelWeight } = body;

    if (!videoId || !productImageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.generatedVideo.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' },
    });

    const personImageUrl =
      'https://huggingface.co/datasets/yisol/IDM-VTON/resolve/main/human/00008_00.jpg';

    const result = await generateTryOnVideo({
      personImage: personImageUrl,
      garmentImage: productImageUrl,
      modelHeight,
      modelWeight,
    });

    if (result.status === 'failed') {
      await prisma.generatedVideo.update({
        where: { id: videoId },
        data: {
          status: 'FAILED',
        },
      });

      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await prisma.generatedVideo.update({
      where: { id: videoId },
      data: {
        status: 'COMPLETED',
        videoUrl: result.imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      videoId,
      videoUrl: result.imageUrl,
      message: 'Video generation completed',
    });
  } catch (error) {
    console.error('Error processing video:', error);

    const body = await request.json();
    if (body.videoId) {
      await prisma.generatedVideo.update({
        where: { id: body.videoId },
        data: {
          status: 'FAILED',
        },
      });
    }

    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
