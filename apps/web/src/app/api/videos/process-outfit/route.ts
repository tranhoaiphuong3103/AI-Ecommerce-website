import { prisma } from '@/lib/prisma';
import { generateTryOnImage } from '@/lib/replicate';
import { NextResponse } from 'next/server';

interface GarmentInfo {
  imageUrl: string;
  category: 'upper_body' | 'lower_body' | 'dresses';
  productCategory?: string;
}

function detectGarmentCategory(categoryName?: string): 'upper_body' | 'lower_body' | 'dresses' {
  if (!categoryName) return 'upper_body';

  const lower = categoryName.toLowerCase();

  if (
    lower.includes('pant') ||
    lower.includes('trouser') ||
    lower.includes('jean') ||
    lower.includes('short') ||
    lower.includes('skirt') ||
    lower.includes('legging')
  )
    return 'lower_body';

  if (lower.includes('dress') || lower.includes('gown') || lower.includes('jumpsuit'))
    return 'dresses';

  return 'upper_body';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outfitVideoId, userId, productIds, productImageUrls, modelHeight, modelWeight } = body;

    if (!outfitVideoId || !userId || !productImageUrls || productImageUrls.length === 0)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    await prisma.outfitVideo.update({
      where: { id: outfitVideoId },
      data: { status: 'PROCESSING' },
    });

    const userMeasurements = await prisma.userMeasurements.findUnique({
      where: { userId },
    });

    let currentPersonImage =
      userMeasurements?.photoUrl ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=900&fit=crop&crop=top';

    const products = productIds
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          include: { category: true },
        })
      : [];

    const garments: GarmentInfo[] = productImageUrls.map((url: string, index: number) => {
      const product = products[index];
      const categoryName = product?.category?.name;
      return {
        imageUrl: url,
        category: detectGarmentCategory(categoryName),
        productCategory: categoryName,
      };
    });

    const sortedGarments = [...garments].sort((a, b) => {
      const order = { upper_body: 0, dresses: 1, lower_body: 2 };
      return order[a.category] - order[b.category];
    });

    let lastSuccessfulResult: { imageUrl: string; status: 'success' | 'failed' } | null = null;

    for (const garment of sortedGarments) {
      const result = await generateTryOnImage({
        personImage: currentPersonImage,
        garmentImage: garment.imageUrl,
        category: garment.category,
        productCategory: garment.productCategory,
        modelHeight: modelHeight || userMeasurements?.height || 170,
        modelWeight: modelWeight || userMeasurements?.weight || 65,
      });

      if (result.status === 'success' && result.imageUrl) {
        currentPersonImage = result.imageUrl;
        lastSuccessfulResult = result;
      } else {
        console.error(`Failed to apply garment (${garment.category}):`, result.error);
      }
    }

    if (lastSuccessfulResult?.imageUrl) {
      await prisma.outfitVideo.update({
        where: { id: outfitVideoId },
        data: {
          status: 'COMPLETED',
          videoUrl: lastSuccessfulResult.imageUrl,
        },
      });

      return NextResponse.json({
        success: true,
        imageUrl: lastSuccessfulResult.imageUrl,
        status: 'COMPLETED',
      });
    }

    await prisma.outfitVideo.update({
      where: { id: outfitVideoId },
      data: { status: 'FAILED' },
    });

    return NextResponse.json({ error: 'Failed to generate outfit try-on' }, { status: 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Outfit processing failed:', errorMessage);

    try {
      const body = await request.clone().json();
      if (body.outfitVideoId)
        await prisma.outfitVideo.update({
          where: { id: body.outfitVideoId },
          data: { status: 'FAILED' },
        });
    } catch {
      console.error('Failed to update outfit video status');
    }

    return NextResponse.json(
      { error: 'Processing failed', details: errorMessage },
      { status: 500 },
    );
  }
}
