import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import axios from 'axios';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (_err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
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
              status: 'PAID',
              stripePaymentId: session.payment_intent as string,
            },
          });

          const n8nWebhookUrl =
            process.env.N8N_ORDER_WEBHOOK_URL || 'http://n8n:5678/webhook/order-notification';

          await axios
            .post(n8nWebhookUrl, {
              orderId: order.id,
              userId: order.userId,
              eventType: 'payment.succeeded',
            })
            .catch((_err) => {});
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const _paymentIntent = event.data.object as Stripe.PaymentIntent;
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'CANCELLED',
            },
          });

          const n8nWebhookUrl =
            process.env.N8N_ORDER_WEBHOOK_URL || 'http://n8n:5678/webhook/order-notification';

          await axios
            .post(n8nWebhookUrl, {
              orderId,
              userId: paymentIntent.metadata?.userId,
              eventType: 'payment.failed',
              errorMessage:
                paymentIntent.last_payment_error?.message || 'Payment verification failed',
            })
            .catch((_err) => {});
        }
        break;
      }

      default:
    }

    return NextResponse.json({ received: true });
  } catch (_error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
