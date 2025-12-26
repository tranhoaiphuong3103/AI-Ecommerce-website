export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Virtual Try-On E-commerce</h1>
          <p className="text-gray-300 text-sm mt-1">AI-Powered Shopping Experience</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Shop Smart with AI-Powered Virtual Try-On
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            See how clothes look on a model that matches your body type before you buy.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 font-medium">Product Image</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Classic T-Shirt</h3>
            <p className="text-blue-600 font-bold text-lg mb-4">$29.99</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              Generate Try-On Video
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 font-medium">Product Image</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Summer Dress</h3>
            <p className="text-blue-600 font-bold text-lg mb-4">$49.99</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              Generate Try-On Video
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 font-medium">Product Image</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Casual Shirt</h3>
            <p className="text-blue-600 font-bold text-lg mb-4">$39.99</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              Generate Try-On Video
            </button>
          </div>
        </section>

        <section className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg">
                1
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Select Your Measurements</h3>
              <p className="text-gray-700 leading-relaxed">
                Input your body measurements or choose from standard sizes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg">
                2
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Choose a Product</h3>
              <p className="text-gray-700 leading-relaxed">
                Browse our collection and select the item you want to try
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg">
                3
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Watch Your Video</h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI generates a custom try-on video in seconds
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
