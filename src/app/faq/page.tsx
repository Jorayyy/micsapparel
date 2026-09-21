"use client";

import { useState } from "react";
import { business, faqs } from "@/data/business";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#e94560] rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
            Help Center
          </span>
          <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Find everything you need to know about ordering from MicsApparel.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  openIndex === index
                    ? "bg-gradient-card border-[#e94560]/30"
                    : "bg-[#1a1a2e] border-white/5 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <h3 className="font-oswald text-lg font-semibold text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-[#e94560] flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-oswald text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-[#e94560]/30 transition-all hover:scale-105"
            >
              Message Us on Messenger
            </a>
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="px-8 py-4 border-2 border-white/20 text-white font-oswald text-lg font-semibold rounded-full hover:bg-white/5 transition-all"
            >
              Call {business.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
