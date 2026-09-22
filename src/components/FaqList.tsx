"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/types";
import { messengerUrl } from "@/lib/messenger";

export default function FaqList({
  faqs,
  messenger,
}: {
  faqs: Faq[];
  messenger: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="divide-y divide-neutral-200">
        {faqs.map((faq, i) => (
          <div key={faq.id} className="py-1">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-expanded={openIndex === i}
            >
              <span className="font-oswald text-lg font-bold uppercase pr-4 group-hover:text-neutral-600 transition-colors">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 shrink-0 text-neutral-400 transition-transform duration-300 ${
                  openIndex === i ? "rotate-45" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <p className="text-neutral-600 leading-relaxed text-sm">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
          Still Have Questions?
        </h2>
        <p className="text-neutral-500 mb-7 max-w-lg mx-auto text-sm">
          Can&apos;t find the answer you&apos;re looking for? Message us on Facebook and
          we&apos;ll get back to you as soon as possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={messengerUrl(messenger, "Hi MicsApparel! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Message Us
          </a>
          <Link
            href="/contact"
            className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
          >
            Contact Page
          </Link>
        </div>
      </div>
    </>
  );
}
