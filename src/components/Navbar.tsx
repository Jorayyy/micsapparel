"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContent } from "@/lib/content-context";
import { useCart } from "@/lib/cart-context";

const ANNOUNCEMENTS = [
  "Nationwide shipping across the Philippines",
  "Cash on delivery available",
  "Order 24/7 via Messenger",
  "Premium streetwear from Tacloban City",
];

function Icon({ name }: { name: "search" | "cart" | "close" }) {
  const common = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" } as const;
  if (name === "search") {
    return (
      <svg className="w-5 h-5" {...common} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    );
  }
  if (name === "cart") {
    return (
      <svg className="w-5 h-5" {...common} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h12l-1 13H7L6 7zm3 0a3 3 0 016 0" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" {...common} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CategoryTabs() {
  const { categories } = useContent();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";
  const tabs = [{ slug: "all", name: "All" }, ...categories];

  return (
    <nav
      className="hidden lg:flex items-center justify-center gap-7 pb-3"
      aria-label="Categories"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.slug === "all" ? "/products" : `/products?category=${tab.slug}`}
          className={`text-[11px] font-medium tracking-[0.16em] uppercase whitespace-nowrap underline-offset-[6px] transition-colors ${
            active === tab.slug
              ? "text-black underline"
              : "text-neutral-400 hover:text-black"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { business, categories } = useContent();
  const { count, open } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        {/* Announcement marquee */}
        <div className="bg-black text-white overflow-hidden">
          <div className="flex animate-marquee-banner whitespace-nowrap py-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="text-[10px] font-medium tracking-[0.2em] uppercase mx-3"
              >
                {ANNOUNCEMENTS.join("  \u00b7  ")} {"\u00b7"}{" "}
              </span>
            ))}
          </div>
          <p className="sr-only">{ANNOUNCEMENTS.join(". ")}</p>
        </div>

        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="relative flex items-center justify-between h-14 lg:h-16">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 -ml-2 text-black"
                aria-label="Open menu"
              >
                <div className="w-6 h-4 flex flex-col justify-between">
                  <span className="w-full h-[1.5px] bg-black" />
                  <span className="w-full h-[1.5px] bg-black" />
                  <span className="w-full h-[1.5px] bg-black" />
                </div>
              </button>

              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5"
                aria-label={`${business.name} home`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={business.logo}
                  alt=""
                  className="w-8 h-8 object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src.endsWith("/logo.svg")) return;
                    target.src = "/logo.svg";
                  }}
                />
                <span className="font-oswald text-lg font-bold tracking-[0.2em] uppercase hidden sm:block">
                  {business.name}
                </span>
              </Link>

              <div className="flex items-center gap-1 ml-auto">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSearchOpen((v) => !v)}
                    className={`p-2.5 transition-colors ${
                      searchOpen ? "text-black" : "text-neutral-700 hover:text-black"
                    }`}
                    aria-label="Search products"
                    aria-expanded={searchOpen}
                  >
                    <Icon name="search" />
                  </button>
                  <div
                    className={`absolute top-full right-0 mt-2 w-64 bg-white border shadow-sm overflow-hidden transition-all duration-300 ${
                      searchOpen
                        ? "max-h-24 opacity-100 border-neutral-200"
                        : "max-h-0 opacity-0 border-transparent shadow-none pointer-events-none"
                    }`}
                  >
                    <form onSubmit={submitSearch} className="p-2.5">
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products"
                        aria-label="Search products"
                        className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </form>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={open}
                  className="relative p-2.5 text-neutral-700 hover:text-black transition-colors"
                  aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
                >
                  <Icon name="cart" />
                  {count > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-black text-white text-[9px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <CategoryTabs />
          </div>
        </header>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-8">
            <span className="font-oswald text-lg font-bold tracking-[0.2em] uppercase">
              {business.name}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav className="flex flex-col" aria-label="Mobile categories">
            {[{ slug: "all", name: "All" }, ...categories].map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="font-oswald text-3xl font-bold uppercase tracking-wide py-3 border-b border-neutral-100 hover:text-neutral-500 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="font-oswald text-3xl font-bold uppercase tracking-wide py-3 border-b border-neutral-100 hover:text-neutral-500 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="font-oswald text-3xl font-bold uppercase tracking-wide py-3 border-b border-neutral-100 hover:text-neutral-500 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
