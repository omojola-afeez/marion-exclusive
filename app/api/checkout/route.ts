import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { toPlainNumber } from "@/lib/serialize";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { fullName, line1, line2, city, state, postalCode, country } = await request.json();
  if (!fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json({ error: "All shipping fields except line2 are required." }, { status: 400 });
  }

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

  const orderNumber = `ME-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      addressId: address.id,
      status: "PENDING",
      subtotal,
      total,
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

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "usd",
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    automatic_payment_methods: { enabled: true },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderNumber: order.orderNumber,
  });
}
