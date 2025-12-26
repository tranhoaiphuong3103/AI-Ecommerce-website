import type { Metadata } from 'next';
import './globals.css';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Virtual Try-On - AI-Powered Shopping',
  description: 'Experience the future of online shopping with AI-powered virtual try-on technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
        </div>

        {/* Header */}
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
                <button
                  type="button"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <AuthGuard>
          <main>{children}</main>
        </AuthGuard>

        {/* Footer */}
        <footer className="mt-20 border-t border-purple-100/50 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  VirtualTry
                </h3>
                <p className="text-sm text-gray-600">
                  AI-powered virtual try-on technology revolutionizing online shopping.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Shop All
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      New Arrivals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Best Sellers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-purple-100/50 text-center text-sm text-gray-600">
              <p>© 2025 VirtualTry. Powered by AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
