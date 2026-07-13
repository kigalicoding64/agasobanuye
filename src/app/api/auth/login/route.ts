import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { email, phone, password } = parsed.data;
  const user = await db.user.findFirst({ where: { OR: [email ? { email } : {}, phone ? { phone } : {}] } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email/phone or password." }, { status: 401 });
  }

  const token = await signSession({ userId: user.id, role: user.role });
  const res = NextResponse.json({ id: user.id, name: user.name, role: user.role });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
