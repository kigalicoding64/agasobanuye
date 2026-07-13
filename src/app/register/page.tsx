"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [via, setVia] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const body = via === "email" ? { name, email: value, password } : { name, phone: value, password };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Could not create account.");
    }
  }

  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "70vh" }}>
      <form onSubmit={submit} className="w-full max-w-sm bg-surface border border-border rounded-xl p-7">
        <h2 className="font-display text-xl mb-5">Fungura Konti</h2>

        <div className="flex gap-2 mb-4">
          {(["email", "phone"] as const).map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setVia(v)}
              className={`flex-1 py-2 rounded-md text-sm font-semibold border ${
                via === v ? "border-gold text-gold bg-gold/10" : "border-border text-muted"
              }`}
            >
              {v === "email" ? "Imeyili" : "Telefoni"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3 bg-bgAlt border border-border rounded-md px-3 py-2">
          <User size={15} className="text-muted" />
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Izina ryawe"
            className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <div className="flex items-center gap-2 mb-3 bg-bgAlt border border-border rounded-md px-3 py-2">
          {via === "email" ? <Mail size={15} className="text-muted" /> : <Phone size={15} className="text-muted" />}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            placeholder={via === "email" ? "you@example.com" : "+250 7XX XXX XXX"}
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2 mb-4 bg-bgAlt border border-border rounded-md px-3 py-2">
          <Lock size={15} className="text-muted" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="Password" className="bg-transparent outline-none text-sm flex-1" />
        </div>

        {error && <p className="text-terracotta text-xs mb-3">{error}</p>}
        <button type="submit" className="w-full bg-gold text-bg font-bold rounded-md py-2.5 mb-3">Iyandikishe</button>
        <p className="text-center text-sm">
          <Link href="/login" className="text-gold">Ufite konti? Injira</Link>
        </p>
      </form>
    </div>
  );
}
