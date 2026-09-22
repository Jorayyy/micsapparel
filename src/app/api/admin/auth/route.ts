import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  clearAttempts,
  clientKey,
  createSessionToken,
  isLoginBlocked,
  isSameOrigin,
  recordFailedAttempt,
  SESSION_COOKIE,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const key = clientKey(request);
  if (isLoginBlocked(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const result = authenticateAdmin(password);
    if (!result.ok) {
      recordFailedAttempt(key);
      return NextResponse.json({ error: result.error ?? "Invalid password" }, {
        status: 401,
      });
    }

    const token = createSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Session could not be created" }, { status: 500 });
    }

    clearAttempts(key);
    const response = NextResponse.json({ success: true });
    const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: proto === "https",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
