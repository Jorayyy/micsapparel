import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore MicsApparel collections — caps, hats, and streetwear accessories from Tacloban City.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Collections
          </span>
          <h1 className="font-oswald text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            Shop the Lineup
          </h1>
          <p className="text-neutral-500 mt-5 max-w-lg">
            Browse every MicsApparel category. Small-batch drops, built in Tacloban City.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
          {categories.map((category, index) => {
            const items = products.filter((p) => p.category === category.slug);
            return (
              <Reveal key={category.id} delay={index * 60}>
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-7 pb-5 border-b border-neutral-200">
                    <div>
                      <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-2">
                        Collection 0{index + 1}
                      </span>
                      <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-neutral-500 text-sm mt-2 max-w-lg">
                        {category.description}
                      </p>
                    </div>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-sm tracking-widest uppercase text-neutral-500 hover:text-black transition-colors"
                    >
                      View All ({items.length})
                    </Link>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-neutral-400 text-sm py-6">
                      New pieces are on the way. Check back soon.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {items.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}

          {categories.length === 0 && (
            <div className="py-20 text-center border border-neutral-200">
              <p className="font-oswald text-2xl font-bold text-neutral-300 uppercase">
                No collections yet
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
