import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { chargeMobileMoneyRwanda, initiateCardCharge } from "@/lib/payments/flutterwave";

const PLAN_PRICES: Record<string, number> = { VIP_MONTHLY: 2500, VIP_YEARLY: 25000 };

const schema = z.object({
  plan: z.enum(["VIP_MONTHLY", "VIP_YEARLY"]).optional(),
  movieId: z.string().optional(),
  method: z.enum(["MOMO", "AIRTEL", "CARD", "PAYPAL"]),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "You must be logged in to pay." }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  const { plan, movieId, method, phone } = parsed.data;

  let amountRwf: number;
  let type: "SUBSCRIPTION" | "PPV";

  if (movieId) {
    const movie = await db.movie.findUnique({ where: { id: movieId } });
    if (!movie || !movie.isPpv || !movie.priceRwf) {
      return NextResponse.json({ error: "This title is not pay-per-view." }, { status: 400 });
    }
    amountRwf = movie.priceRwf;
    type = "PPV";
  } else if (plan) {
    amountRwf = PLAN_PRICES[plan];
    type = "SUBSCRIPTION";
  } else {
    return NextResponse.json({ error: "Provide either a plan or a movieId." }, { status: 400 });
  }

  const payment = await db.payment.create({
    data: { userId: user.id, movieId, amountRwf, method, type, status: "PENDING" },
  });

  try {
    if (method === "MOMO" || method === "AIRTEL") {
      if (!phone) return NextResponse.json({ error: "Phone number is required for Mobile Money." }, { status: 400 });
      const result = await chargeMobileMoneyRwanda({
        txRef: payment.id,
        amountRwf,
        phone,
        email: user.email || `${user.id}@iwacumovies.com`,
        fullName: user.name,
        network: method,
      });
      return NextResponse.json({ status: result.status, message: "Check your phone to approve the payment." });
    }

    if (method === "CARD") {
      const result = await initiateCardCharge({
        txRef: payment.id,
        amountRwf,
        email: user.email || `${user.id}@iwacumovies.com`,
        fullName: user.name,
      });
      return NextResponse.json({ checkoutUrl: result?.data?.link });
    }

    // PayPal: typically handled via PayPal's own JS SDK on the client, which then
    // calls a separate /api/payments/paypal/capture route. Left as a stub here.
    return NextResponse.json({ error: "PayPal checkout is not wired up yet in this scaffold." }, { status: 501 });
  } catch (err: any) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: err.message || "Payment provider error." }, { status: 502 });
  }
}
