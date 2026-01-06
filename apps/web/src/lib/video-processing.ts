import { prisma } from '@/lib/prisma';
import { generateTryOnImage } from '@/lib/replicate';

interface ProcessImageParams {
  imageId: string;
  productImageUrl: string;
  modelHeight: number;
  modelWeight: number;
  productId?: string;
}

export async function processImage(params: ProcessImageParams): Promise<void> {
  const { imageId, productImageUrl, modelHeight, modelWeight, productId } = params;

  try {
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
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=900&fit=crop&crop=top';

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
        data: { status: 'FAILED' },
      });
      console.error('Image generation failed:', result.error);
      return;
    }

    await prisma.generatedVideo.update({
      where: { id: imageId },
      data: {
        status: 'COMPLETED',
        videoUrl: result.imageUrl,
        updatedAt: new Date(),
      },
    });

    console.log('Image generation completed:', imageId);
  } catch (error) {
    console.error('Failed to process image:', error);
    try {
      await prisma.generatedVideo.update({
        where: { id: imageId },
        data: { status: 'FAILED' },
      });
    } catch (dbError) {
      console.error('Failed to update image generation status:', dbError);
    }
  }
}

interface ProcessOutfitParams {
  outfitVideoId: string;
  outfitId: string;
  userId: string;
  productIds: string[];
  productImageUrls: string[];
  modelHeight: number;
  modelWeight: number;
}

export async function processOutfit(params: ProcessOutfitParams): Promise<void> {
  const { outfitVideoId, productImageUrls, modelHeight, modelWeight } = params;

  try {
    await prisma.outfitVideo.update({
      where: { id: outfitVideoId },
      data: { status: 'PROCESSING' },
    });

    const outfitVideo = await prisma.outfitVideo.findUnique({
      where: { id: outfitVideoId },
      include: {
        outfit: {
          include: {
            user: {
              include: {
                measurements: true,
              },
            },
          },
        },
      },
    });

    const personImageUrl =
      outfitVideo?.outfit?.user?.measurements?.photoUrl ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=900&fit=crop&crop=top';

    const primaryImageUrl = productImageUrls[0];
    if (!primaryImageUrl) {
      await prisma.outfitVideo.update({
        where: { id: outfitVideoId },
        data: { status: 'FAILED' },
      });
      return;
    }

    const result = await generateTryOnImage({
      personImage: personImageUrl,
      garmentImage: primaryImageUrl,
      modelHeight,
      modelWeight,
      productCategory: 'upperbody',
      productImages: productImageUrls.map((url) => ({ url, alt: null })),
    });

    if (result.status === 'failed') {
      await prisma.outfitVideo.update({
        where: { id: outfitVideoId },
        data: { status: 'FAILED' },
      });
      console.error('Outfit generation failed:', result.error);
      return;
    }

    await prisma.outfitVideo.update({
      where: { id: outfitVideoId },
      data: {
        status: 'COMPLETED',
        videoUrl: result.imageUrl,
        updatedAt: new Date(),
      },
    });

    console.log('Outfit generation completed:', outfitVideoId);
  } catch (error) {
    console.error('Failed to process outfit:', error);
    try {
      await prisma.outfitVideo.update({
        where: { id: outfitVideoId },
        data: { status: 'FAILED' },
      });
    } catch (dbError) {
      console.error('Failed to update outfit status:', dbError);
    }
  }
}
