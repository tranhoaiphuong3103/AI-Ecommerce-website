'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GeneratedImage {
  id: string;
  videoUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  };
}

interface OutfitItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  };
  variant: {
    id: string;
    size: string;
    color: string | null;
  } | null;
}

interface OutfitVideo {
  id: string;
  videoUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  isComparison?: boolean;
  compareImageA?: GeneratedImage;
  compareImageB?: GeneratedImage;
  outfit: {
    id: string;
    name: string;
    items: OutfitItem[];
  };
}

export default function TryOnResultPage() {
  const params = useParams();
  const outfitId = params.outfitId as string;

  const [outfitVideo, setOutfitVideo] = useState<OutfitVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!outfitId) return;

    const fetchOutfitStatus = async () => {
      try {
        const compareResponse = await fetch(`/api/videos/compare?outfitVideoId=${outfitId}`);
        if (compareResponse.ok) {
          const data = await compareResponse.json();
          setOutfitVideo(data);

          if (data.status === 'PENDING' || data.status === 'PROCESSING')
            setTimeout(fetchOutfitStatus, 3000);

          return;
        }

        const response = await fetch(`/api/videos/generate-outfit?outfitVideoId=${outfitId}`);
        if (!response.ok) {
          const outfitResponse = await fetch(`/api/outfit/${outfitId}`);
          if (outfitResponse.ok) {
            const data = await outfitResponse.json();
            setOutfitVideo(data);
          } else setError('Outfit not found');

          return;
        }
        const data = await response.json();
        setOutfitVideo(data);

        if (data.status === 'PENDING' || data.status === 'PROCESSING')
          setTimeout(fetchOutfitStatus, 3000);
      } catch {
        setError('Failed to load outfit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutfitStatus();
  }, [outfitId]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading your try-on...</h2>
            <p className="text-gray-600">Please wait while we fetch your results</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-16">
          <svg
            className="w-24 h-24 mx-auto text-red-500 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <Link
            href="/cart"
            className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );

  const isComparison = outfitVideo?.isComparison;
  const isPending = outfitVideo?.status === 'PENDING' || outfitVideo?.status === 'PROCESSING';
  const isCompleted = outfitVideo?.status === 'COMPLETED';
  const isFailed = outfitVideo?.status === 'FAILED';

  const getProductImage = (item: OutfitItem) => {
    const variantColor = item.variant?.color;
    const colorMatchedImage = variantColor
      ? item.product.images.find((img) => img.alt?.startsWith(variantColor))
      : null;
    const primaryImage = item.product.images.find((img) => img.isPrimary);
    return colorMatchedImage?.url || primaryImage?.url || item.product.images[0]?.url;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isComparison ? 'Compare Try-On Results' : 'Your Outfit Try-On'}
        </h1>

        {isPending && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isComparison ? 'Generating comparison images...' : 'Generating your try-on...'}
            </h2>
            <p className="text-gray-600">
              {isComparison
                ? 'Our AI is creating both try-on images. This may take a couple of minutes.'
                : 'Our AI is creating your personalized outfit preview. This may take a minute.'}
            </p>
            {isComparison && outfitVideo?.compareImageA && outfitVideo?.compareImageB && (
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full ${outfitVideo.compareImageA.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : outfitVideo.compareImageA.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  Image A: {outfitVideo.compareImageA.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full ${outfitVideo.compareImageB.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : outfitVideo.compareImageB.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  Image B: {outfitVideo.compareImageB.status}
                </span>
              </div>
            )}
          </div>
        )}

        {isFailed && (
          <div className="bg-red-50 rounded-2xl p-8 text-center mb-8">
            <svg
              className="w-16 h-16 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">Generation Failed</h2>
            <p className="text-red-600 mb-4">
              We couldn&apos;t generate your try-on. Please try again.
            </p>
            <Link
              href="/cart"
              className="inline-block bg-black text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
            >
              Try Again
            </Link>
          </div>
        )}

        {isCompleted && isComparison && outfitVideo?.compareImageA && outfitVideo?.compareImageB && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-center">
                    {outfitVideo.outfit?.items[0]?.product.name || 'Product A'}
                  </h3>
                </div>
                {outfitVideo.compareImageA.videoUrl ? (
                  <img
                    src={outfitVideo.compareImageA.videoUrl}
                    alt="Try-on result A"
                    className="w-full max-h-[500px] object-contain mx-auto p-4"
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-400">
                    Image not available
                  </div>
                )}
                <div className="p-4 border-t border-gray-200">
                  <p className="text-center font-bold text-xl">
                    ${outfitVideo.outfit?.items[0]?.product.price.toFixed(2)}
                  </p>
                  <Link
                    href={`/products/${outfitVideo.outfit?.items[0]?.product.slug}`}
                    className="block mt-2 text-center text-sm text-gray-600 hover:text-black underline"
                  >
                    View Product
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-center">
                    {outfitVideo.outfit?.items[1]?.product.name || 'Product B'}
                  </h3>
                </div>
                {outfitVideo.compareImageB.videoUrl ? (
                  <img
                    src={outfitVideo.compareImageB.videoUrl}
                    alt="Try-on result B"
                    className="w-full max-h-[500px] object-contain mx-auto p-4"
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-400">
                    Image not available
                  </div>
                )}
                <div className="p-4 border-t border-gray-200">
                  <p className="text-center font-bold text-xl">
                    ${outfitVideo.outfit?.items[1]?.product.price.toFixed(2)}
                  </p>
                  <Link
                    href={`/products/${outfitVideo.outfit?.items[1]?.product.slug}`}
                    className="block mt-2 text-center text-sm text-gray-600 hover:text-black underline"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCompleted && !isComparison && outfitVideo?.videoUrl && (
          <div className="mb-8">
            <div className="bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={outfitVideo.videoUrl}
                alt="Your outfit try-on"
                className="w-full max-h-[600px] object-contain mx-auto"
              />
            </div>
          </div>
        )}

        {!isComparison && outfitVideo?.outfit?.items && outfitVideo.outfit.items.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Items in this outfit</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {outfitVideo.outfit.items.map((item) => {
                const imageUrl = getProductImage(item);

                return (
                  <Link key={item.id} href={`/products/${item.product.slug}`} className="group">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:underline">
                      {item.product.name}
                    </p>
                    <p className="text-sm font-bold">${item.product.price.toFixed(2)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/cart"
            className="flex-1 py-3 border-2 border-black text-black font-bold text-center uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-full"
          >
            Back to Cart
          </Link>
          <Link
            href="/checkout"
            className="flex-1 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
