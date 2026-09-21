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
      <section className="pt-32 pb-20 bg-black relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Shop
          </span>
          <h1 className="font-oswald text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-tight">
            All Products
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-xl">
            Premium streetwear designed for the bold. Quality caps and hats starting at just ₱250.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{products.length} Products</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 tracking-widest uppercase hidden sm:block">
              Starting at ₱250
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-black"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
                      {product.badge}
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                    <a
                      href={business.social.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                    >
                      Inquire Now
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500 tracking-widest uppercase mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-oswald text-lg font-bold uppercase tracking-wide">
                        {product.name}
                      </h3>
                    </div>
                    <span className="font-oswald text-lg font-bold">
                      {product.currency}{product.price}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] tracking-wider uppercase">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <a
                    href={business.social.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-6 py-3 border border-white/10 text-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:border-white/30 transition-all"
                  >
                    Order via Messenger
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <span className="text-[11px] text-gray-400 tracking-[0.3em] uppercase block mb-4">
            Special Orders
          </span>
          <h2 className="font-oswald text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight mb-6">
            Bulk & Custom
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
            Looking for custom caps for your team, event, or business?
            We offer special pricing for bulk orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={business.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
            >
              Request a Quote
            </a>
            <a
              href={`tel:${business.contact.phoneRaw}`}
              className="px-10 py-5 border border-black/20 text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-black/5 transition-colors"
            >
              Call {business.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
