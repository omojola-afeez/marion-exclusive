"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartItemControls({ itemId, quantity }: { itemId: string; quantity: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQuantity: number) {
    if (newQuantity < 1) return;
    setLoading(true);
    await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    setLoading(false);
    router.refresh();
  }

  async function removeItem() {
    setLoading(true);
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={() => updateQuantity(quantity - 1)}
        className="w-7 h-7 border border-neutral-300 rounded-md text-sm disabled:opacity-50"
      >
        −
      </button>
      <span className="text-sm w-4 text-center">{quantity}</span>
      <button
        type="button"
        disabled={loading}
        onClick={() => updateQuantity(quantity + 1)}
        className="w-7 h-7 border border-neutral-300 rounded-md text-sm disabled:opacity-50"
      >
        +
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={removeItem}
        className="text-xs text-neutral-400 underline ml-3 disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
