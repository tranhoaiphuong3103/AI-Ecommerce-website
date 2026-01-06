import Stripe from 'stripe';

// Lazy initialization - only create Stripe instance when actually used
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripeInstance;
}

export const stripe = {
  get paymentIntents() {
    return getStripe().paymentIntents;
  },
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

export async function createPaymentIntent(amount: number, currency = 'usd') {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });
}

export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>,
  customerEmail?: string,
) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    customer_email: customerEmail,
  });
}
