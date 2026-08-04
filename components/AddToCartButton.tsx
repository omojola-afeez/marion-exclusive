"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Variant = {
  id: string;
  color: string | null;
  size: string | null;
  sku: string;
  inventory: number;
};

export default function AddToCartButton({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const router = useRouter();
  const { status } = useSession();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        variantId: variantId || undefined,
        quantity: 1,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Couldn't add that to your cart.");
      return;
    }

    setMessage("Added to cart.");
    router.refresh();
  }

  return (
    <div className="mt-6">
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              disabled={variant.inventory === 0}
              onClick={() => setVariantId(variant.id)}
              className={`px-3 py-1.5 text-sm border rounded-md ${
                variant.id === variantId
                  ? "border-neutral-900 text-neutral-900"
                  : "border-neutral-300 text-neutral-600"
              } ${variant.inventory === 0 ? "opacity-40 line-through cursor-not-allowed" : ""}`}
            >
              {variant.color ?? variant.size ?? variant.sku}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || (variants.length > 0 && !variantId)}
        className="px-6 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>

      {message && <p className="text-sm text-neutral-500 mt-2">{message}</p>}
    </div>
  );
}
