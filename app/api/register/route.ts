import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parse = RegisterSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid input.", details: parse.error.format() }, { status: 400 });
  }

  const { email, password, name } = parse.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
