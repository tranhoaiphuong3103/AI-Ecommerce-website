'use client';

import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CartContent() {
  const router = useRouter();
  const {
    items,
    selectedIds,
    isLoading,
    isInitialized,
    fetchCart,
    updateQuantity,
    updateVariant,
    removeItem,
    toggleSelect,
    selectAll,
    deselectAll,
    getSelectedItems,
    getSubtotal,
  } = useCartStore();

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
    toast.success('Item removed from cart');
  };

  const handleGenerateTryOn = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please sign in to use try-on');
      router.push('/login');
      return;
    }

    setIsGenerating(true);
    try {
      const userData = JSON.parse(user);
      const productIds = selectedItems.map((item) => item.productId);
      const variantIds = selectedItems.map((item) => item.variantId);
      const productImageUrls = selectedItems.map((item) => {
        const variantColor = item.variant?.color;
        const colorMatchedImage = variantColor
          ? item.product.images.find((img) => img.alt?.startsWith(variantColor))
          : null;
        const primaryImage = item.product.images.find((img) => img.isPrimary);
        return colorMatchedImage?.url || primaryImage?.url || item.product.images[0]?.url;
      });

      const response = await fetch('/api/videos/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          productIds,
          variantIds,
          productImageUrls,
          modelHeight: 170,
          modelWeight: 65,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Try-on generation started!');
        router.push(`/try-on/${data.outfitVideoId}`);
      } else toast.error('Failed to start try-on generation');
    } catch {
      toast.error('Failed to generate try-on');
    } finally {
      setIsGenerating(false);
    }
  };

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0;
  const subtotal = getSubtotal();

  if (!isInitialized || isLoading)
    return (
      <div className="min-h-screen py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-screen py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={allSelected ? deselectAll : selectAll}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                  allSelected ? 'bg-black border-black' : 'border-gray-300'
                }`}
              >
                {allSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span>Select All ({items.length})</span>
            </button>
          </div>

          {someSelected && (
            <button
              type="button"
              onClick={handleGenerateTryOn}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-black text-white px-6 py-2 font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Try On Selected ({selectedIds.length})</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const variantColor = item.variant?.color;
            const colorMatchedImage = variantColor
              ? item.product.images.find((img) => img.alt?.startsWith(variantColor))
              : null;
            const primaryImage = item.product.images.find((img) => img.isPrimary);
            const imageUrl =
              colorMatchedImage?.url || primaryImage?.url || item.product.images[0]?.url;

            return (
              <div
                key={item.id}
                className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-colors ${
                  isSelected ? 'border-black bg-gray-50' : 'border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSelect(item.id)}
                  className={`w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-black border-black' : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <Link
                  href={`/products/${item.product.slug}`}
                  className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </Link>

                <div className="flex-grow min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-bold text-gray-900 hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  {item.product.variants.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        value={item.variantId || ''}
                        onChange={(e) => updateVariant(item.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {item.product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.size}
                            {variant.color && ` / ${variant.color}`}
                            {variant.stock === 0 && ' (Out of stock)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <p className="font-bold text-lg mt-1">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t-2 border-gray-200 pt-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-700">Subtotal</span>
            <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 py-3 border-2 border-black text-black font-bold text-center uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-full"
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              className="flex-1 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-full"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
