import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      'PENDING',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED',
    ];
    if (!validStatuses.includes(status))
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const previousOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { email: true, name: true },
        },
        items: {
          include: {
            product: { select: { name: true, price: true } },
          },
        },
      },
    });

    if (!previousOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: { email: true, name: true },
        },
        items: {
          include: {
            product: { select: { name: true, price: true } },
            variant: { select: { size: true, color: true } },
          },
        },
      },
    });

    if (previousOrder.status !== status)
      await triggerN8nWebhook({
        event: 'order.status_changed',
        orderId: order.id,
        previousStatus: previousOrder.status,
        newStatus: status,
        customerEmail: order.email || order.user.email,
        customerName: order.user.name || 'Customer',
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant
            ? `${item.variant.size}${item.variant.color ? ` / ${item.variant.color}` : ''}`
            : null,
        })),
      });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

async function triggerN8nWebhook(payload: {
  event: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  shippingAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant: string | null;
  }>;
}) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL not configured, skipping webhook');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) console.error('n8n webhook failed:', await response.text());
    else console.log('n8n webhook triggered successfully for order:', payload.orderId);
  } catch (error) {
    console.error('Failed to trigger n8n webhook:', error);
  }
}
