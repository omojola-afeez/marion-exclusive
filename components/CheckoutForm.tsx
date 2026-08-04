"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe-client";

function PaymentStep({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setLoading(false);

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed.");
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      router.push(`/order/${orderNumber}`);
    } else {
      setError("Payment did not complete. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-neutral-900 text-white rounded-md py-2 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function CheckoutForm({
  clientSecret,
  orderNumber,
}: {
  clientSecret: string;
  orderNumber: string;
}) {
  return (
    <Elements stripe={getStripeClient()} options={{ clientSecret }}>
      <PaymentStep orderNumber={orderNumber} />
    </Elements>
  );
}
