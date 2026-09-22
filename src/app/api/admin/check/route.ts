import { NextResponse } from "next/server";
import { isAdminAuthenticated, hasAdminPassword } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized", passwordConfigured: hasAdminPassword() },
      { status: 401 }
    );
  }
  return NextResponse.json({ authenticated: true });
}
