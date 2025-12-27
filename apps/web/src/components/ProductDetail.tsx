'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  order: number;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  sku: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(
    product.images.find((img) => img.isPrimary) || product.images[0],
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.color || null,
  );
  const [quantity, setQuantity] = useState(1);

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => c !== null)),
  );

  const filteredImages = selectedColor
    ? product.images.filter((img) => img.alt?.startsWith(selectedColor))
    : product.images;

  const displayImages = filteredImages.length > 0 ? filteredImages : product.images;

  const handleSizeChange = (size: string) => {
    const variant = product.variants.find(
      (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color),
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleColorChange = (color: string) => {
    const variant = product.variants.find(
      (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size),
    );
    if (variant) {
      setSelectedVariant(variant);
      setSelectedColor(color);

      const colorImages = product.images.filter((img) => img.alt?.startsWith(color));
      if (colorImages.length > 0) {
        setSelectedImage(colorImages[0]);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size');
      return;
    }
    console.log('Add to cart:', { productId: product.id, variantId: selectedVariant.id, quantity });
    alert('Product added to cart!');
  };

  const handleTryOn = () => {
    console.log('Try on:', { productId: product.id, variantId: selectedVariant?.id });
    alert('Try-on feature coming soon!');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-purple-600 transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-purple-600 transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
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

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage?.id === image.id
                        ? 'border-purple-600 shadow-lg shadow-purple-500/50'
                        : 'border-purple-100 hover:border-purple-300'
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

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-sm font-semibold">
                {product.category.name}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <div className="block text-sm font-semibold text-gray-700 mb-3">
                  Size: {selectedVariant?.size || 'Select'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedVariant?.size === size;
                    const isAvailable = product.variants.some(
                      (v) => v.size === size && v.stock > 0,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50'
                            : isAvailable
                              ? 'bg-white border-2 border-purple-100 text-gray-700 hover:border-purple-600'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
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
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50'
                            : isAvailable
                              ? 'bg-white border-2 border-purple-100 text-gray-700 hover:border-purple-600'
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

            {/* Stock Status */}
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

            {/* Quantity */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-3">Quantity</div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-purple-100 text-gray-700 hover:border-purple-600 transition-all font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant?.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center rounded-xl border-2 border-purple-100 focus:border-purple-600 focus:outline-none text-gray-900 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-purple-100 text-gray-700 hover:border-purple-600 transition-all font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <button
                type="button"
                onClick={handleTryOn}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Try On This Item</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

            {/* Product Details */}
            <div className="pt-6 border-t border-purple-100">
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
      </div>
    </div>
  );
}
