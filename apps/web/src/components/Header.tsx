'use client';

import { useCartStore } from '@/stores/cart-store';
import type { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { fetchCart, isInitialized } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token)
      try {
        const userString = localStorage.getItem('user');
        if (userString) setUser(JSON.parse(userString));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user && !isInitialized) fetchCart();
  }, [user, isInitialized, fetchCart]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-lg transition-all duration-200 group-hover:scale-110">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">VirtualTry</h1>
            </div>
          </Link>

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <nav className="hidden md:flex items-center space-x-2">
            <Link
              id="nav-home"
              href="/"
              className="flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
              title="Home"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
            <Link
              id="nav-products"
              href="/products"
              className="flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
              title="Products"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </Link>
            <Link
              id="nav-how-it-works"
              href="/#how-it-works"
              className="flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
              title="How It Works"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
            <Link
              id="nav-cart"
              href="/cart"
              className={`flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 relative ${totalItems > 0 ? 'mr-2' : ''}`}
              title="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {!isLoading &&
              (user ? (
                <div id="nav-profile" className="flex items-center space-x-2">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center w-10 h-10 bg-white text-black font-bold text-sm rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-110"
                    title={`Profile - ${user.name || user.email}`}
                  >
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-10 h-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                    title="Sign Out"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  id="nav-sign-in"
                  type="button"
                  onClick={handleSignIn}
                  className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-110"
                  title="Sign In"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
              ))}
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 bg-black">
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/products"
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-medium">Products</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">How It Works</span>
            </Link>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="font-medium">Cart</span>
            </Link>

            <div className="border-t border-gray-700 my-2" />

            {!isLoading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-white text-black font-bold text-sm rounded-full">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors w-full text-left"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="flex items-center space-x-4 px-4 py-3 text-white hover:bg-gray-800 transition-colors w-full text-left"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium">Sign In</span>
                </button>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
