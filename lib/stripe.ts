import Stripe from "stripe";

// Server-only. Never import this file from a "use client" component.
//
// Lazy singleton: constructing `new Stripe(key)` at module load time would
// crash the Vercel build during "Collecting page data" if STRIPE_SECRET_KEY
// isn't set yet — even before anyone visits the site. Only construct it the
// first time it's actually used, once the key is confirmed present.
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set.");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return stripeInstance;
}
