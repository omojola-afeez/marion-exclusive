import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { toPlainNumber } from "@/lib/serialize";
import { z } from "zod";

const CheckoutSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const parse = CheckoutSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid input.", details: parse.error.format() }, { status: 400 });
  }

  const { fullName, line1, line2, city, state, postalCode, country } = parse.data;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, variant: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-check inventory at checkout time, not just at add-to-cart time.
  for (const item of cart.items) {
    if (item.variant && item.variant.inventory < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for ${item.product.name}.` },
        { status: 409 }
      );
    }
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: (typeof cart.items)[number]) =>
      sum + toPlainNumber(item.product.price) * item.quantity,
    0
  );
  const total = subtotal; // discount/coupon logic arrives with Milestone 7's marketing tools

  // Use Idempotency-Key header (if provided) to make checkout idempotent.
  const idempotencyKey = request.headers.get("Idempotency-Key") || null;

  // Create address
  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName,
      line1,
      line2: line2 || null,
      city,
      state,
      postalCode,
      country,
    },
  });

  // Try to find an existing order with the same idempotency key for this user.
  let order = idempotencyKey
    ? await prisma.order.findUnique({ where: { idempotencyKey } })
    : null;

  if (!order) {
    const orderNumber = `ME-${Date.now().toString(36).toUpperCase()}`;
    order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        addressId: address.id,
        status: "PENDING",
        subtotal,
        total,
        idempotencyKey: idempotencyKey || undefined,
        items: {
          create: cart.items.map((item: (typeof cart.items)[number]) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
    });
  }

  const stripe = getStripe();

  // If an order already has a payment intent, return its client secret.
  if (order.stripePaymentIntentId) {
    try {
      const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      return NextResponse.json({ clientSecret: existing.client_secret, orderNumber: order.orderNumber });
    } catch (err) {
      // If retrieval fails, proceed to create a new payment intent below.
    }
  }

  // Create a PaymentIntent, passing idempotency key to Stripe SDK options when available.
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      automatic_payment_methods: { enabled: true },
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );

  await prisma.order.update({ where: { id: order.id }, data: { stripePaymentIntentId: paymentIntent.id } });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderNumber: order.orderNumber });
}
