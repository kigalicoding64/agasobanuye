import type { Movie } from "@prisma/client";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  if (movies.length === 0) return null;
  return (
    <div className="px-4 md:px-10 py-5">
      <h3 className="font-display font-semibold text-lg mb-3">{title}</h3>
      <div className="flex gap-4 overflow-x-auto hide-scroll pb-2">
        {movies.map((m) => (
          <div key={m.id} className="flex-none w-40">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
