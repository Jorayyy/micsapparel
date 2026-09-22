import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getMediaContent, uploadsDir } from "@/lib/store";

export const dynamic = "force-dynamic";

const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]{2,5}$/i;
const UUID_ONLY = /^[a-f0-9-]{36}$/i;

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
  if (!SAFE_NAME.test(id) && !UUID_ONLY.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const uuid = id.split(".")[0];
    const row = await getMediaContent(uuid);
    if (row?.content) {
      const ext = id.includes(".") ? (id.split(".").pop()?.toLowerCase() ?? "") : "";
      const bytes = new Uint8Array(row.content);
      return new NextResponse(bytes, {
        headers: {
          "Content-Type": row.item.mimeType || MIME[ext] || "application/octet-stream",
          "Content-Length": String(bytes.byteLength),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const legacy = SAFE_NAME.test(id) ? join(uploadsDir(), id) : null;
    if (legacy && existsSync(legacy)) {
      const buffer = readFileSync(legacy);
      const ext = id.split(".").pop()?.toLowerCase() ?? "jpg";
      const bytes = new Uint8Array(buffer);
      return new NextResponse(bytes, {
        headers: {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Content-Length": String(bytes.byteLength),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
