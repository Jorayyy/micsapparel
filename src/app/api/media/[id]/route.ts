import { NextRequest, NextResponse } from "next/server";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { uploadsDir } from "@/lib/store";

export const dynamic = "force-dynamic";

const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]{2,5}$/i;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!SAFE_NAME.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const file = join(uploadsDir(), id);
    const stats = statSync(file);
    const buffer = readFileSync(file);
    const ext = id.split(".").pop()?.toLowerCase() ?? "jpg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Content-Length": String(stats.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
