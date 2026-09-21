import { business, products } from "@/data/business";
import type { Metadata } from "next";
import ProductImage from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "Products",
  description: `Shop ${business.name} collection of premium streetwear caps, hats, and accessories. Starting at ₱250.`,
};

export default function Products() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4a574] rounded-full blur-[128px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
            Shop Now
          </span>
          <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 mb-6">
            Our <span className="text-gradient">Products</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover premium streetwear designed for the bold. Quality caps and hats starting at just ₱250.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-white/5 hover:border-[#e94560]/30 transition-all hover-glow"
              >
                <div className="aspect-square relative overflow-hidden">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full"
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#e94560] text-white text-xs font-oswald font-semibold rounded-full z-10">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                    <a
                      href={business.social.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#e94560] text-white font-oswald font-semibold rounded-full hover:bg-[#ff6b81] transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      Inquire Now
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#e94560] text-sm font-oswald mb-1">{product.category}</p>
                  <h3 className="font-oswald text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{product.description}</p>

                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-2 font-oswald uppercase tracking-wider">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-oswald text-2xl font-bold text-white">
                      {product.currency}{product.price}
                    </span>
                    <a
                      href={business.social.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#e94560]/10 text-[#e94560] text-sm font-semibold rounded-full hover:bg-[#e94560] hover:text-white transition-all"
                    >
                      Order via Messenger
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#e94560] font-oswald text-sm tracking-widest uppercase">
            Special Orders
          </span>
          <h2 className="font-oswald text-4xl sm:text-5xl font-bold mt-4 mb-6">
            Bulk & Custom Orders
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Looking for custom caps for your team, event, or business?
            We offer special pricing for bulk orders and custom designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-[#e94560]/30 transition-all hover:scale-105"
            >
              Request a Quote
            </a>
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="px-8 py-4 border-2 border-white/20 text-white font-oswald text-lg font-semibold rounded-full hover:bg-white/5 transition-all"
            >
              Call {business.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
