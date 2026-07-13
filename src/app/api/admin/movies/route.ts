import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// Note: this route is also protected at the middleware layer (requires role
// ADMIN or CREATOR), but we double-check here since middleware can be
// misconfigured or bypassed in edge cases - never trust only one layer.
const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  genre: z.string(),
  category: z.string(),
  isVip: z.boolean().default(false),
  isPpv: z.boolean().default(false),
  priceRwf: z.number().optional(),
  videoUrl: z.string().optional(),
  posterUrl: z.string().optional(),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "CREATOR")) {
    return NextResponse.json({ error: "Admin or creator access required." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const data = parsed.data;
  let slug = slugify(data.title);
  const existing = await db.movie.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const movie = await db.movie.create({
    data: { ...data, slug, uploadedById: user.id },
  });

  return NextResponse.json(movie, { status: 201 });
}
