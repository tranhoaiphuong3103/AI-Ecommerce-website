'use client';

import type { Product, ProductVariant } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import BeforeAfterComparison from './BeforeAfterComparison';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const autoTryOnTriggered = useRef(false);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const primaryColor = primaryImage?.alt?.split(' - ')[0] || null;

  const [selectedImage, setSelectedImage] = useState(primaryImage);
  const [selectedColor, setSelectedColor] = useState<string | null>(primaryColor);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (primaryColor) {
      return product.variants.find((v) => v.color === primaryColor) || product.variants[0] || null;
    }
    return product.variants[0] || null;
  });
  const [quantity, setQuantity] = useState(1);
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const sortSizes = (sizes: string[]) => {
    return sizes.sort((a, b) => {
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

      const aNum = Number.parseFloat(a.replace(/\D/g, ''));
      const bNum = Number.parseFloat(b.replace(/\D/g, ''));

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

      return a.localeCompare(b);
    });
  };

  const availableSizes = sortSizes(Array.from(new Set(product.variants.map((v) => v.size))));
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => c !== null)),
  );

  const filteredImages = selectedColor
    ? product.images.filter((img) => img.alt?.startsWith(selectedColor))
    : product.images;

  const displayImages = filteredImages.length > 0 ? filteredImages : product.images;

  useEffect(() => {
    if (selectedColor) {
      const colorImages = product.images.filter((img) => img.alt?.startsWith(selectedColor));
      if (colorImages.length > 0 && !colorImages.find((img) => img.id === selectedImage?.id))
        setSelectedImage(colorImages[0]);
    }
  }, [selectedColor, product.images, selectedImage]);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);
      const userId = userData.id;

      try {
        const response = await fetch(`/api/user/measurements?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.measurements?.photoUrl) setUserPhotoUrl(data.measurements.photoUrl);
        }
      } catch (_error) {}
    };

    fetchUserPhoto();
  }, []);

  useEffect(() => {
    if (!generatedImageId) return;

    let retryCount = 0;
    const MAX_RETRIES = 40;
    const POLL_INTERVAL = 3000;
    let intervalId: NodeJS.Timeout | null = null;

    const pollImageStatus = async () => {
      try {
        retryCount++;

        if (retryCount > MAX_RETRIES) {
          if (intervalId) clearInterval(intervalId);
          setImageStatus('FAILED');
          setIsGeneratingTryOn(false);
          toast.error('Image generation timed out. Please try again.', {
            position: 'top-center',
            autoClose: 5000,
          });
          return;
        }

        const response = await fetch(`/api/videos/generate?imageId=${generatedImageId}`);

        if (!response.ok) throw new Error('Failed to fetch image status');

        const data = await response.json();
        setImageStatus(data.status);

        if (data.status === 'COMPLETED' && data.videoUrl) {
          if (intervalId) clearInterval(intervalId);
          setGeneratedImageUrl(data.videoUrl);
          setIsGeneratingTryOn(false);
        } else if (data.status === 'FAILED') {
          if (intervalId) clearInterval(intervalId);
          setIsGeneratingTryOn(false);
          toast.error('Image generation failed. Please try again.', {
            position: 'top-center',
            autoClose: 5000,
          });
        }
      } catch (_error) {
        if (retryCount > 3) if (intervalId) clearInterval(intervalId);
        setImageStatus('FAILED');
        setIsGeneratingTryOn(false);
        toast.error('Failed to check image status. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
        });
      }
    };

    pollImageStatus();
    intervalId = setInterval(pollImageStatus, POLL_INTERVAL);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [generatedImageId]);

  const handleSizeChange = (size: string) => {
    const variant = product.variants.find(
      (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color),
    );
    if (variant) setSelectedVariant(variant);
  };

  const handleColorChange = (color: string) => {
    const variant = product.variants.find(
      (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size),
    );
    if (variant) {
      setSelectedVariant(variant);
      setSelectedColor(color);

      const colorImages = product.images.filter((img) => img.alt?.startsWith(color));
      if (colorImages.length > 0) setSelectedImage(colorImages[0]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
  };

  const handleTryOn = useCallback(async () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const userData = JSON.parse(user);
    const userId = userData.id;

    if (!userId) return;

    setIsGeneratingTryOn(true);

    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          productImageUrl: selectedImage?.url,
          modelHeight: 170,
          modelWeight: 65,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[TryOn] Server error details:', data);
        throw new Error(data.details || data.error || 'Failed to generate try-on');
      }

      setGeneratedImageId(data.imageId);
      setImageStatus(data.status);
    } catch (error) {
      console.error('[TryOn] Failed to start generation:', error);
      setIsGeneratingTryOn(false);
      toast.error('Failed to start image generation. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  }, [product.id, selectedImage?.url]);

  useEffect(() => {
    const shouldAutoTryOn = searchParams.get('tryOn') === 'true';
    if (shouldAutoTryOn && !autoTryOnTriggered.current && !isGeneratingTryOn) {
      autoTryOnTriggered.current = true;
      handleTryOn();
    }
  }, [searchParams, isGeneratingTryOn, handleTryOn]);

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-black underline transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-black underline transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-black underline transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div
              ref={imageContainerRef}
              className="relative aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt || product.name}
                    className={`w-full h-full object-cover pointer-events-none transition-opacity duration-200 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-200 ${isZooming ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      backgroundImage: `url(${selectedImage.url})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage?.id === image.id
                        ? 'border-black'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <span className="inline-block px-4 py-1 bg-black text-white rounded-full text-sm font-semibold">
                {product.category.name}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="text-5xl font-bold text-black">${product.price.toFixed(2)}</div>
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            )}
            {availableSizes.length > 0 && (
              <div>
                <div className="block text-sm font-semibold text-gray-700 mb-3">
                  Size: {selectedVariant?.size || 'Select'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedVariant?.size === size;
                    const isAvailableForColor = selectedColor
                      ? product.variants.some(
                          (v) => v.size === size && v.color === selectedColor && v.stock > 0,
                        )
                      : product.variants.some((v) => v.size === size && v.stock > 0);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailableForColor}
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-black text-white'
                            : isAvailableForColor
                              ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-black'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {availableColors.length > 0 && (
              <div>
                <div className="block text-sm font-semibold text-gray-700 mb-3">
                  Color: {selectedVariant?.color || 'Select'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const isSelected = selectedVariant?.color === color;
                    const isAvailable = product.variants.some(
                      (v) => v.color === color && v.stock > 0,
                    );

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-black text-white'
                            : isAvailable
                              ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-black'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedVariant && (
              <div className="flex items-center space-x-2">
                {selectedVariant.stock > 0 ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-600 font-semibold">
                      In Stock ({selectedVariant.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </>
                )}
              </div>
            )}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-3">Quantity</div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:border-black transition-all font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant?.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center rounded-xl border-2 border-gray-300 focus:border-black focus:outline-none text-gray-900 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:border-black transition-all font-bold"
                >
                  +
                </button>
              </div>
            </div>
            {!userPhotoUrl && (
              <div className="pt-6 pb-2">
                <div className="bg-gray-100 p-4 border border-gray-300">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">💡 Tip:</span> Upload your photo in your{' '}
                    <Link
                      href="/profile"
                      className="text-black underline hover:underline font-semibold"
                    >
                      profile settings
                    </Link>{' '}
                    for personalized try-on results!
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-3 pt-6">
              <button
                type="button"
                onClick={handleTryOn}
                disabled={isGeneratingTryOn}
                className="w-full py-4 bg-white text-black border-2 border-black font-bold text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-full"
              >
                {isGeneratingTryOn ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Try On This Item</span>
                  </>
                )}
              </button>

              {selectedVariant && selectedVariant.stock === 1 && (
                <p className="text-red-600 font-bold text-sm mb-2">
                  Please hurry! Only 1 left in stock
                </p>
              )}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full py-4 bg-black text-white font-bold text-lg uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rounded-full animate-wiggle"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
            <div className="pt-6 border-t border-gray-300">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Product Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="text-gray-600 w-32">SKU:</dt>
                  <dd className="text-gray-900 font-semibold">
                    {selectedVariant?.sku || 'Select variant'}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-600 w-32">Category:</dt>
                  <dd className="text-gray-900 font-semibold">{product.category.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        {(isGeneratingTryOn || generatedImageUrl) && (
          <div className="mt-12 bg-gray-100 p-8 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center">
              <span className="text-black">AI Try-On Result</span>
            </h2>

            {isGeneratingTryOn && !generatedImageUrl && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 animate-spin mx-auto mb-4 text-black underline"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Generating your AI try-on...
                </p>
                <p className="text-sm text-gray-600">
                  This usually takes 30-120 seconds. Please wait.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Status: {imageStatus || 'PENDING'} • Maximum wait time: 2 minutes
                </p>
              </div>
            )}

            {generatedImageUrl && (
              <div className="max-w-2xl mx-auto">
                <BeforeAfterComparison
                  beforeImage={
                    userPhotoUrl ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop'
                  }
                  afterImage={generatedImageUrl}
                  beforeLabel={userPhotoUrl ? 'Your Photo' : 'Default Model'}
                  afterLabel="With Product"
                />
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">
                    Drag the slider to compare before and after!
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Here&apos;s how this product looks on a virtual model
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedImageUrl(null);
                      setGeneratedImageId(null);
                      setImageStatus(null);
                    }}
                    className="px-6 py-2 bg-white border-2 border-black text-black font-semibold text-sm hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
