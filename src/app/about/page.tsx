import { business } from "@/data/business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${business.name} - ${business.shortDescription}`,
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#e94560] rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
            Our Story
          </span>
          <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 mb-6">
            About <span className="text-gradient">MicsApparel</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Born from faith, built with passion. Discover the story behind Tacloban City&apos;s premium streetwear brand.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
                The Beginning
              </span>
              <h2 className="font-oswald text-4xl font-bold mt-4 mb-6">
                A Vision Born in <span className="text-gradient">Tacloban City</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  MicsApparel was founded in April 2024 with a simple yet powerful vision:
                  to bring premium streetwear fashion to Tacloban City and the Philippines.
                  What started as a passion project has grown into a beloved brand with over
                  408 followers and a 100% recommendation rate.
                </p>
                <p>
                  Founded by Micko Badilla, MicsApparel represents more than just clothing —
                  it embodies a lifestyle of faith, determination, and authentic Filipino style.
                  Our motto, inspired by Isaiah 60:22, drives everything we do:
                </p>
                <p className="text-[#e94560] italic text-lg font-medium">
                  &ldquo;WHEN THE TIME IS RIGHT, I. THE LORD WILL MAKE IT HAPPEN.&rdquo;
                </p>
                <p>
                  From humble beginnings in Tacloban City, we&apos;ve grown to serve customers
                  across the Philippines, delivering quality streetwear that speaks to the
                  bold, the faithful, and the fashion-forward.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-8 border-glow">
                <div className="w-full h-full rounded-2xl bg-[#0a0a0f] flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center font-oswald text-5xl font-bold text-white mb-6 shadow-2xl shadow-[#e94560]/30">
                      MA
                    </div>
                    <p className="font-oswald text-2xl font-bold text-white">MICKO BADILLA</p>
                    <p className="text-[#e94560] font-oswald mt-2">CEO & Founder</p>
                    <p className="text-gray-400 text-sm mt-4">Est. {business.founded}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#d4a574] rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
              Our Values
            </span>
            <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Faith-Driven",
                desc: "Every design, every stitch is infused with purpose. Our faith guides our journey and inspires our craft.",
                icon: "♥",
              },
              {
                title: "Quality First",
                desc: "We never compromise on quality. Premium materials and meticulous craftsmanship define every MicsApparel product.",
                icon: "★",
              },
              {
                title: "Authenticity",
                desc: "Real streetwear for real people. No pretense, no shortcuts — just genuine style that speaks for itself.",
                icon: "✦",
              },
              {
                title: "Community",
                desc: "We're more than a brand — we're a family. Building connections and uplifting the Filipino streetwear community.",
                icon: "◈",
              },
              {
                title: "Affordability",
                desc: "Premium fashion should be accessible. We offer high-quality streetwear at prices that don't break the bank.",
                icon: "₱",
              },
              {
                title: "Pride in Heritage",
                desc: "Proudly Filipino, born in Tacloban City. We celebrate our roots and showcase Filipino talent to the world.",
                icon: "★",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-[#e94560]/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#e94560]/10 flex items-center justify-center text-xl text-[#e94560] mb-6 group-hover:bg-[#e94560] group-hover:text-white transition-all">
                  {value.icon}
                </div>
                <h3 className="font-oswald text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
              Our Journey
            </span>
            <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4">
              Milestones
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                date: "April 2024",
                title: "Founded",
                desc: "MicsApparel is born in Tacloban City with a vision to bring premium streetwear to the Philippines.",
              },
              {
                date: "2024",
                title: "First Collection Launch",
                desc: "Launch of our debut cap collection featuring Close Cap, Net Cap, and Tracker Cap designs.",
              },
              {
                date: "2025",
                title: "Growing Community",
                desc: "Surpass 400+ followers with a 100% customer recommendation rate. Expanding product line.",
              },
              {
                date: "Present",
                title: "Expanding Horizons",
                desc: "Serving customers nationwide across the Philippines with plans for new designs and collections.",
              },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#e94560] shadow-lg shadow-[#e94560]/30" />
                  {index < 3 && <div className="w-0.5 h-16 bg-white/10 mt-2" />}
                </div>
                <div className="pb-8">
                  <span className="text-[#e94560] font-oswald text-sm tracking-wider">
                    {milestone.date}
                  </span>
                  <h3 className="font-oswald text-2xl font-bold text-white mt-1">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-400 mt-2 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
