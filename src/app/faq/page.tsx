import type { Metadata } from "next";
import FaqList from "@/components/FaqList";
import { getBusiness, getFaqs } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about MicsApparel orders, payment, shipping, returns, and wholesale.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, business] = await Promise.all([getFaqs(), getBusiness()]);

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-8">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Help
          </span>
          <h1 className="font-oswald text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            FAQ
          </h1>
          <p className="text-neutral-500 mt-5 max-w-lg">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, feel free to reach out.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10">
          <FaqList faqs={faqs} messenger={business.social.messenger} />
        </div>
      </section>
    </>
  );
}
