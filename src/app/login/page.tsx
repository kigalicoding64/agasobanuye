"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed.");
    }
  }

  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "70vh" }}>
      <form onSubmit={submit} className="w-full max-w-sm bg-surface border border-border rounded-xl p-7">
        <h2 className="font-display text-xl mb-5">Ikaze garuka</h2>
        <div className="flex items-center gap-2 mb-3 bg-bgAlt border border-border rounded-md px-3 py-2">
          <Mail size={15} className="text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2 mb-4 bg-bgAlt border border-border rounded-md px-3 py-2">
          <Lock size={15} className="text-muted" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        {error && <p className="text-terracotta text-xs mb-3">{error}</p>}
        <button type="submit" className="w-full bg-gold text-bg font-bold rounded-md py-2.5 mb-3">
          Injira
        </button>
        <p className="text-center text-sm">
          <Link href="/register" className="text-gold">Nta konti ufite? Iyandikishe</Link>
        </p>
      </form>
    </div>
  );
}
