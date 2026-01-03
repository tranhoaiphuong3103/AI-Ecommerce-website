'use client';

import type { Category, Product } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

interface ProductsListProps {
  initialProducts: Product[];
  categories: Category[];
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
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black uppercase tracking-tight mb-4">
            Product Catalog
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your perfect style with AI-powered try-on
          </p>
        </div>

        <div className="mb-8 space-y-4">
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
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors bg-white text-black placeholder:text-gray-400 rounded-full"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 font-bold text-sm uppercase tracking-wider transition-colors rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-2 border-gray-300 hover:border-black'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 font-bold text-sm uppercase tracking-wider transition-colors rounded-full ${
                  selectedCategory === category.slug
                    ? 'bg-black text-white'
                    : 'bg-white text-black border-2 border-gray-300 hover:border-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white border border-gray-200 hover:border-black transition-colors flex flex-col rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm text-black uppercase mb-2 line-clamp-2 min-h-[40px]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
                      {product.description || '\u00A0'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-black">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-black transition-colors font-semibold uppercase">
                        View →
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
            <h3 className="text-xl font-bold text-black mb-2 uppercase">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
