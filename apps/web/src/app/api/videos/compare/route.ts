import { prisma } from '@/lib/prisma';
import { processImage } from '@/lib/video-processing';
import { waitUntil } from '@vercel/functions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productIds, variantIds, productImageUrls, modelHeight, modelWeight } = body;

    if (!userId || !productIds || productIds.length !== 2)
      return NextResponse.json(
        { error: 'Exactly 2 products required for comparison' },
        { status: 400 },
      );

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (products.length !== 2)
      return NextResponse.json({ error: 'Both products must exist' }, { status: 404 });

    const outfit = await prisma.outfit.create({
      data: {
        userId,
        name: `Comparison - ${new Date().toLocaleDateString()}`,
        description: 'Side-by-side product comparison',
        items: {
          create: products.map((product, index) => ({
            productId: product.id,
            variantId: variantIds?.[index] || null,
            order: index,
          })),
        },
      },
    });

    const imageUrls = productImageUrls || products.map((product) => product.images[0]?.url);

    const [imageA, imageB] = await Promise.all([
      prisma.generatedVideo.create({
        data: {
          userId,
          productId: productIds[0],
          modelHeight: modelHeight || 170,
          modelWeight: modelWeight || 65,
          videoUrl: '',
          status: 'PENDING',
        },
      }),
      prisma.generatedVideo.create({
        data: {
          userId,
          productId: productIds[1],
          modelHeight: modelHeight || 170,
          modelWeight: modelWeight || 65,
          videoUrl: '',
          status: 'PENDING',
        },
      }),
    ]);

    const outfitVideo = await prisma.outfitVideo.create({
      data: {
        outfitId: outfit.id,
        videoUrl: '',
        status: 'PENDING',
        modelHeight: modelHeight || 170,
        modelWeight: modelWeight || 65,
        compareImageAId: imageA.id,
        compareImageBId: imageB.id,
      },
    });

    waitUntil(
      Promise.all([
        processImage({
          imageId: imageA.id,
          productImageUrl: imageUrls[0],
          modelHeight: modelHeight || 170,
          modelWeight: modelWeight || 65,
          productId: productIds[0],
        }),
        processImage({
          imageId: imageB.id,
          productImageUrl: imageUrls[1],
          modelHeight: modelHeight || 170,
          modelWeight: modelWeight || 65,
          productId: productIds[1],
        }),
      ]),
    );

    return NextResponse.json({
      outfitId: outfit.id,
      outfitVideoId: outfitVideo.id,
      imageAId: imageA.id,
      imageBId: imageB.id,
      status: 'PENDING',
      message: 'Comparison generation started',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Comparison generation error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to generate comparison', details: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outfitVideoId = searchParams.get('outfitVideoId');

    if (!outfitVideoId)
      return NextResponse.json({ error: 'Outfit video ID required' }, { status: 400 });

    const outfitVideo = await prisma.outfitVideo.findUnique({
      where: { id: outfitVideoId },
      include: {
        outfit: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                variant: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        compareImageA: true,
        compareImageB: true,
      },
    });

    if (!outfitVideo)
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404 });

    const isComparison = outfitVideo.compareImageAId && outfitVideo.compareImageBId;

    let status = outfitVideo.status;
    if (isComparison && outfitVideo.compareImageA && outfitVideo.compareImageB) {
      const bothCompleted =
        outfitVideo.compareImageA.status === 'COMPLETED' &&
        outfitVideo.compareImageB.status === 'COMPLETED';
      const anyFailed =
        outfitVideo.compareImageA.status === 'FAILED' ||
        outfitVideo.compareImageB.status === 'FAILED';
      const anyProcessing =
        outfitVideo.compareImageA.status === 'PROCESSING' ||
        outfitVideo.compareImageB.status === 'PROCESSING';

      if (bothCompleted) status = 'COMPLETED';
      else if (anyFailed) status = 'FAILED';
      else if (anyProcessing) status = 'PROCESSING';
      else status = 'PENDING';

      if (status !== outfitVideo.status) {
        await prisma.outfitVideo.update({
          where: { id: outfitVideoId },
          data: { status },
        });
      }
    }

    return NextResponse.json({
      ...outfitVideo,
      status,
      isComparison,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comparison status' }, { status: 500 });
  }
}
