import Link from "next/link";
import { toPlainNumber } from "@/lib/serialize";

// Accepts price as either a number or anything Decimal-like (e.g. if this
// component ever gets reused somewhere that passes a raw Prisma row).
// This defensive normalization is what the build spec calls for, so a new
// page reusing this component can't silently break on Decimal rendering.
type ProductCardProps = {
  slug: string;
  name: string;
  price: number | { toNumber: () => number } | string;
  imageUrl?: string | null;
};

export default function ProductCard({ slug, name, price, imageUrl }: ProductCardProps) {
  const numericPrice = toPlainNumber(price);

  return (
    <Link
      href={`/product/${slug}`}
      className="group block border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-neutral-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-neutral-900">{name}</h3>
        <p className="text-neutral-500 mt-1">${numericPrice.toFixed(2)}</p>
      </div>
    </Link>
  );
}
