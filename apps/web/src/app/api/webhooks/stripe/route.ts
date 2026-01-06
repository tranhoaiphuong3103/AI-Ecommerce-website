import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

async function triggerN8nWebhook(payload: Record<string, unknown>) {
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
    else console.log('n8n webhook triggered successfully');
  } catch (error) {
    console.error('Failed to trigger n8n webhook:', error);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });

  let event: Stripe.Event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    console.error('Secret starts with:', webhookSecret.substring(0, 10));
    return NextResponse.json(
      { error: 'Invalid signature', details: errorMessage },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PROCESSING',
              stripePaymentId: session.payment_intent as string,
            },
            include: {
              user: { select: { email: true, name: true } },
              items: {
                include: {
                  product: { select: { name: true, price: true } },
                  variant: { select: { size: true, color: true } },
                },
              },
            },
          });

          await triggerN8nWebhook({
            event: 'order.payment_completed',
            orderId: order.id,
            previousStatus: 'PENDING',
            newStatus: 'PROCESSING',
            customerEmail: session.customer_email || order.user.email,
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
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
            include: { user: { select: { email: true, name: true } } },
          });

          await triggerN8nWebhook({
            event: 'order.payment_failed',
            orderId,
            customerEmail: order.user.email,
            customerName: order.user.name || 'Customer',
            errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
          });
        }
        break;
      }

      default:
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
