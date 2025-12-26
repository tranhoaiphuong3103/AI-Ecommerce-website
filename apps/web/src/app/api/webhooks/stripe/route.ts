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
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
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
            .catch((err) => {
              console.error('Failed to trigger n8n order notification:', err.message);
            });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        console.error('Payment failed:', paymentIntent.id);

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
            .catch((err) => {
              console.error('Failed to trigger n8n order notification:', err.message);
            });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
