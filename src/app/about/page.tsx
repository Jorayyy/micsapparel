"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function About() {
  const { business } = useContent();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
            About
          </span>
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase tracking-tight text-gray-900">
            Our Story
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block">
                The Beginning
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95] text-gray-900">
                {business.founded}
                <br />
                Tacloban City
              </h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                {business.description}
              </p>
            </div>

            <div className="space-y-8">
              <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block">
                Our Purpose
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95] text-gray-900">
                Faith &{" "}
                <span className="text-gray-400">Fashion</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {business.mission}
              </p>
              <p className="text-gray-400 italic text-lg border-l-2 border-gray-200 pl-6">
                &ldquo;{business.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
              Values
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gray-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.values.map((value, i) => (
              <div key={i} className="p-8 bg-white rounded-lg border border-gray-200 group hover:shadow-sm transition-all">
                <span className="font-oswald text-5xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                  0{i + 1}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase mt-6 mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
              Journey
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gray-900">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {business.milestones.map((milestone, i) => (
              <div
                key={i}
                className="flex gap-8 pb-12 border-l border-gray-200 pl-8 relative group"
              >
                <div className="absolute left-0 top-0 w-2 h-2 bg-gray-900 rounded-full -translate-x-[4.5px] group-hover:scale-150 transition-transform" />
                <div className="font-oswald text-sm font-bold text-gray-400 tracking-widest uppercase w-20 shrink-0 pt-1">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-2 text-gray-900">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-tight mb-6">
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
              className="px-8 py-4 bg-gray-900 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors rounded"
            >
              Follow on Facebook
            </a>
            <Link
              href="/products"
              className="px-8 py-4 border border-gray-300 text-gray-700 font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors rounded"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
