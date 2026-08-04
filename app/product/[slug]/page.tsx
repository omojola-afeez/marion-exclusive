import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toPlainNumber } from "@/lib/serialize";
import AddToCartButton from "@/components/AddToCartButton";

// Next.js 15: dynamic route params are async and must be awaited.
type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: true,
      category: true,
      designer: true,
    },
  });

  if (!product) {
    notFound();
  }

  const price = toPlainNumber(product.price);

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto w-full grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden rounded-lg">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].url}
            alt={product.images[0].altText ?? product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-neutral-400 text-sm">No image</span>
        )}
      </div>

      <div>
        {product.designer && (
          <p className="text-sm text-neutral-500 mb-1">{product.designer.name}</p>
        )}
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-lg text-neutral-700 mt-2">${price.toFixed(2)}</p>
        <p className="text-neutral-600 mt-6">{product.description}</p>

        <AddToCartButton productId={product.id} variants={product.variants} />
      </div>
    </main>
  );
}
