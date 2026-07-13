export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "CREATOR")) {
    return NextResponse.json({ error: "Admin or creator access required." }, { status: 403 });
  }

  const filename = req.nextUrl.searchParams.get("filename");
  const contentType = req.nextUrl.searchParams.get("contentType") || "application/octet-stream";
  const kind = req.nextUrl.searchParams.get("kind") || "video";

  if (!filename) return NextResponse.json({ error: "filename is required" }, { status: 400 });

  const key = `${kind}/${Date.now()}-${filename.replace(/\s+/g, "-")}`;
  const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, publicUrl });
}
