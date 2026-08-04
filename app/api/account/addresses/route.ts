import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { fullName, line1, line2, city, state, postalCode, country, isDefault } = await request.json();
  if (!fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json({ error: "All fields except line 2 are required." }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

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
      isDefault: !!isDefault,
    },
  });

  return NextResponse.json(address);
}
