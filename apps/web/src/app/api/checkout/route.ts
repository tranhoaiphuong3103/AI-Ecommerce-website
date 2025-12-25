import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    });

    const lineItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.images
              .filter((img) => img.isPrimary)
              .map((img) => img.url)
              .slice(0, 1),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const totalAmount = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        shippingAddress: '',
        items: {
          create: items.map((item: { productId: string; variantId?: string; quantity: number }) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: product?.price || 0,
            };
          }),
        },
      },
    });

    const successUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/order/success?orderId=${order.id}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/cart`;

    const session = await createCheckoutSession(
      lineItems,
      successUrl,
      cancelUrl,
      { orderId: order.id }
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
