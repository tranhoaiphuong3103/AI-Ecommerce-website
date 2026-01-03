import { prisma } from '@/lib/prisma';
import { generateTryOnImage } from '@/lib/replicate';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let imageId: string | undefined;

  try {
    const body = await request.json();
    const { imageId: id, productImageUrl, modelHeight, modelWeight, productId } = body;
    imageId = id;

    if (!imageId || !productImageUrl)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    await prisma.generatedVideo.update({
      where: { id: imageId },
      data: { status: 'PROCESSING' },
    });
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

    const generatedImage = await prisma.generatedVideo.findUnique({
      where: { id: imageId },
      include: {
        user: {
          include: {
            measurements: true,
          },
        },
      },
    });

    const personImageUrl =
      generatedImage?.user?.measurements?.photoUrl ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop';

    const result = await generateTryOnImage({
      personImage: personImageUrl,
      garmentImage: productImageUrl,
      modelHeight,
      modelWeight,
      productCategory,
      productImages,
    });

    if (result.status === 'failed') {
      await prisma.generatedVideo.update({
        where: { id: imageId },
        data: {
          status: 'FAILED',
        },
      });

      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await prisma.generatedVideo.update({
      where: { id: imageId },
      data: {
        status: 'COMPLETED',
        videoUrl: result.imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      imageId,
      imageUrl: result.imageUrl,
      message: 'Image generation completed',
    });
  } catch (error) {
    if (imageId) {
      try {
        await prisma.generatedVideo.update({
          where: { id: imageId },
          data: {
            status: 'FAILED',
          },
        });
      } catch (dbError) {
        console.error('Failed to update image generation status:', dbError);
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
