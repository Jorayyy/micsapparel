"use client";

import { useContent } from "@/lib/content-context";

export default function Contact() {
  const { business } = useContent();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Contact
          </span>
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-400 mt-6 max-w-lg">
            Have a question, custom order, or just want to say hello? We&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors"
            >
              <svg className="w-6 h-6 mb-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                Phone
              </h3>
              <p className="font-oswald text-lg font-bold group-hover:text-gray-300 transition-colors">
                {business.contact.phone}
              </p>
            </a>

            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors"
            >
              <svg className="w-6 h-6 mb-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                Messenger
              </h3>
              <p className="font-oswald text-lg font-bold group-hover:text-gray-300 transition-colors">
                Message Us
              </p>
            </a>

            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors"
            >
              <svg className="w-6 h-6 mb-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                Facebook
              </h3>
              <p className="font-oswald text-lg font-bold group-hover:text-gray-300 transition-colors">
                @MicsApparel
              </p>
            </a>

            <a
              href={business.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors"
            >
              <svg className="w-6 h-6 mb-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.74V6.69h3.77z" />
              </svg>
              <h3 className="font-oswald text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                TikTok
              </h3>
              <p className="font-oswald text-lg font-bold group-hover:text-gray-300 transition-colors">
                @micko.badilla
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Map & Info */}
      <section className="py-20 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block">
                Visit Us
              </span>
              <h2 className="font-oswald text-4xl font-bold uppercase tracking-tight">
                Tacloban City
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {business.contact.address}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-gray-500 tracking-widest uppercase w-24">
                    Hours
                  </span>
                  <span className="text-white text-sm">
                    {business.contact.hours}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-gray-500 tracking-widest uppercase w-24">
                    Region
                  </span>
                  <span className="text-white text-sm">
                    {business.contact.region}
                  </span>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] bg-[#111] border border-white/5 relative overflow-hidden grayscale">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15755.145637829!2d125.0024!3d11.2497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a4d0c3d4b1c5a5%3A0x1234567890abcdef!2sTacloban%20City%2C%20Leyte!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1) brightness(0.5)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MicsApparel Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight mb-6">
            Ready to Order?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Message us directly on Facebook Messenger for quick response and easy ordering.
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            Order Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
