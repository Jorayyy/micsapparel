import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
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
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500">
            Collections
          </h1>
          <Link
            href="/products"
            className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors"
          >
            All products
          </Link>
        </div>

        <div className="space-y-14">
          {categories.map((category) => {
            const items = products.filter((p) => p.category === category.slug);
            return (
              <div key={category.id}>
                <div className="flex items-baseline justify-between gap-4 mb-5 pb-4 border-b border-neutral-200">
                  <h2 className="text-sm font-medium tracking-[0.2em] uppercase">
                    {category.name}
                  </h2>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-[11px] tracking-[0.15em] uppercase text-neutral-400 hover:text-black transition-colors"
                  >
                    View all ({items.length})
                  </Link>
                </div>

                {items.length === 0 ? (
                  <p className="text-neutral-400 text-sm py-4">
                    New pieces are on the way. Check back soon.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
                    {items.slice(0, 5).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
                No collections yet
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
