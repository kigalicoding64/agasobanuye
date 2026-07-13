import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { isSubscriptionActive } from "@/lib/access";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ active: false });
  return NextResponse.json({
    active: isSubscriptionActive(user.subscription),
    plan: user.subscription?.plan || "FREE",
    expiresAt: user.subscription?.expiresAt || null,
  });
}
