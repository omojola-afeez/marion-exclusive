import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-400 rounded-full mix-blend-multiply filter blur-3xl" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-neutral-300 rounded-full mix-blend-multiply filter blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur border border-neutral-200 mb-6">
                <span className="w-2 h-2 bg-neutral-900 rounded-full" />
                <p className="text-xs font-medium text-neutral-700">Thoughtfully curated</p>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
                Marion
                <span className="block text-neutral-600">Exclusive</span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Considered, well-made goods for a thoughtful lifestyle. Discover our curated collection of premium essentials.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shop"
                  className="px-8 py-4 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  Explore Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="#featured"
                  className="px-8 py-4 border-2 border-neutral-300 text-neutral-900 rounded-lg font-medium hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300 inline-flex items-center justify-center"
                >
                  See Featured
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-neutral-900 rounded-full" />
              <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Handpicked</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl">
              Our carefully selected pieces that define contemporary craftsmanship and timeless style.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-neutral-500">No featured products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.images[0]?.url}
                />
              ))}
            </div>
          )}

          <div className="mt-12 sm:mt-16 text-center">
            <a
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 text-neutral-900 font-medium hover:text-neutral-700 border-b-2 border-neutral-900 hover:border-neutral-700 transition-all duration-300"
            >
              View all products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Quality Assured</h3>
                <p className="text-neutral-600">Every piece is thoughtfully selected for craftsmanship and durability.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Fast Shipping</h3>
                <p className="text-neutral-600">Orders shipped within 24 hours to anywhere in the world.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Money Back</h3>
                <p className="text-neutral-600">30-day satisfaction guarantee on all purchases.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
