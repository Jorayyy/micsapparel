import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MicsApparel | Premium Streetwear from Tacloban City",
  description:
    "Shop MicsApparel caps, hats, and streetwear accessories. Premium quality from Tacloban City, Philippines.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const products = await getProducts();

  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <div className="flex items-baseline justify-between mb-6 lg:mb-8">
          <h1 className="text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500">
            All Products
          </h1>
          <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">
            {products.length} items
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
              No products yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 5} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
