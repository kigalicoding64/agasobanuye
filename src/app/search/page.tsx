import { db } from "@/lib/db";
import MovieCard from "@/components/MovieCard";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || "";
  const movies = q
    ? await db.movie.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { genre: { contains: q, mode: "insensitive" } },
          ],
        },
      })
    : [];

  return (
    <div className="px-4 md:px-10 py-8" style={{ minHeight: "60vh" }}>
      <h2 className="font-display text-xl mb-4">"{q}"</h2>
      {movies.length === 0 ? (
        <p className="text-muted">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
