import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ addressId: string }>;
};

async function assertOwnership(addressId: string, userId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) return null;
  return address;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { addressId } = await params;
  const address = await assertOwnership(addressId, session.user.id);
  if (!address) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const { isDefault } = await request.json();

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.update({ where: { id: addressId }, data: { isDefault: !!isDefault } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { addressId } = await params;
  const address = await assertOwnership(addressId, session.user.id);
  if (!address) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id: addressId } });
  return NextResponse.json({ ok: true });
}
