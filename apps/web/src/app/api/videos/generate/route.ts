import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, modelHeight, modelWeight } = body;

    if (!userId || !productId || !modelHeight || !modelWeight) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const video = await prisma.generatedVideo.create({
      data: {
        userId,
        productId,
        modelHeight,
        modelWeight,
        videoUrl: '',
        status: 'PENDING',
      },
    });

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/generate-video';

    await axios.post(n8nWebhookUrl, {
      videoId: video.id,
      userId,
      productId,
      productImageUrl: product.images[0]?.url,
      modelHeight,
      modelWeight,
    });

    return NextResponse.json({
      videoId: video.id,
      status: video.status,
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    const video = await prisma.generatedVideo.findUnique({
      where: { id: videoId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
