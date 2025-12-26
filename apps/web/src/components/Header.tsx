'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100/50 shadow-lg shadow-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-75 animate-pulse" />
              <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                VirtualTry
              </h1>
              <p className="text-xs text-purple-600/70 font-medium">AI-Powered Shopping</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Products
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              About
            </a>

            {!isLoading &&
              (user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Hello, {user.name || user.email}!
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-50 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
