"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { ImigongoMark, ImigongoStrip } from "./ImigongoMotif";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-10 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <ImigongoMark size={28} />
            <span className="font-display font-bold text-xl">Iwacu</span>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-muted">
            <Link href="/" className="hover:text-cream">Ahabanza</Link>
            <Link href="/pricing" className="hover:text-cream">Ibiciro</Link>
            <Link href="/admin" className="hover:text-cream">Ikibaho</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch ? (
            <form
              action="/search"
              className="flex items-center gap-2 bg-surface border border-border rounded-md px-2 py-1"
            >
              <Search size={16} className="text-muted" />
              <input
                name="q"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Shakisha..."
                className="bg-transparent outline-none text-sm w-32 text-cream"
              />
            </form>
          ) : (
            <button aria-label="Search" onClick={() => setShowSearch(true)}>
              <Search size={19} />
            </button>
          )}

          <Link href="/login" className="hidden md:block bg-gold text-bg font-bold text-sm rounded-md px-4 py-2">
            Injira
          </Link>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-semibold">
          <Link href="/" className="py-2 border-b border-border">Ahabanza</Link>
          <Link href="/pricing" className="py-2 border-b border-border">Ibiciro</Link>
          <Link href="/admin" className="py-2 border-b border-border">Ikibaho</Link>
          <Link href="/login" className="mt-2 bg-gold text-bg text-center rounded-md py-2 font-bold">Injira</Link>
        </div>
      )}
      <ImigongoStrip height={4} />
    </div>
  );
}
