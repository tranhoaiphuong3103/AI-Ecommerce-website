import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    itemId: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity, variantId } = body;

    const updateData: { quantity?: number; variantId?: string } = {};

    if (quantity !== undefined) {
      if (quantity < 1) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
      updateData.quantity = quantity;
    }

    if (variantId !== undefined) updateData.variantId = variantId;

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });

    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              select: { id: true, url: true, alt: true, isPrimary: true, order: true },
              orderBy: { order: 'asc' as const },
            },
            variants: {
              select: { id: true, size: true, color: true, sku: true, stock: true },
            },
          },
        },
        variant: {
          select: { id: true, size: true, color: true, sku: true, stock: true },
        },
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete cart item:', error);
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}
