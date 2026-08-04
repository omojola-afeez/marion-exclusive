import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-end gap-4 px-6 py-4 text-sm">
        <Link href="/shop" className="text-neutral-600 hover:text-neutral-900">Shop</Link>
        <Link href="/account" className="text-neutral-600 hover:text-neutral-900">Account</Link>
        <Link href="/login" className="text-neutral-600 hover:text-neutral-900">Log in</Link>
        <Link href="/signup" className="text-neutral-600 hover:text-neutral-900">Sign up</Link>
      </nav>
      <section className="flex flex-col items-center justify-center gap-4 py-24 text-center border-b border-neutral-200">
        <h1 className="text-4xl font-semibold">Marion Exclusive</h1>
        <p className="text-neutral-500 max-w-md">
          Considered, well-made goods.
        </p>
        <Link
          href="/shop"
          className="mt-2 px-6 py-2 bg-neutral-900 text-white rounded-md text-sm"
        >
          Shop the collection
        </Link>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <h2 className="text-xl font-medium mb-6">Featured</h2>
        {featuredProducts.length === 0 ? (
          <p className="text-neutral-500">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product: (typeof featuredProducts)[number]) => (
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
      </section>
    </main>
  );
}
