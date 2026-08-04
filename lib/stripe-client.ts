import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Client-only. Uses the publishable key, never the secret key.
// Memoized at module level so we don't re-create the Stripe.js instance
// on every render/call.
let stripePromise: Promise<Stripe | null>;

export function getStripeClient() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
