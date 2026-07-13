import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const movie = await db.movie.findUnique({ where: { id: params.id } });
  if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(movie);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const movie = await db.movie.update({ where: { id: params.id }, data: body });
  return NextResponse.json(movie);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await db.movie.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
