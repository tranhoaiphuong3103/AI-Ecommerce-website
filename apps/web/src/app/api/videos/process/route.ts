import { generateTryOnVideo } from '@/lib/replicate';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, productImageUrl, modelHeight, modelWeight, productId } = body;

    if (!videoId || !productImageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.generatedVideo.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' },
    });

    // Get product category and images for logo detection
    let productCategory = 'upperbody';
    let productImages: Array<{ url: string; alt: string | null }> = [];
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          images: {
            select: {
              url: true,
              alt: true,
            },
          },
        },
      });
      productCategory = product?.category?.name || 'upperbody';
      productImages = product?.images || [];
    }

    // Get user's photo from measurements or use default
    const video = await prisma.generatedVideo.findUnique({
      where: { id: videoId },
      include: {
        user: {
          include: {
            measurements: true,
          },
        },
      },
    });

    const personImageUrl =
      video?.user?.measurements?.photoUrl ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop';

    const result = await generateTryOnVideo({
      personImage: personImageUrl,
      garmentImage: productImageUrl,
      modelHeight,
      modelWeight,
      productCategory,
      productImages,
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
