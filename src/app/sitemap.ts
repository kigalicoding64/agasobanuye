export const runtime = "nodejs";
import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://iwacumovies.com";
  const movies = await db.movie.findMany({ where: { published: true }, select: { slug: true, createdAt: true } });

  const staticPages = ["", "/pricing", "/login", "/register"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  const moviePages = movies.map((m) => ({
    url: `${base}/movie/${m.slug}`,
    lastModified: m.createdAt,
  }));

  return [...staticPages, ...moviePages];
}
