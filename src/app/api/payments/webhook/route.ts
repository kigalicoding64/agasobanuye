import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidWebhookSignature } from "@/lib/payments/flutterwave";

/**
 * Configure this URL in your Flutterwave dashboard under
 * Settings -> Webhooks: https://yourdomain.com/api/payments/webhook
 *
 * Flutterwave will retry webhooks that don't return a 2xx response, so make
 * sure this stays fast and idempotent (re-processing the same event twice
 * should be harmless, which is why we check payment.status before updating).
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");
  if (!isValidWebhookSignature(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = await req.json();
  const txRef = event?.data?.tx_ref;
  const status = event?.data?.status; // "successful" | "failed"

  if (!txRef) return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });

  const payment = await db.payment.findUnique({ where: { id: txRef } });
  if (!payment || payment.status !== "PENDING") {
    return NextResponse.json({ ok: true }); // already processed or unknown - acknowledge anyway
  }

  if (status === "successful") {
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS", providerRef: String(event.data.id) },
    });

    if (payment.type === "SUBSCRIPTION") {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (payment.amountRwf >= 25000 ? 365 : 30));

      await db.subscription.upsert({
        where: { userId: payment.userId },
        update: { status: "ACTIVE", plan: payment.amountRwf >= 25000 ? "VIP_YEARLY" : "VIP_MONTHLY", expiresAt },
        create: {
          userId: payment.userId,
          status: "ACTIVE",
          plan: payment.amountRwf >= 25000 ? "VIP_YEARLY" : "VIP_MONTHLY",
          expiresAt,
        },
      });
    }
    // PPV access is granted implicitly: canAccessMovie() checks for a SUCCESS
    // payment row matching the movieId, which now exists.
  } else {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  }

  return NextResponse.json({ ok: true });
}
