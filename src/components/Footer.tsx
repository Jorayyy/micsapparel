"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function Footer() {
  const { business } = useContent();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Main Footer */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={business.logo}
                alt="MicsApparel"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=100";
                }}
              />
              <span className="font-oswald text-xl font-bold tracking-[0.2em] uppercase text-gray-900">
                MicsApparel
              </span>
            </div>
            <p className="text-gray-500 mb-6 max-w-sm leading-relaxed">
              {business.shortDescription}
            </p>
            <p className="text-gray-400 italic text-sm">
              &ldquo;{business.motto}&rdquo;
            </p>
          </div>

          <div>
            <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/products", label: "Shop" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-6">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Facebook
              </a>
              <a
                href={business.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                TikTok
              </a>
              <a
                href={business.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Messenger
              </a>
              <a
                href={`tel:${business.contact.phoneRaw}`}
                className="flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                {business.contact.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} MicsApparel. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs tracking-wider">
            Made with purpose in Tacloban City
          </p>
        </div>
      </div>
    </footer>
  );
}
