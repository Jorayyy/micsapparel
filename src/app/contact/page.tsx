import type { Metadata } from "next";
import { getBusiness } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MicsApparel — Tacloban City, Leyte. Call, message on Messenger, or follow us on Facebook and TikTok.",
  alternates: { canonical: "/contact" },
};

const MAPS_SRC =
  "https://www.google.com/maps?q=Tacloban+City,+Leyte,+Philippines&output=embed";

export default async function ContactPage() {
  const business = await getBusiness();

  const cards = [
    {
      href: `tel:${business.contact.phoneRaw}`,
      label: "Phone",
      value: business.contact.phone,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      href: business.social.messenger,
      label: "Messenger",
      value: "Message Us",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      href: business.social.facebook,
      label: "Facebook",
      value: "@MicsApparel",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      href: business.social.tiktok,
      label: "TikTok",
      value: business.contact.tiktokHandle,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.74V6.69h3.77z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-8">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Contact
          </span>
          <h1 className="font-oswald text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            Get in Touch
          </h1>
          <p className="text-neutral-500 mt-5 max-w-lg">
            Have a question, custom order, or just want to say hello? We&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="p-7 bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all group"
              >
                <div className="mb-5 text-black">{card.icon}</div>
                <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
                  {card.label}
                </h2>
                <p className="font-oswald text-lg font-bold group-hover:text-neutral-600 transition-colors">
                  {card.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block">
                Visit Us
              </span>
              <h2 className="font-oswald text-3xl font-bold uppercase tracking-tight">
                {business.location.city}
              </h2>
              <p className="text-neutral-500 leading-relaxed">{business.contact.address}</p>

              <dl className="space-y-3">
                <div className="flex items-center gap-4">
                  <dt className="text-[11px] text-neutral-400 tracking-widest uppercase w-24">
                    Hours
                  </dt>
                  <dd className="text-sm">{business.contact.hours}</dd>
                </div>
                <div className="flex items-center gap-4">
                  <dt className="text-[11px] text-neutral-400 tracking-widest uppercase w-24">
                    Region
                  </dt>
                  <dd className="text-sm">{business.contact.region}</dd>
                </div>
              </dl>
            </div>

            <div className="aspect-[4/3] bg-neutral-200 relative overflow-hidden grayscale">
              <iframe
                src={MAPS_SRC}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.05)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MicsApparel Location - Tacloban City"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
            Ready to Order?
          </h2>
          <p className="text-neutral-500 mb-8 max-w-lg mx-auto text-sm">
            Message us directly on Facebook Messenger for quick response and easy ordering.
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Order Now
          </a>
        </div>
      </section>
    </>
  );
}
