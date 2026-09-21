"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function About() {
  const { business } = useContent();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            About
          </span>
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase tracking-tight">
            Our Story
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block">
                The Beginning
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
                {business.founded}
                <br />
                Tacloban City
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {business.description}
              </p>
            </div>

            <div className="space-y-8">
              <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block">
                Our Purpose
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
                Faith &{" "}
                <span className="text-gray-500">Fashion</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {business.mission}
              </p>
              <p className="text-white/40 italic text-lg border-l-2 border-white/20 pl-6">
                &ldquo;{business.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
              Values
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {business.values.map((value, i) => (
              <div key={i} className="p-10 bg-[#0a0a0a] group hover:bg-black transition-colors">
                <span className="font-oswald text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                  0{i + 1}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase mt-6 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
              Journey
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {business.milestones.map((milestone, i) => (
              <div
                key={i}
                className="flex gap-8 pb-12 border-l border-white/10 pl-8 relative group"
              >
                <div className="absolute left-0 top-0 w-2 h-2 bg-white rounded-full -translate-x-[4.5px] group-hover:scale-150 transition-transform" />
                <div className="font-oswald text-sm font-bold text-gray-500 tracking-widest uppercase w-20 shrink-0 pt-1">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight mb-6">
            Join the Movement
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Be part of the MicsApparel community. Follow us for new drops and exclusive updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
            >
              Follow on Facebook
            </a>
            <Link
              href="/products"
              className="px-8 py-4 border border-black/20 text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-black/5 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
