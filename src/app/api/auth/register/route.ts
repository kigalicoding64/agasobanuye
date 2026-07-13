import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().optional(),
    phone: z.string().min(9).optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((d) => d.email || d.phone, { message: "Email or phone is required." });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const { name, email, phone, password } = parsed.data;

  const existing = await db.user.findFirst({
    where: { OR: [email ? { email } : {}, phone ? { phone } : {}] },
  });
  if (existing) {
    return NextResponse.json({ error: "An account with that email or phone already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({ data: { name, email, phone, passwordHash } });

  const token = await signSession({ userId: user.id, role: user.role });
  const res = NextResponse.json({ id: user.id, name: user.name });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
