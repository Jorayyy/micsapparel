import type { Metadata } from "next";
import Link from "next/link";
import { getBusiness } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of MicsApparel — faith-driven premium streetwear founded in Tacloban City, Leyte, Philippines in April 2024.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const business = getBusiness();

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-8">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            About
          </span>
          <h1 className="font-oswald text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            Our Story
          </h1>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14">
            <div className="space-y-5">
              <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block">
                The Beginning
              </span>
              <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                {business.founded}
                <br />
                {business.location.city}
              </h2>
              <p className="text-neutral-500 leading-relaxed text-base">
                {business.description}
              </p>
            </div>

            <div className="space-y-5">
              <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block">
                Our Purpose
              </span>
              <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                Faith & <span className="text-neutral-400">Fashion</span>
              </h2>
              <p className="text-neutral-500 leading-relaxed">{business.mission}</p>
              <p className="text-neutral-400 italic text-base border-l-2 border-neutral-200 pl-5">
                &ldquo;{business.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
              Values
            </span>
            <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {business.values.map((value, i) => (
              <div
                key={value.title}
                className="p-7 bg-white border border-neutral-200 hover:shadow-sm transition-all"
              >
                <span className="font-oswald text-4xl font-bold text-neutral-100">
                  0{i + 1}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase mt-4 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
              Journey
            </span>
            <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {business.milestones.map((milestone, i) => (
              <div
                key={`${milestone.year}-${i}`}
                className="flex gap-6 pb-10 border-l border-neutral-200 pl-7 relative group"
              >
                <span
                  className="absolute left-0 top-0 w-2 h-2 bg-black -translate-x-[4.5px] group-hover:scale-150 transition-transform"
                  aria-hidden="true"
                />
                <div className="font-oswald text-sm font-bold text-neutral-400 tracking-widest uppercase w-20 shrink-0 pt-0.5">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-bold uppercase mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
            Join the Movement
          </h2>
          <p className="text-neutral-500 mb-8 max-w-lg mx-auto text-sm">
            Be part of the MicsApparel community. Follow us for new drops and exclusive
            updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Follow on Facebook
            </a>
            <Link
              href="/products"
              className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
