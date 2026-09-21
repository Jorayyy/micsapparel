"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { business } from "@/data/business";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Shop" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src={business.logo}
                alt="MicsApparel"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-white/30 transition-all"
              />
              <span className="font-oswald text-xl font-bold tracking-[0.2em] uppercase hidden sm:block">
                MicsApparel
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-[13px] font-medium text-gray-400 hover:text-white tracking-widest uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href={business.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white text-black text-[13px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
              >
                Order Now
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-[1.5px] bg-white transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-[5px]" : ""
                  }`}
                />
                <span
                  className={`w-full h-[1.5px] bg-white transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-[1.5px] bg-white transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-[5px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-all duration-500 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-oswald text-5xl font-bold tracking-wider uppercase text-white hover:text-gray-400 transition-colors"
              style={{
                transitionDelay: isOpen ? `${i * 80}ms` : "0ms",
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? 1 : 0,
                transition: "all 0.4s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-3 bg-white text-black font-oswald text-lg font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            style={{
              transitionDelay: isOpen ? "400ms" : "0ms",
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isOpen ? 1 : 0,
              transition: "all 0.4s ease",
            }}
          >
            Order Now
          </a>
        </div>
      </div>
    </>
  );
}
