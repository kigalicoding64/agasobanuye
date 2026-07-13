import Link from "next/link";
import { Lock } from "lucide-react";

const COPY: Record<string, { title: string; body: string; cta: string; href: string }> = {
  LOGIN_REQUIRED: {
    title: "Banza winjire",
    body: "You need an account to watch this title.",
    cta: "Injira / Iyandikishe",
    href: "/login",
  },
  SUBSCRIPTION_REQUIRED: {
    title: "Iki ni VIP",
    body: "This is VIP content. Subscribe to unlock it and everything else marked VIP.",
    cta: "Reba Ibiciro",
    href: "/pricing",
  },
  PAYMENT_REQUIRED: {
    title: "Kwishyura Filimi",
    body: "This title is pay-per-view. Unlock it once to watch immediately.",
    cta: "Ishyura Nonaha",
    href: "/pricing",
  },
};

export default function AccessGate({ reason }: { reason: "LOGIN_REQUIRED" | "SUBSCRIPTION_REQUIRED" | "PAYMENT_REQUIRED" }) {
  const copy = COPY[reason];
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <Lock size={22} className="text-gold" />
      </div>
      <h2 className="font-display text-xl font-bold mb-2">{copy.title}</h2>
      <p className="text-muted text-sm max-w-sm mb-6">{copy.body}</p>
      <Link href={copy.href} className="bg-gold text-bg font-bold rounded-md px-6 py-2.5 text-sm">
        {copy.cta}
      </Link>
    </div>
  );
}
