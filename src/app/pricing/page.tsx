"use client";

import { useState } from "react";
import { CheckCircle2, Smartphone, CreditCard } from "lucide-react";

const PLANS = [
  { id: "FREE", name: "Free", priceRwf: 0, features: ["SD streaming", "Ads supported", "1 device"] },
  { id: "VIP_MONTHLY", name: "VIP Monthly", priceRwf: 2500, features: ["HD streaming", "Ad-free", "2 devices", "Offline downloads"], popular: true },
  { id: "VIP_YEARLY", name: "VIP Yearly", priceRwf: 25000, features: ["Everything in VIP Monthly", "2 months free vs monthly"] },
];

const METHODS = [
  { id: "MOMO", label: "MTN Mobile Money", icon: Smartphone },
  { id: "AIRTEL", label: "Airtel Money", icon: Smartphone },
  { id: "CARD", label: "Visa / Mastercard", icon: CreditCard },
  { id: "PAYPAL", label: "PayPal", icon: CreditCard },
];

export default function PricingPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function pay() {
    if (!plan || !method) return;
    setStatus("pending");
    const res = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, method, phone }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage(
        method === "MOMO" || method === "AIRTEL"
          ? "Check your phone for the payment confirmation prompt (USSD/PIN)."
          : "Redirecting you to complete payment..."
      );
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } else {
      setStatus("error");
      setMessage(data.error || "Payment could not be started.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "60vh" }}>
        <CheckCircle2 size={48} className="text-green mb-4" />
        <h2 className="font-display text-2xl mb-2">Almost done!</h2>
        <p className="text-muted max-w-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-10">
      <h2 className="font-display text-2xl md:text-3xl text-center mb-8">Hitamo Forfait</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-10 max-w-4xl mx-auto">
        {PLANS.map((p) => (
          <div
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`relative bg-surface border-2 rounded-xl p-5 cursor-pointer ${plan === p.id ? "border-gold" : "border-border"}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-5 bg-gold text-bg text-xs font-bold px-2 py-0.5 rounded">Most Popular</span>
            )}
            <h3 className="font-display text-lg mb-1">{p.name}</h3>
            <p className="font-mono text-2xl font-semibold text-gold mb-3">
              {p.priceRwf === 0 ? "Free" : `${p.priceRwf.toLocaleString()} RWF`}
            </p>
            <ul className="flex flex-col gap-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 size={14} className="text-gold" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {plan && plan !== "FREE" && (
        <div className="max-w-md mx-auto bg-surface border border-border rounded-xl p-6">
          <h3 className="font-display text-base mb-4">Hitamo uburyo bwo kwishyura</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-2 text-xs rounded-md border px-3 py-2 ${
                  method === m.id ? "border-gold bg-gold/10" : "border-border"
                }`}
              >
                <m.icon size={15} className="text-gold" /> {m.label}
              </button>
            ))}
          </div>

          {(method === "MOMO" || method === "AIRTEL") && (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 7XX XXX XXX"
              className="w-full bg-bgAlt border border-border rounded-md px-3 py-2 text-sm mb-4 outline-none"
            />
          )}

          {status === "error" && <p className="text-terracotta text-xs mb-3">{message}</p>}

          <button
            disabled={!method || status === "pending"}
            onClick={pay}
            className="w-full bg-gold text-bg font-bold rounded-md py-2.5 disabled:opacity-40"
          >
            {status === "pending" ? "Processing..." : "Ishyura Nonaha"}
          </button>
        </div>
      )}
    </div>
  );
}
