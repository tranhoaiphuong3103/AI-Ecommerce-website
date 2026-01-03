import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('=== [Generate Route] HIT ===');

  try {
    const body = await request.json();
    const { userId, productId, productImageUrl: providedImageUrl, modelHeight, modelWeight } = body;

    console.log('[Image Generation] Request received:', {
      userId,
      productId,
      providedImageUrl,
      modelHeight,
      modelWeight,
    });

    if (!userId || !productId || !modelHeight || !modelWeight) {
      console.error('[Image Generation] Missing required fields');
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
      console.error('[Image Generation] Product not found:', productId);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productImageUrl = providedImageUrl || product.images[0]?.url;

    console.log('[Image Generation] Product found:', {
      productId: product.id,
      productName: product.name,
      selectedImageUrl: productImageUrl,
      primaryImage: product.images[0]?.url,
    });

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

    console.log('[Image Generation] Triggering background processing:', {
      imageId: video.id,
      processUrl,
      productImageUrl,
    });

    console.log('[Image Generation] Product image URL:', productImageUrl);

    if (!productImageUrl) {
      console.error('[Image Generation] No product image found!');
    }

    axios
      .post(processUrl, {
        imageId: video.id,
        userId,
        productId,
        productImageUrl,
        modelHeight,
        modelWeight,
      })
      .then((response) => {
        console.log(
          '[Image Generation] Background processing triggered successfully:',
          response.data,
        );
      })
      .catch((error) => {
        console.error('[Image Generation] Failed to trigger image processing:', {
          error: error.message,
          code: error.code,
          url: processUrl,
          response: error.response?.data,
        });
      });

    console.log('[Image Generation] Request completed, returning imageId:', video.id);

    return NextResponse.json({
      imageId: video.id,
      status: video.status,
      message: 'Image generation started',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack';
    console.error('[Image Generation] Unexpected error:', errorMessage);
    console.error('[Image Generation] Error stack:', errorStack);
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

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

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

    if (!generatedImage) {
      return NextResponse.json({ error: 'Generated image not found' }, { status: 404 });
    }

    return NextResponse.json(generatedImage);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch image status' }, { status: 500 });
  }
}
