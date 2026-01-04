'use client';

import type { FeaturedProduct } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import type { Step } from 'react-joyride';
import OnboardingTour from './OnboardingTour';

interface HomeContentProps {
  featuredProducts: FeaturedProduct[];
}

export default function HomeContent({ featuredProducts }: HomeContentProps) {
  const router = useRouter();

  const tourSteps: Step[] = useMemo(
    () => [
      {
        target: '#nav-products',
        title: 'Browse Products',
        content: 'Click here to explore our full collection of clothing items.',
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '#nav-how-it-works',
        title: 'How It Works',
        content: 'Learn how our AI virtual try-on technology works in 3 simple steps.',
        placement: 'bottom',
      },
      {
        target: '#nav-cart',
        title: 'Shopping Cart',
        content: 'View items in your cart and proceed to checkout.',
        placement: 'bottom',
      },
      {
        target: '#nav-profile, #nav-sign-in',
        title: 'Your Account',
        content:
          'Sign in to upload your photo for personalized try-on results and manage your profile.',
        placement: 'bottom',
      },
      {
        target: '#shop-now-button',
        title: 'Start Shopping',
        content: 'Click here to browse all products and find your perfect outfit.',
        placement: 'bottom',
      },
      {
        target: '#featured-products',
        title: 'Featured Products',
        content: 'Check out our curated selection of trending items.',
        placement: 'top',
      },
      {
        target: '#try-on-home-button',
        title: 'Quick Try-On',
        content: 'Click "Try On" on any product to see how it looks on you using AI!',
        placement: 'top',
      },
    ],
    [],
  );

  return (
    <div className="bg-white">
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight uppercase tracking-tight">
            Try Before
            <br />
            You Buy
          </h2>
          <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
            See how clothes look on a virtual model that matches your body type before you buy.
          </p>
          <Link
            id="shop-now-button"
            href="/products"
            className="inline-block bg-white text-black px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-full"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-3 uppercase tracking-tight">
              Featured Products
            </h3>
            <p className="text-gray-600 text-lg">
              Try before you buy with AI-powered visualization
            </p>
          </div>

          <div
            id="featured-products"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredProducts.map((product, index) => {
              const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-gray-200 hover:border-black transition-colors flex flex-col rounded-lg overflow-hidden"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-square bg-gray-100 overflow-hidden block"
                  >
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 font-medium text-lg">{product.name}</span>
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
                        {product.badge}
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-sm mb-2 text-black uppercase line-clamp-2 min-h-[40px] hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-black font-bold text-xl mb-4">${product.price.toFixed(2)}</p>
                    <button
                      id={index === 0 ? 'try-on-home-button' : undefined}
                      type="button"
                      onClick={() => router.push(`/products/${product.slug}?tryOn=true`)}
                      className="block w-full bg-black text-white py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors mt-auto rounded-full text-center"
                    >
                      Try On
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-100 py-16 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black uppercase tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">Three simple steps to your perfect fit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 mx-auto mb-6 flex items-center justify-center font-bold text-2xl rounded-2xl">
                1
              </div>
              <h3 className="font-bold text-xl mb-3 text-black uppercase">Upload Photo</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your photo or input your body measurements
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 mx-auto mb-6 flex items-center justify-center font-bold text-2xl rounded-2xl">
                2
              </div>
              <h3 className="font-bold text-xl mb-3 text-black uppercase">Pick Product</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our collection and select the item you love
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 mx-auto mb-6 flex items-center justify-center font-bold text-2xl rounded-2xl">
                3
              </div>
              <h3 className="font-bold text-xl mb-3 text-black uppercase">AI Try-On</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch AI generate your personalized try-on in seconds
              </p>
            </div>
          </div>
        </div>
      </section>
      <OnboardingTour steps={tourSteps} tourKey="home" />
    </div>
  );
}
