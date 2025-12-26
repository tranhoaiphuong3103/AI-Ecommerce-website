import type { Metadata } from 'next';
import './globals.css';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';

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

        <Header />

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
