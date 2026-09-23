"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContent } from "@/lib/content-context";
import { useCart } from "@/lib/cart-context";
import { messengerUrl } from "@/lib/messenger";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const bottomLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Shop", icon: "shop" },
  { href: "#search", label: "Search", icon: "search" },
  { href: "#cart", label: "Cart", icon: "cart" },
];

function NavIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" } as const;
  switch (name) {
    case "home":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "shop":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h12l1 13H5L6 7zm3 0a3 3 0 016 0" />
        </svg>
      );
    case "search":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      );
    case "cart":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h12l-1 13H7L6 7zm3 0a3 3 0 016 0" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { business } = useContent();
  const { count, open } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled || isOpen
            ? "bg-white/95 backdrop-blur border-b border-neutral-200"
            : "bg-white/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="MicsApparel home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.logo}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-200 group-hover:ring-black transition-all"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.endsWith("/logo.svg")) return;
                  target.src = "/logo.svg";
                }}
              />
              <span className="font-oswald text-lg font-bold tracking-[0.18em] uppercase hidden sm:block">
                MicsApparel
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[12px] font-medium tracking-[0.18em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    pathname === link.href
                      ? "text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`p-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  searchOpen ? "text-black" : "text-neutral-600 hover:text-black"
                }`}
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <NavIcon name="search" />
              </button>

              <button
                type="button"
                onClick={open}
                className="relative p-2.5 text-neutral-600 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              >
                <NavIcon name="cart" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              <a
                href={messengerUrl(business.social.messenger, "Hi MicsApparel! I'd like to order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex ml-2 px-5 py-2.5 bg-black text-white text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-neutral-800 transition-colors"
              >
                Order Now
              </a>

              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden p-2.5 text-black ml-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <div className="w-6 h-4 flex flex-col justify-between">
                  <span
                    className={`w-full h-[1.5px] bg-black transition-all duration-300 ${
                      isOpen ? "rotate-45 translate-y-[5px]" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-[1.5px] bg-black transition-all duration-300 ${
                      isOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-[1.5px] bg-black transition-all duration-300 ${
                      isOpen ? "-rotate-45 -translate-y-[5px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search dropdown below navbar */}
        <div
          className={`overflow-hidden transition-all duration-300 border-t border-transparent ${
            searchOpen ? "max-h-24 opacity-100 border-neutral-200" : "max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={submitSearch}
            className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3"
          >
            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full px-4 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="pt-24 pb-28 px-6 h-full flex flex-col">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-oswald text-4xl font-bold uppercase tracking-wide py-3 border-b border-neutral-100 hover:text-neutral-500 transition-colors"
                style={{
                  transitionDelay: isOpen ? `${i * 60}ms` : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(16px)",
                  opacity: isOpen ? 1 : 0,
                  transition: "all 0.4s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={messengerUrl(business.social.messenger, "Hi MicsApparel! I'd like to order.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="mt-8 px-8 py-4 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase text-center"
          >
            Order via Messenger
          </a>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-neutral-200 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile quick links"
      >
        <div className="grid grid-cols-4">
          {bottomLinks.map((link) => {
            const isCart = link.icon === "cart";
            const isSearch = link.icon === "search";
            const content = (
              <>
                <span className="relative">
                  <NavIcon name={link.icon} />
                  {isCart && count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-black text-white text-[9px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] tracking-[0.15em] uppercase mt-1">
                  {link.label}
                </span>
              </>
            );

            if (isCart) {
              return (
                <button
                  key="cart"
                  type="button"
                  onClick={open}
                  className="flex flex-col items-center justify-center py-2.5 text-neutral-600 hover:text-black transition-colors"
                  aria-label={`Open cart, ${count} items`}
                >
                  {content}
                </button>
              );
            }

            if (isSearch) {
              return (
                <button
                  key="search"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex flex-col items-center justify-center py-2.5 text-neutral-600 hover:text-black transition-colors"
                  aria-label="Search products"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-2.5 transition-colors ${
                  pathname === link.href
                    ? "text-black"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
