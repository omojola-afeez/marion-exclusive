"use client";

import { useState } from "react";
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  async function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shipping),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Couldn't start checkout.");
      return;
    }

    const data = await res.json();
    setClientSecret(data.clientSecret);
    setOrderNumber(data.orderNumber);
  }

  if (clientSecret && orderNumber) {
    return (
      <main className="px-6 py-16 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-medium mb-8">Payment</h1>
        <CheckoutForm clientSecret={clientSecret} orderNumber={orderNumber} />
      </main>
    );
  }

  return (
    <main className="px-6 py-16 max-w-md mx-auto w-full">
      <h1 className="text-2xl font-medium mb-8">Shipping</h1>
      <form onSubmit={handleShippingSubmit} className="space-y-4">
        <input
          required
          placeholder="Full name"
          value={shipping.fullName}
          onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
          className="w-full border border-neutral-300 rounded-md px-3 py-2"
        />
        <input
          required
          placeholder="Address line 1"
          value={shipping.line1}
          onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
          className="w-full border border-neutral-300 rounded-md px-3 py-2"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={shipping.line2}
          onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
          className="w-full border border-neutral-300 rounded-md px-3 py-2"
        />
        <div className="flex gap-3">
          <input
            required
            placeholder="City"
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            className="flex-1 border border-neutral-300 rounded-md px-3 py-2"
          />
          <input
            required
            placeholder="State"
            value={shipping.state}
            onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
            className="w-24 border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            placeholder="Postal code"
            value={shipping.postalCode}
            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
            className="flex-1 border border-neutral-300 rounded-md px-3 py-2"
          />
          <input
            required
            placeholder="Country"
            value={shipping.country}
            onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
            className="w-24 border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white rounded-md py-2 disabled:opacity-50"
        >
          {loading ? "Preparing payment..." : "Continue to payment"}
        </button>
      </form>
    </main>
  );
}
