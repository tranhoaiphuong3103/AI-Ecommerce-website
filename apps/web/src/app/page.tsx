export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Virtual Try-On E-commerce</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Shop Smart with AI-Powered Virtual Try-On
          </h2>
          <p className="text-gray-600 text-lg">
            See how clothes look on a model that matches your body type before you buy.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Product Image</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Classic T-Shirt</h3>
            <p className="text-gray-600 mb-4">$29.99</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Try-On Video
            </button>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Product Image</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Summer Dress</h3>
            <p className="text-gray-600 mb-4">$49.99</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Try-On Video
            </button>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Product Image</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Casual Shirt</h3>
            <p className="text-gray-600 mb-4">$39.99</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Try-On Video
            </button>
          </div>
        </section>

        <section className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Select Your Measurements</h3>
              <p className="text-gray-600">
                Input your body measurements or choose from standard sizes
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Choose a Product</h3>
              <p className="text-gray-600">
                Browse our collection and select the item you want to try
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Watch Your Video</h3>
              <p className="text-gray-600">
                Our AI generates a custom try-on video in seconds
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
