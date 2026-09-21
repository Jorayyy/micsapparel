import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "micsapparel2024";
const SESSION_COOKIE = "admin-session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === "authenticated";
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    return true;
  }
  return false;
}

export async function setAdminSession(): Promise<string> {
  return SESSION_COOKIE;
}

export async function clearAdminSession(): Promise<string> {
  return SESSION_COOKIE;
}

export function getAdminPassword(): string {
  return ADMIN_PASSWORD;
}
