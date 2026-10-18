"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/orders", label: "Orders", icon: "receipt" },
  { href: "/admin/products", label: "Products", icon: "box" },
  { href: "/admin/categories", label: "Categories", icon: "layers" },
  { href: "/admin/reviews", label: "Reviews", icon: "star" },
  { href: "/admin/content", label: "Content", icon: "doc" },
  { href: "/admin/media", label: "Media", icon: "image" },
  { href: "/admin/logo", label: "Logo", icon: "spark" },
] as const;

type IconName = (typeof links)[number]["icon"] | "menu" | "close" | "logout" | "external";

function Icon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" } as const;
  switch (name) {
    case "grid":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
        </svg>
      );
    case "receipt":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6M9 12h6" />
        </svg>
      );
    case "box":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v9m0 0l8-4.5M12 12L4 7.5" />
        </svg>
      );
    case "layers":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3l9 5-9 5-9-5 9-5zm9 9l-9 5-9-5m18 4l-9 5-9-5" />
        </svg>
      );
    case "star":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
        </svg>
      );
    case "doc":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 3h7l5 5v13H7V3zm7 0v5h5M10 13h7M10 17h7" />
        </svg>
      );
    case "image":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 5h16v14H4V5zm0 10l4-4 4 4 3-3 5 5M9 9.5a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      );
    case "spark":
      return (
        <svg className="w-[18px] h-[18px]" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
        </svg>
      );
    case "menu":
      return (
        <svg className="w-5 h-5" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg className="w-5 h-5" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case "logout":
      return (
        <svg className="w-4 h-4" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12H4m0 0l4-4m-4 4l4 4m3-11h7v14h-7" />
        </svg>
      );
    case "external":
      return (
        <svg className="w-4 h-4" {...common} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M14 4h6v6m0-6l-8 8M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3" aria-label="Admin">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
            isActive(link.href)
              ? "bg-black text-white"
              : "text-neutral-500 hover:text-black hover:bg-neutral-100"
          }`}
        >
          <Icon name={link.icon} />
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-6 h-16 shrink-0">
      <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-oswald text-sm font-bold text-white">
        MA
      </span>
      <span className="leading-none">
        <span className="font-oswald text-sm font-bold tracking-[0.16em] uppercase block">
          MicsApparel
        </span>
        <span className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
          Admin
        </span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-white border-r border-neutral-200 z-40">
        {brand}
        <div className="flex-1 overflow-y-auto py-3">{nav}</div>
        <div className="p-3 border-t border-neutral-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <Icon name="external" />
            View Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-black rounded-lg flex items-center justify-center font-oswald text-xs font-bold text-white">
              MA
            </span>
            <span className="font-oswald text-sm font-bold tracking-[0.16em] uppercase">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-2 -mr-2 text-black"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80%] bg-white flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            {brand}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 mr-4 text-neutral-500"
              aria-label="Close menu"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-3">{nav}</div>
          <div className="p-3 border-t border-neutral-200 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <Icon name="external" />
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <Icon name="logout" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-60">
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
