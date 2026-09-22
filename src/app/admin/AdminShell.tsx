"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/logo", label: "Logo" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-black flex items-center justify-center font-oswald text-sm font-bold text-white">
                  MA
                </span>
                <span className="font-oswald text-sm font-bold tracking-[0.18em] uppercase hidden sm:block">
                  MicsApparel
                </span>
              </Link>
              <span className="text-neutral-300" aria-hidden="true">
                |
              </span>
              <span className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.18em] uppercase">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-neutral-500 hover:text-black text-xs tracking-widest uppercase transition-colors"
              >
                View Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs text-neutral-500 hover:text-black border border-neutral-300 hover:bg-neutral-50 transition-all tracking-widest uppercase"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide" aria-label="Admin">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap transition-all ${
                    active
                      ? "bg-black text-white"
                      : "text-neutral-400 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">{children}</main>
    </div>
  );
}
