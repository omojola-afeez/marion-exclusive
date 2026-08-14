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
      className="group flex flex-col h-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-neutral-400 text-sm">No image</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2">
            {name}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <p className="text-neutral-600 font-medium">${numericPrice.toFixed(2)}</p>
          <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
