import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <AdminLogin />;
  return <AdminShell>{children}</AdminShell>;
}
