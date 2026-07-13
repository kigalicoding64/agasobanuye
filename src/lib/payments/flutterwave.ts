/**
 * Flutterwave is used here because it has direct, documented support for both
 * MTN Mobile Money Rwanda and Airtel Money Rwanda under one API, plus cards and
 * PayPal-adjacent options - so we don't need three separate provider integrations.
 * Docs: https://developer.flutterwave.com/docs/mobile-money-rwanda
 *
 * You must create a Flutterwave merchant account and complete their Rwanda
 * verification (KYC) before LIVE keys will process real money. TEST keys work
 * immediately for development.
 */

const FLW_BASE_URL = "https://api.flutterwave.com/v3";

type ChargeMobileMoneyParams = {
  txRef: string;
  amountRwf: number;
  phone: string; // customer's phone, e.g. 250788123456
  email: string;
  fullName: string;
  network: "MOMO" | "AIRTEL"; // network is auto-detected by Flutterwave from the number; passed through for our own logging/UI.
};

export async function chargeMobileMoneyRwanda(params: ChargeMobileMoneyParams) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) throw new Error("FLUTTERWAVE_SECRET_KEY is not set.");

  const res = await fetch(`${FLW_BASE_URL}/charges?type=mobile_money_rwanda`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amountRwf,
      currency: "RWF",
      email: params.email,
      phone_number: params.phone,
      fullname: params.fullName,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/callback`,
    }),
  });

  const data = await res.json();
  // Expected: data.status === "success" and the customer gets a USSD/PIN prompt
  // on their phone immediately. Your UI should poll /api/payments/status/:txRef
  // or simply wait for the webhook below to mark the Payment as SUCCESS.
  return data;
}

export async function initiateCardCharge(params: {
  txRef: string;
  amountRwf: number;
  email: string;
  fullName: string;
}) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) throw new Error("FLUTTERWAVE_SECRET_KEY is not set.");

  const res = await fetch(`${FLW_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amountRwf,
      currency: "RWF",
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/callback`,
      customer: { email: params.email, name: params.fullName },
      customizations: { title: "Iwacu Movies", description: "VIP subscription / movie purchase" },
    }),
  });

  const data = await res.json();
  // data.data.link is a hosted Flutterwave checkout URL - redirect the user there for cards.
  return data;
}

/** Verifies a transaction status directly with Flutterwave (belt-and-suspenders alongside the webhook). */
export async function verifyTransaction(transactionId: string) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const res = await fetch(`${FLW_BASE_URL}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  return res.json();
}

/** Validates the `verif-hash` header Flutterwave sends on every webhook call. */
export function isValidWebhookSignature(signatureHeader: string | null) {
  const expected = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!expected || !signatureHeader) return false;
  return signatureHeader === expected;
}
