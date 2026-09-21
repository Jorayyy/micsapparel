import { business } from "@/data/business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${business.name} in ${business.location.full}.`,
};

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Get In Touch
          </span>
          <h1 className="font-oswald text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-tight">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.46 3.443.46 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
                  </svg>
                ),
                title: "Messenger",
                desc: "Message us anytime",
                link: business.social.messenger,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: "Phone",
                desc: business.contact.phone,
                link: `tel:${business.contact.phoneRaw}`,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
                title: "Facebook",
                desc: "Follow our page",
                link: business.social.facebook,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.4z" />
                  </svg>
                ),
                title: "TikTok",
                desc: business.contact.tiktokHandle,
                link: business.social.tiktok,
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-oswald text-lg font-bold uppercase mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Map */}
      <section className="py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block">
                Location
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
                Find Us
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 py-6 border-b border-white/5">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">{business.location.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6 border-b border-white/5">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">{business.hours.status}</p>
                    <p className="text-gray-500 text-sm mt-1">{business.hours.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-square lg:aspect-auto bg-[#111] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124514.81569761734!2d124.956!3d11.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a785e8e1b2b3c5%3A0x1234567890abcdef!2sTacloban%20City%2C%20Leyte!5e0!3m2!1sen!2sph!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1)" }}
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
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight mb-6">
            Ready to Order?
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
            Send us a message and we&apos;ll help you with your order.
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.46 3.443.46 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
            </svg>
            Message Us on Messenger
          </a>
        </div>
      </section>
    </>
  );
}
