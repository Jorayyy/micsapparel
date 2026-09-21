"use client";

import { useState } from "react";
import { business, faqs } from "@/data/business";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Help Center
          </span>
          <h1 className="font-oswald text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-tight">
            FAQ
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-xl">
            Got questions? We&apos;ve got answers.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="border-t border-white/5">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/5">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-8 text-left flex items-center justify-between gap-8 group"
                >
                  <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-white group-hover:text-gray-300 transition-colors">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 pb-8" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-5xl font-bold text-black uppercase tracking-tight mb-6">
            Still Have Questions?
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Send us a message.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
            >
              Message Us
            </a>
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="px-10 py-5 border border-black/20 text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-black/5 transition-colors"
            >
              Call {business.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
