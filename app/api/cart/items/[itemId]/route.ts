import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ itemId: string }>;
};

async function assertOwnership(itemId: string, userId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item || item.cart.userId !== userId) return null;
  return item;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await assertOwnership(itemId, session.user.id);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  const { quantity } = await request.json();
  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "quantity must be at least 1." }, { status: 400 });
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await assertOwnership(itemId, session.user.id);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
