export const runtime = "nodejs";
import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { Eye, DollarSign, Users, Film, UploadCloud } from "lucide-react";

export default async function AdminPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session || session.role !== "ADMIN") {
    return (
      <div className="px-4 md:px-10 py-20 text-center text-muted">
        Admin access only. {" "}
        <Link href="/login" className="text-gold">Log in</Link> with an admin account.
      </div>
    );
  }

  const [movies, userCount, revenue] = await Promise.all([
    db.movie.findMany({ orderBy: { createdAt: "desc" } }),
    db.user.count(),
    db.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amountRwf: true } }),
  ]);

  const totalViews = movies.reduce((sum, m) => sum + m.views, 0);

  return (
    <div className="px-4 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Ikibaho cy'Umuyobozi</h1>
        <Link href="/admin/upload" className="flex items-center gap-2 bg-gold text-bg font-bold rounded-md px-4 py-2 text-sm">
          <UploadCloud size={15} /> Ohereza Firime
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard label="Total Views" value={totalViews.toLocaleString()} icon={Eye} />
        <StatCard label="Total Revenue" value={`${(revenue._sum.amountRwf || 0).toLocaleString()} RWF`} icon={DollarSign} />
        <StatCard label="Users" value={userCount.toLocaleString()} icon={Users} />
        <StatCard label="Titles" value={movies.length.toString()} icon={Film} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-2 px-2">Title</th>
              <th className="py-2 px-2">Genre</th>
              <th className="py-2 px-2">Access</th>
              <th className="py-2 px-2">Views</th>
              <th className="py-2 px-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b border-border">
                <td className="py-2 px-2 font-semibold">{m.title}</td>
                <td className="py-2 px-2 text-muted">{m.genre}</td>
                <td className="py-2 px-2">{m.isPpv ? `PPV - ${m.priceRwf} RWF` : m.isVip ? "VIP" : "Free"}</td>
                <td className="py-2 px-2 font-mono">{m.views}</td>
                <td className="py-2 px-2">{m.rating?.toFixed(1) || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
