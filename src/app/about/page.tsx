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
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Our Story
          </span>
          <h1 className="font-oswald text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-tight">
            About
            <br />
            MicsApparel
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block">
                The Beginning
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
                A Vision Born
                <br />
                in Tacloban
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  MicsApparel was founded in April 2024 with a simple yet powerful vision:
                  to bring premium streetwear fashion to Tacloban City and the Philippines.
                  What started as a passion project has grown into a beloved brand with over
                  408 followers and a 100% recommendation rate.
                </p>
                <p>
                  Founded by Micko Badilla, MicsApparel represents more than just clothing —
                  it embodies a lifestyle of faith, determination, and authentic Filipino style.
                </p>
                <p className="text-white italic text-lg font-medium border-l-2 border-white pl-6">
                  &ldquo;WHEN THE TIME IS RIGHT, I. THE LORD WILL MAKE IT HAPPEN. ISAIAH 60:22&rdquo;
                </p>
                <p>
                  From humble beginnings in Tacloban City, we&apos;ve grown to serve customers
                  across the Philippines, delivering quality streetwear that speaks to the
                  bold, the faithful, and the fashion-forward.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] bg-[#111]">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={business.logo}
                  alt="MicsApparel"
                  className="w-40 h-40 rounded-full object-cover opacity-60"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <p className="font-oswald text-3xl font-bold uppercase">Micko Badilla</p>
                <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">
                  CEO & Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
              Values
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              {
                num: "01",
                title: "Faith-Driven",
                desc: "Every design, every stitch is infused with purpose. Our faith guides our journey.",
              },
              {
                num: "02",
                title: "Quality First",
                desc: "Premium materials and meticulous craftsmanship define every product.",
              },
              {
                num: "03",
                title: "Authenticity",
                desc: "Real streetwear for real people. No pretense, no shortcuts.",
              },
              {
                num: "04",
                title: "Community",
                desc: "We're more than a brand — we're a family. Building connections.",
              },
              {
                num: "05",
                title: "Affordability",
                desc: "Premium fashion should be accessible. Quality at fair prices.",
              },
              {
                num: "06",
                title: "Heritage",
                desc: "Proudly Filipino, born in Tacloban. Celebrating our roots.",
              },
            ].map((value) => (
              <div key={value.num} className="p-10 bg-black group hover:bg-[#0a0a0a] transition-colors">
                <span className="font-oswald text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                  {value.num}
                </span>
                <h3 className="font-oswald text-xl font-bold uppercase mt-6 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
              Journey
            </span>
            <h2 className="font-oswald text-5xl font-bold uppercase tracking-tight">
              Milestones
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                date: "April 2024",
                title: "Founded",
                desc: "MicsApparel is born in Tacloban City with a vision to bring premium streetwear to the Philippines.",
              },
              {
                date: "2024",
                title: "First Collection",
                desc: "Launch of our debut cap collection featuring Close Cap, Net Cap, and Tracker Cap.",
              },
              {
                date: "2025",
                title: "Growing Community",
                desc: "Surpass 400+ followers with a 100% customer recommendation rate.",
              },
              {
                date: "Present",
                title: "Expanding",
                desc: "Serving customers nationwide with plans for new designs and collections.",
              },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-8 items-start py-8 border-t border-white/5">
                <span className="font-oswald text-sm text-gray-500 tracking-widest uppercase w-32 flex-shrink-0 pt-1">
                  {milestone.date}
                </span>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
