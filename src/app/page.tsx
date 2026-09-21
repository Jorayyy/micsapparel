"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";
import ProductImage from "@/components/ProductImage";

export default function Home() {
  const { business, products, testimonials } = useContent();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-100 -rotate-45 translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-160px)]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 text-xs tracking-[0.3em] uppercase rounded">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse" />
                Est. {business.founded} — Tacloban City
              </div>

              <h1 className="font-oswald text-[clamp(4rem,10vw,8rem)] font-bold leading-[0.9] tracking-tight uppercase text-gray-900">
                <span className="block">Mics</span>
                <span className="block">Apparel</span>
              </h1>

              <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                Premium streetwear from the heart of Tacloban City. Bold designs.
                Authentic style. Faith-driven.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all rounded"
                >
                  Shop Now
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <a
                  href={business.social.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-gray-300 text-gray-700 font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all rounded"
                >
                  Message Us
                </a>
              </div>

              <div className="flex items-center gap-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="font-oswald text-3xl font-bold text-gray-900">
                    {business.stats.followers}
                  </div>
                  <div className="text-[11px] text-gray-400 tracking-widest uppercase mt-1">
                    Followers
                  </div>
                </div>
                <div>
                  <div className="font-oswald text-3xl font-bold text-gray-900">
                    {business.stats.rating}
                  </div>
                  <div className="text-[11px] text-gray-400 tracking-widest uppercase mt-1">
                    Recommended
                  </div>
                </div>
                <div>
                  <div className="font-oswald text-3xl font-bold text-gray-900">
                    ₱250+
                  </div>
                  <div className="text-[11px] text-gray-400 tracking-widest uppercase mt-1">
                    Starting Price
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-[500px] h-[500px]">
                {/* Rotating ring */}
                <div className="absolute inset-0 border border-gray-200 rounded-full animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-8 border border-gray-100 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img
                      src={business.logo}
                      alt="MicsApparel"
                      className="w-48 h-48 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=400";
                      }}
                    />
                  </div>
                </div>

                {/* Floating tags */}
                <div className="absolute top-10 right-0 px-4 py-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded">
                  New Drop
                </div>
                <div className="absolute bottom-20 left-0 px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase rounded">
                  Premium Quality
                </div>
                <div className="absolute top-1/2 -right-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded">
                  ₱300
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* Marquee */}
      <div className="py-6 border-y border-gray-200 overflow-hidden bg-white">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="font-oswald text-6xl font-bold text-gray-100 uppercase tracking-wider mx-8">
              MicsApparel — Premium Streetwear — Tacloban City — Since 2024 —{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
                Collection
              </span>
              <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gray-900">
                Featured
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 tracking-widest uppercase transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href="/products"
                className="group relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg"
              >
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white text-gray-900 text-[10px] font-bold tracking-widest uppercase rounded">
                    {product.badge}
                  </div>
                )}

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[11px] text-gray-300 tracking-widest uppercase mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-oswald text-xl font-bold uppercase text-white">{product.name}</h3>
                  <p className="font-oswald text-lg text-white mt-1">
                    {product.currency}{product.price}
                  </p>
                </div>

                {/* Price tag */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded">
                  {product.currency}{product.price}
                </div>
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-oswald text-sm font-bold tracking-widest uppercase rounded"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block">
                About Us
              </span>
              <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95] text-gray-900">
                Born in
                <br />
                Tacloban
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-lg">
                {business.description}
              </p>
              <p className="text-gray-400 italic text-lg">
                &ldquo;{business.motto}&rdquo;
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-sm text-gray-900 tracking-widest uppercase group"
              >
                <span className="w-12 h-[1px] bg-gray-900 group-hover:w-16 transition-all" />
                Learn More
              </Link>
            </div>

            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={business.logo}
                  alt="MicsApparel"
                  className="w-48 h-48 rounded-full object-cover opacity-60"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=400";
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white to-transparent">
                <p className="font-oswald text-4xl font-bold uppercase text-gray-900">MicsApparel</p>
                <p className="text-gray-500 text-sm tracking-widest uppercase mt-2">
                  Est. {business.founded}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
              Why Us
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gray-900">
              Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Quality",
                desc: "Premium fabrics and meticulous craftsmanship in every piece.",
              },
              {
                num: "02",
                title: "Affordable",
                desc: "High-end streetwear that doesn't break the bank. Starting at ₱250.",
              },
              {
                num: "03",
                title: "Faith",
                desc: "Driven by purpose and faith. Every design carries meaning.",
              },
              {
                num: "04",
                title: "Filipino",
                desc: "Proudly made in Tacloban City. Supporting local talent.",
              },
            ].map((item) => (
              <div key={item.num} className="p-8 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm transition-all border border-gray-100">
                <span className="font-oswald text-5xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                  {item.num}
                </span>
                <h3 className="font-oswald text-2xl font-bold uppercase mt-6 mb-4 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
              Reviews
            </span>
            <h2 className="font-oswald text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gray-900">
              What They Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-8 bg-white rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-oswald font-bold text-xs rounded">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-xs">{testimonial.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-oswald text-6xl lg:text-8xl font-bold text-white uppercase tracking-tight mb-8">
            Get Yours
            <br />
            Now
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Join {business.stats.followers} followers. Premium streetwear from Tacloban City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-gray-900 font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors rounded"
            >
              Order via Messenger
            </a>
            <a
              href={business.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border border-white/20 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-colors rounded"
            >
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
