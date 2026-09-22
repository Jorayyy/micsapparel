"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function Footer() {
  const { business } = useContent();

  return (
    <footer className="bg-white border-t border-neutral-200 pb-16 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.logo}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.endsWith("/logo.svg")) return;
                  target.src = "/logo.svg";
                }}
              />
              <span className="font-oswald text-xl font-bold tracking-[0.18em] uppercase">
                MicsApparel
              </span>
            </div>
            <p className="text-neutral-500 mb-5 max-w-sm leading-relaxed text-sm">
              {business.shortDescription}
            </p>
            <p className="text-neutral-400 italic text-sm">&ldquo;{business.motto}&rdquo;</p>
          </div>

          <div>
            <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop" },
                { href: "/collections", label: "Collections" },
                { href: "/about", label: "About" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-500 hover:text-black text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase mb-5">
              Connect
            </h3>
            <div className="space-y-2.5">
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neutral-500 hover:text-black text-sm transition-colors"
              >
                Facebook
              </a>
              <a
                href={business.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neutral-500 hover:text-black text-sm transition-colors"
              >
                TikTok
              </a>
              <a
                href={business.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neutral-500 hover:text-black text-sm transition-colors"
              >
                Messenger
              </a>
              <a
                href={`tel:${business.contact.phoneRaw}`}
                className="block text-neutral-500 hover:text-black text-sm transition-colors"
              >
                {business.contact.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="py-7 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-400 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} MicsApparel. All rights reserved.
          </p>
          <p className="text-neutral-400 text-xs tracking-wider">
            Made with purpose in Tacloban City
          </p>
        </div>
      </div>
    </footer>
  );
}
