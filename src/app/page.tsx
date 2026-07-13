import { db } from "@/lib/db";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";

export const revalidate = 60; // re-fetch from DB at most once a minute

export default async function HomePage() {
  const movies = await db.movie.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  if (movies.length === 0) {
    return (
      <div className="px-4 md:px-10 py-20 text-center text-muted">
        No movies published yet. Visit /admin to upload your first title, or run{" "}
        <code className="font-mono text-gold">npm run db:seed</code> to load sample data.
      </div>
    );
  }

  const featured = movies.find((m) => m.category === "trending") || movies[0];
  const byCategory = (cat: string) => movies.filter((m) => m.category === cat);

  const rows = [
    { title: "Bishyushye Cyane", items: byCategory("trending") },
    { title: "Ibishya", items: byCategory("new") },
    { title: "Inkuru Nyarwanda", items: byCategory("original") },
    { title: "Igikorwa", items: byCategory("action") },
    { title: "Iyemera", items: byCategory("drama") },
    { title: "Igiseko", items: byCategory("comedy") },
    { title: "Inyandiko-vugo", items: byCategory("documentary") },
    { title: "VIP Gusa", items: movies.filter((m) => m.isVip) },
  ];

  return (
    <div>
      <Hero movie={featured} />
      {rows.map((r) => (
        <MovieRow key={r.title} title={r.title} movies={r.items} />
      ))}
    </div>
  );
}
