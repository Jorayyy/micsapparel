import Link from "next/link";
import { business, products, testimonials } from "@/data/business";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#e94560] rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4a574] rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center font-oswald text-5xl font-bold text-white mb-8 shadow-2xl shadow-[#e94560]/30">
              MA
            </div>
          </div>

          <h1 className="font-oswald text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-white">MICS</span>
            <span className="text-gradient">APPAREL</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-light">
            {business.tagline}
          </p>

          <p className="text-[#e94560] italic mb-10 text-lg">
            &ldquo;{business.motto}&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-[#e94560]/30 transition-all hover:scale-105"
            >
              Shop Now
            </Link>
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white/20 text-white font-oswald text-lg font-semibold rounded-full hover:bg-white/5 transition-all"
            >
              Message Us
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-oswald font-bold text-[#e94560]">
                {business.stats.followers}
              </div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-oswald font-bold text-[#e94560]">
                {business.stats.rating}
              </div>
              <div className="text-sm text-gray-400">Recommended</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-oswald font-bold text-[#e94560]">
                {business.stats.reviewCount}
              </div>
              <div className="text-sm text-gray-400">Reviews</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
                About Us
              </span>
              <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Born in <span className="text-gradient">Tacloban City</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                {business.description}
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Founded by {business.owner.name}, MicsApparel represents the spirit of
                Filipino streetwear — bold, authentic, and driven by faith.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#e94560] font-oswald font-semibold hover:gap-4 transition-all"
              >
                Learn More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-8 border-glow">
                <div className="w-full h-full rounded-2xl bg-[#0a0a0f] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center font-oswald text-6xl font-bold text-white mb-6">
                      MA
                    </div>
                    <p className="font-oswald text-2xl font-bold text-white">MICSAPPAREL</p>
                    <p className="text-gray-400 mt-2">Est. {business.founded}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#e94560] rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
              Our Collection
            </span>
            <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4">
              Featured Products
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-white/5 hover:border-[#e94560]/30 transition-all hover-glow"
              >
                <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center relative overflow-hidden">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e94560]/20 to-[#d4a574]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="font-oswald text-4xl font-bold text-white/50">MA</span>
                  </div>
                  {product.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#e94560] text-white text-xs font-oswald font-semibold rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[#e94560] text-sm font-oswald mb-1">{product.category}</p>
                  <h3 className="font-oswald text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-oswald text-2xl font-bold text-white">
                      {product.currency}{product.price}
                    </span>
                    <a
                      href={business.social.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#e94560]/10 text-[#e94560] text-sm font-semibold rounded-full hover:bg-[#e94560] hover:text-white transition-all"
                    >
                      Inquire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#e94560] text-[#e94560] font-oswald font-semibold rounded-full hover:bg-[#e94560] hover:text-white transition-all"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
              Why MicsApparel
            </span>
            <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Quality Materials",
                desc: "Every product is crafted with premium fabrics and attention to detail for lasting comfort.",
                icon: "★",
              },
              {
                title: "Affordable Prices",
                desc: "Premium streetwear doesn't have to break the bank. Quality fashion starting at just ₱250.",
                icon: "₱",
              },
              {
                title: "Faith-Driven",
                desc: "Founded on faith and purpose. Every design carries a message of hope and determination.",
                icon: "♥",
              },
              {
                title: "Proudly Filipino",
                desc: "Born and raised in Tacloban City. Supporting local craftsmanship and Filipino talent.",
                icon: "★",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-[#e94560]/30 transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#e94560]/10 flex items-center justify-center text-2xl text-[#e94560] group-hover:bg-[#e94560] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="font-oswald text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-8 rounded-2xl bg-gradient-card border border-white/5 hover:border-[#e94560]/20 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#d4a574]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center text-white font-oswald font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#e94560] to-[#ff6b81]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-oswald text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Level Up Your Style?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Join {business.stats.followers} followers and discover premium streetwear from Tacloban City.
            Message us now and get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-[#e94560] font-oswald text-lg font-semibold rounded-full hover:shadow-lg transition-all hover:scale-105"
            >
              Message Us on Messenger
            </a>
            <a
              href={business.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white text-white font-oswald text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
