import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { toast } from 'react-toastify';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, productImageUrl: providedImageUrl, modelHeight, modelWeight } = body;

    if (!userId || !productId || !modelHeight || !modelWeight)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const productImageUrl = providedImageUrl || product.images[0]?.url;

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

    const processUrl = process.env.NEXT_PUBLIC_WEB_URL
      ? `${process.env.NEXT_PUBLIC_WEB_URL}/api/videos/process`
      : 'http://localhost:3000/api/videos/process';

    axios
      .post(processUrl, {
        imageId: video.id,
        userId,
        productId,
        productImageUrl,
        modelHeight,
        modelWeight,
      })
      .catch(() => {
        toast.error('Failed to trigger image processing');
      });

    return NextResponse.json({
      imageId: video.id,
      status: video.status,
      message: 'Image generation started',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack';
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) return NextResponse.json({ error: 'Image ID required' }, { status: 400 });

    const generatedImage = await prisma.generatedVideo.findUnique({
      where: { id: imageId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!generatedImage)
      return NextResponse.json({ error: 'Generated image not found' }, { status: 404 });

    return NextResponse.json(generatedImage);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch image status' }, { status: 500 });
  }
}
