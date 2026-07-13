import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await db.movie.findUnique({ where: { slug: params.slug } });
  if (!movie) return {};
  return {
    title: `${movie.title} - Iwacu Movies`,
    description: movie.description,
    openGraph: { images: movie.posterUrl ? [movie.posterUrl] : [] },
  };
}

export default async function MoviePage({ params }: { params: { slug: string } }) {
  const movie = await db.movie.findUnique({
    where: { slug: params.slug },
    include: { comments: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!movie) notFound();

  const accessLabel = movie.isPpv ? `${movie.priceRwf?.toLocaleString()} RWF` : movie.isVip ? "VIP" : "Free";

  const similar = await db.movie.findMany({
    where: { genre: movie.genre, id: { not: movie.id } },
    take: 4,
  });

  return (
    <div>
      <div
        className="h-[42vh] min-h-[260px]"
        style={{ background: "linear-gradient(135deg, #C1432D, #2B1810)" }}
      />
      <div className="px-4 md:px-10 -mt-20 relative">
        <span className="font-mono text-xs font-bold text-gold">{accessLabel.toUpperCase()}</span>
        <h1 className="font-display font-bold text-3xl md:text-4xl my-1">{movie.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted font-mono mb-4">
          <span>{movie.releaseYear}</span>
          <span>·</span>
          <span>{movie.durationMinutes} min</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Star size={13} className="text-gold" fill="#E8A33D" />{movie.rating.toFixed(1)}</span>
        </div>
        <Link href={`/watch/${movie.slug}`} className="inline-flex items-center gap-2 bg-gold text-bg font-bold rounded-md px-5 py-2.5 mb-8">
          <Play size={16} fill="#15110D" /> Reba Nonaha
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-display text-base mb-2">Incamake</h3>
            <p className="text-muted text-sm leading-relaxed mb-8">{movie.description}</p>

            <h3 className="font-display text-base mb-3">Ibitekerezo ({movie.comments.length})</h3>
            <div className="flex flex-col gap-3">
              {movie.comments.length === 0 && <p className="text-mutedDark text-sm">No comments yet - be the first.</p>}
              {movie.comments.map((c) => (
                <div key={c.id} className="border-b border-border pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{c.user.name}</span>
                    <span className="flex gap-0.5">
                      {Array.from({ length: c.rating }).map((_, i) => (
                        <Star key={i} size={11} className="text-gold" fill="#E8A33D" />
                      ))}
                    </span>
                  </div>
                  <p className="text-muted text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-base mb-3">Inkuru zindi</h3>
            <div className="flex flex-col gap-3">
              {similar.map((m) => (
                <Link key={m.id} href={`/movie/${m.slug}`} className="flex gap-3 items-center">
                  <div className="w-14 h-20 rounded-md flex-shrink-0" style={{ background: "linear-gradient(160deg, #C1432D, #2B1810)" }} />
                  <div>
                    <p className="text-sm font-semibold">{m.title}</p>
                    <p className="text-xs text-muted">{m.genre} · {m.releaseYear}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
}
