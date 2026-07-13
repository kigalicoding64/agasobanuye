import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET as string;
const SESSION_COOKIE = "iwacu_session";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export type SessionPayload = { userId: string; role: "USER" | "CREATOR" | "ADMIN" };

export function signSession(payload: SessionPayload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set. Check your .env file.");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Reads the JWT from cookies on an incoming request and returns the full user record, or null. */
export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session) return null;
  return db.user.findUnique({ where: { id: session.userId }, include: { subscription: true } });
}
