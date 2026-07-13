import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Movie } from "@prisma/client";

export default function Hero({ movie }: { movie: Movie }) {
  return (
    <div
      className="relative h-[58vh] min-h-[380px] overflow-hidden"
      style={{ background: "linear-gradient(135deg, #C1432D, #2B1810)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/70 to-bg" />
      <div className="absolute bottom-16 left-0 px-4 md:px-10 max-w-xl">
        <span className="font-mono text-xs text-gold tracking-wide">BISHYUSHYE CYANE</span>
        <h1 className="font-display font-bold text-3xl md:text-5xl my-2 leading-tight">{movie.title}</h1>
        <p className="text-muted text-sm mb-4 leading-relaxed">{movie.description}</p>
        <div className="flex gap-3">
          <Link
            href={`/watch/${movie.slug}`}
            className="flex items-center gap-2 bg-gold text-bg font-bold rounded-md px-5 py-2.5 text-sm"
          >
            <Play size={16} fill="#15110D" /> Reba Nonaha
          </Link>
          <Link
            href={`/movie/${movie.slug}`}
            className="flex items-center gap-2 bg-cream/10 border border-borderLight rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            <Info size={16} /> Amakuru Arambuye
          </Link>
        </div>
      </div>
    </div>
  );
}
