"use client";

import { useState } from "react";
import Link from "next/link";
import { useContent } from "@/lib/content-context";
import ProductImage from "@/components/ProductImage";

const categories = ["All", "Caps", "Snapbacks", "Dad Caps", "Bucket Hats"];

export default function Products() {
  const { products } = useContent();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Shop
          </span>
          <h1 className="font-oswald text-6xl lg:text-8xl font-bold uppercase tracking-tight">
            Products
          </h1>
          <p className="text-gray-400 mt-6 max-w-lg">
            Premium streetwear crafted in Tacloban City. Each piece is designed with
            purpose and built to last.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[13px] font-medium tracking-widest uppercase whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <p className="text-gray-600 text-sm">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-[#0a0a0a]"
              >
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

                  {/* Price */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white text-black text-xs font-bold">
                    {product.currency}{product.price}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[11px] text-gray-400 tracking-widest uppercase mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-oswald text-xl font-bold uppercase">
                      {product.name}
                    </h3>
                    <a
                      href={`https://m.me/61575002625239?text=${encodeURIComponent(`Hi! I'm interested in the ${product.name}. Is it still available?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
                    >
                      Inquire
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32">
              <p className="font-oswald text-4xl font-bold text-white/10 uppercase">
                No products found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <span className="text-[11px] text-gray-500 tracking-[0.3em] uppercase block mb-4">
            Custom Orders
          </span>
          <h2 className="font-oswald text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight mb-6">
            Bulk Orders Available
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Need custom designs or bulk quantities? We offer special pricing for teams,
            organizations, and resellers.
          </p>
          <a
            href="https://m.me/61575002625239?text=Hi! I'm interested in bulk ordering."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            Contact for Bulk Orders
          </a>
        </div>
      </section>
    </>
  );
}
