import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const q = req.nextUrl.searchParams.get("q");

  const movies = await db.movie.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(movies);
}
