import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { canAccessMovie } from "@/lib/access";
import VideoPlayer from "@/components/VideoPlayer";
import AccessGate from "@/components/AccessGate";
import MovieRow from "@/components/MovieRow";

export default async function WatchPage({ params }: { params: { slug: string } }) {
  const movie = await db.movie.findUnique({ where: { slug: params.slug } });
  if (!movie) notFound();

  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySession(token) : null;

  const user = session
    ? await db.user.findUnique({
        where: { id: session.userId },
        include: { subscription: true, payments: { where: { status: "SUCCESS" } } },
      })
    : null;

  const decision = canAccessMovie(user, movie, user?.payments);

  if (decision.allowed) {
    // Fire-and-forget view count + watch history update; doesn't block rendering.
    db.movie.update({ where: { id: movie.id }, data: { views: { increment: 1 } } }).catch(() => {});
    if (user) {
      db.watchHistory
        .upsert({
          where: { userId_movieId: { userId: user.id, movieId: movie.id } },
          update: { updatedAt: new Date() },
          create: { userId: user.id, movieId: movie.id },
        })
        .catch(() => {});
    }
  }

  const upNext = await db.movie.findMany({ where: { id: { not: movie.id } }, take: 4 });

  return (
    <div className="bg-black">
      {decision.allowed ? (
        <VideoPlayer
          src={movie.videoUrl || ""}
          poster={movie.posterUrl || undefined}
          qualityRenditions={{ "1080p": movie.videoUrl || "", "720p": movie.videoUrl || "", "480p": movie.videoUrl || "" }}
        />
      ) : (
        <AccessGate reason={decision.reason!} />
      )}
      <div className="bg-bg">
        <MovieRow title="Bikurikira" movies={upNext} />
      </div>
    </div>
  );
}
