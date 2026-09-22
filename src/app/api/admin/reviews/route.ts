import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import { deleteReview, getReviews, upsertReview } from "@/lib/store";
import type { ReviewInput } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ reviews: getReviews({ includeHidden: true }) });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const input = (await request.json()) as ReviewInput;
    if (!input?.name || !input?.text) {
      return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
    }
    const review = upsertReview({
      name: input.name,
      text: input.text,
      rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
      source: input.source || "Website",
      status: input.status || "published",
      ...(input.id ? { id: input.id } : {}),
    });
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Review id required" }, { status: 400 });
    }
    const removed = deleteReview(body.id);
    if (!removed) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
