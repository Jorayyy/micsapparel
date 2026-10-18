import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse MicsApparel caps, hats, and streetwear accessories. Premium quality from Tacloban City, Philippines.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6">
          <h1 className="text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500">
            Shop
          </h1>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-neutral-400">Loading products…</div>}>
        <ShopBrowser products={products} />
      </Suspense>
    </>
  );
}
