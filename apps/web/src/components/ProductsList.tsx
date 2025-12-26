'use client';

import Link from 'next/link';
import { useState } from 'react';

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
  images: {
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
}

interface ProductsListProps {
  initialProducts: Product[];
  categories: { id: string; name: string; slug: string }[];
}

export default function ProductsList({ initialProducts, categories }: ProductsListProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesCategory =
      selectedCategory === 'all' || product.category.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Virtual Try-On Catalog
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your perfect style with AI-powered try-on
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors bg-white/50 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-purple-100'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-purple-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100/50 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-purple-50 to-cyan-50 overflow-hidden">
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-gray-300"
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
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-600">
                        {product.category.name}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors font-semibold">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
