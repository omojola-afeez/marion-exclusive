import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-6 py-16 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-medium mb-8">Shop</h1>
      {products.length === 0 ? (
        <p className="text-neutral-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product: (typeof products)[number]) => (
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
    </main>
  );
}
