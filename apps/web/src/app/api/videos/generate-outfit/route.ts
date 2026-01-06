import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { toast } from 'react-toastify';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productIds, variantIds, productImageUrls, modelHeight, modelWeight } = body;

    if (!userId || !productIds || productIds.length === 0)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (products.length === 0)
      return NextResponse.json({ error: 'No products found' }, { status: 404 });

    const outfit = await prisma.outfit.create({
      data: {
        userId,
        name: `Outfit - ${new Date().toLocaleDateString()}`,
        description: `Try-on outfit with ${products.length} items`,
        items: {
          create: products.map((product, index) => ({
            productId: product.id,
            variantId: variantIds?.[index] || null,
            order: index,
          })),
        },
      },
    });

    const outfitVideo = await prisma.outfitVideo.create({
      data: {
        outfitId: outfit.id,
        videoUrl: '',
        status: 'PENDING',
        modelHeight: modelHeight || 170,
        modelWeight: modelWeight || 65,
      },
    });

    const processUrl = process.env.NEXT_PUBLIC_WEB_URL
      ? `${process.env.NEXT_PUBLIC_WEB_URL}/api/videos/process-outfit`
      : 'http://localhost:3000/api/videos/process-outfit';

    const imageUrls =
      productImageUrls || products.map((product) => product.images[0]?.url).filter(Boolean);

    axios
      .post(processUrl, {
        outfitVideoId: outfitVideo.id,
        outfitId: outfit.id,
        userId,
        productIds,
        productImageUrls: imageUrls,
        modelHeight: modelHeight || 170,
        modelWeight: modelWeight || 65,
      })
      .catch((error) => {
        console.error('Failed to trigger outfit processing:', error);
      });

    return NextResponse.json({
      outfitId: outfit.id,
      outfitVideoId: outfitVideo.id,
      status: outfitVideo.status,
      message: 'Outfit try-on generation started',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(errorMessage);
    return NextResponse.json(
      { error: 'Failed to generate outfit try-on', details: errorMessage },
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
            },
          },
        },
      },
    });

    if (!outfitVideo)
      return NextResponse.json({ error: 'Outfit video not found' }, { status: 404 });

    return NextResponse.json(outfitVideo);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch outfit status' }, { status: 500 });
  }
}
