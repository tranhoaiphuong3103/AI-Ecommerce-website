export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20 text-center relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
          <div className="w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="inline-block mb-6">
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 text-sm font-semibold border border-purple-200/50 shadow-sm">
            🤖 Powered by Advanced AI
          </span>
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Shop Smart
          </span>
          <br />
          <span className="text-gray-900">with AI Try-On</span>
        </h2>

        <p className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
          See how clothes look on a virtual model that matches{' '}
          <span className="font-semibold text-purple-600">your body type</span> before you buy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            Start Shopping ✨
          </button>
          <button
            type="button"
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-purple-700 rounded-xl font-bold text-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-white transition-all duration-300"
          >
            Watch Demo
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Products</h3>
          <p className="text-gray-600 text-lg">Try before you buy with AI-powered visualization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Card 1 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 border border-purple-100/50">
            <div className="relative aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 group-hover:scale-110 transition-transform duration-500" />
              <span className="relative text-purple-600/50 font-medium text-lg">
                Classic T-Shirt
              </span>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                AI Ready
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Classic T-Shirt</h3>
            <p className="text-purple-600 font-bold text-2xl mb-4">$29.99</p>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 font-semibold group-hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">✨ Generate Try-On</span>
            </button>
          </div>

          {/* Product Card 2 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
            <div className="relative aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-blue-400/20 group-hover:scale-110 transition-transform duration-500" />
              <span className="relative text-pink-600/50 font-medium text-lg">Summer Dress</span>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Trending
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Summer Dress</h3>
            <p className="text-pink-600 font-bold text-2xl mb-4">$49.99</p>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 font-semibold group-hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">✨ Generate Try-On</span>
            </button>
          </div>

          {/* Product Card 3 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 border border-cyan-100/50">
            <div className="relative aspect-square bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-teal-400/20 group-hover:scale-110 transition-transform duration-500" />
              <span className="relative text-cyan-600/50 font-medium text-lg">Casual Shirt</span>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                New
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Casual Shirt</h3>
            <p className="text-cyan-600 font-bold text-2xl mb-4">$39.99</p>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold group-hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">✨ Generate Try-On</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 rounded-3xl p-12 border border-purple-100/50 backdrop-blur-sm">
        <div className="absolute top-6 right-6 opacity-20">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full blur-2xl" />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-600 text-lg">Three simple steps to your perfect fit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-purple-600 to-cyan-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl">
                1
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Select Measurements</h3>
            <p className="text-gray-600 leading-relaxed">
              Input your body measurements or choose from our size guide
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl">
                2
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Pick Your Product</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse our collection and select the item you love
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-500 to-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl">
                3
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">AI Magic ✨</h3>
            <p className="text-gray-600 leading-relaxed">
              Watch AI generate your personalized try-on in seconds
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
