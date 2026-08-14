import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

// This is the source of truth for "payment succeeded" — never trust
// client-side state alone. Stripe calls this endpoint independently of
// whatever the browser reports back after confirmPayment().
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const order = await prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { items: true },
    });

    if (order && order.status === "PENDING") {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
        ...order.items
          .filter((item: (typeof order.items)[number]) => item.variantId)
          .map((item: (typeof order.items)[number]) =>
            prisma.productVariant.update({
              where: { id: item.variantId! },
              data: { inventory: { decrement: item.quantity } },
            })
          ),
        prisma.cartItem.deleteMany({ where: { cart: { userId: order.userId } } }),
      ]);
    }
  }

  // For other event types or repeated delivery, respond success once processed.

  return NextResponse.json({ received: true });
}
