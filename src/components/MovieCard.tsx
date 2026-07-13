import Link from "next/link";
import { Star } from "lucide-react";
import type { Movie } from "@prisma/client";

export default function MovieCard({ movie }: { movie: Movie }) {
  const accessLabel = movie.isPpv ? `${movie.priceRwf?.toLocaleString()} RWF` : movie.isVip ? "VIP" : "Free";
  const accessColor = movie.isPpv ? "text-terracotta" : movie.isVip ? "text-gold" : "text-green";

  return (
    <Link href={`/movie/${movie.slug}`} className="row-card block">
      <div
        className="relative w-full rounded-lg overflow-hidden border border-border"
        style={{ aspectRatio: "2/3", background: "linear-gradient(160deg, #C1432D, #2B1810)" }}
      >
        {movie.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={movie.posterUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent">
          <span className="font-display font-bold text-sm leading-tight">{movie.title}</span>
        </div>
        <div className="absolute top-2 left-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
          <Star size={10} className="text-gold" fill="#E8A33D" />
          <span className="font-mono text-xs">{movie.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-muted">{movie.genre}</span>
        <span className={`text-xs font-mono font-semibold ${accessColor}`}>{accessLabel}</span>
      </div>
    </Link>
  );
}
