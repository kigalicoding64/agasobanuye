export const runtime = "nodejs";
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
