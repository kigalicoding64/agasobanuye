import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SESSION_COOKIE_NAME = "iwacu_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!needsAdmin) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return pathname.startsWith("/api")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "CREATOR") {
      return pathname.startsWith("/api")
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return pathname.startsWith("/api")
      ? NextResponse.json({ error: "Invalid session" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
