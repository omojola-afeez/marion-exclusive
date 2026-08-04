import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { productId, variantId, quantity } = await request.json();
  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "productId and a positive quantity are required." }, { status: 400 });
  }

  // Check real inventory before allowing the add, not just accepting the request.
  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.inventory < quantity) {
      return NextResponse.json({ error: "Not enough stock for that option." }, { status: 409 });
    }
  }

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId_variantId: {
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
      },
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity },
    });
  }

  return NextResponse.json({ ok: true });
}
