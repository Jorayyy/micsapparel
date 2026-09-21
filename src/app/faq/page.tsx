"use client";

import { useState } from "react";
import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function FAQ() {
  const { faqs, business } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
            Help
          </span>
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase tracking-tight text-gray-900">
            FAQ
          </h1>
          <p className="text-gray-500 mt-6 max-w-lg">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, feel free to reach out.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, i) => (
              <div key={i} className="py-1">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="font-oswald text-lg font-bold uppercase pr-4 group-hover:text-gray-600 transition-colors text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                      openIndex === i ? "rotate-45" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-tight mb-6">
            Still Have Questions?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Message us on Facebook and
            we&apos;ll get back to you as soon as possible.
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors rounded"
          >
            Message Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
