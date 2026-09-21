import { business } from "@/data/business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${business.name} in ${business.location.full}. Message us on Facebook Messenger or call us directly.`,
};

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#d4a574] rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
            Get In Touch
          </span>
          <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 mb-6">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to order or have questions? We&apos;re here to help. Reach out to us anytime!
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Messenger */}
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-gradient-card border border-white/5 hover:border-[#e94560]/30 transition-all text-center group hover-glow"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0078FF]/10 flex items-center justify-center group-hover:bg-[#0078FF] transition-all">
                <svg className="w-8 h-8 text-[#0078FF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.46 3.443.46 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
                </svg>
              </div>
              <h3 className="font-oswald text-xl font-bold text-white mb-2">Messenger</h3>
              <p className="text-gray-400 text-sm">Message us anytime — we&apos;re always open!</p>
            </a>

            {/* Phone */}
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="p-8 rounded-2xl bg-gradient-card border border-white/5 hover:border-[#e94560]/30 transition-all text-center group hover-glow"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#e94560]/10 flex items-center justify-center group-hover:bg-[#e94560] transition-all">
                <svg className="w-8 h-8 text-[#e94560] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-oswald text-xl font-bold text-white mb-2">Phone</h3>
              <p className="text-gray-400 text-sm">{business.contact.phone}</p>
            </a>

            {/* Facebook */}
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-gradient-card border border-white/5 hover:border-[#e94560]/30 transition-all text-center group hover-glow"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2] transition-all">
                <svg className="w-8 h-8 text-[#1877F2] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="font-oswald text-xl font-bold text-white mb-2">Facebook</h3>
              <p className="text-gray-400 text-sm">Follow our page for updates</p>
            </a>

            {/* TikTok */}
            <a
              href={business.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-gradient-card border border-white/5 hover:border-[#e94560]/30 transition-all text-center group hover-glow"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#000000]/10 flex items-center justify-center group-hover:bg-black transition-all">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.4z" />
                </svg>
              </div>
              <h3 className="font-oswald text-xl font-bold text-white mb-2">TikTok</h3>
              <p className="text-gray-400 text-sm">{business.contact.tiktokHandle}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Location */}
            <div>
              <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
                Location
              </span>
              <h2 className="font-oswald text-4xl font-bold mt-4 mb-6">
                Find Us in <span className="text-gradient">Tacloban City</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#e94560]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#e94560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Address</h4>
                    <p className="text-gray-400">{business.location.full}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#e94560]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#e94560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Business Hours</h4>
                    <p className="text-[#e94560] font-medium">{business.hours.status}</p>
                    <p className="text-gray-400 text-sm">{business.hours.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-white/5 h-[400px] lg:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124514.81569761734!2d124.956!3d11.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a785e8e1b2b3c5%3A0x1234567890abcdef!2sTacloban%20City%2C%20Leyte!5e0!3m2!1sen!2sph!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MicsApparel Location - Tacloban City"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[#e94560] to-[#ff6b81]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-oswald text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Send us a message on Facebook Messenger and we&apos;ll help you with your order. Fast response guaranteed!
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#e94560] font-oswald text-lg font-semibold rounded-full hover:shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.46 3.443.46 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
            </svg>
            Message Us on Messenger
          </a>
        </div>
      </section>
    </>
  );
}
