'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
  variant: {
    size: string;
    color: string | null;
  } | null;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading)
    return (
      <div className="min-h-screen py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );

  if (!orderId)
    return (
      <div className="min-h-screen py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
          >
            Go Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item) => {
                const primaryImage = item.product.images.find((img) => img.isPrimary);
                const imageUrl = primaryImage?.url || item.product.images[0]?.url;

                return (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {item.variant.size}
                          {item.variant.color && ` / ${item.variant.color}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-900 font-bold text-lg">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Check your email</h3>
              <p className="text-sm text-gray-600">
                We&apos;ve sent a confirmation email with your order details. You&apos;ll receive
                another email when your order ships.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="flex-1 py-3 border-2 border-black text-black font-bold text-center uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-full"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 py-3 bg-black text-white font-bold text-center uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-12 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
