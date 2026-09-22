"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 12;

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name" },
];

interface ShopBrowserProps {
  products: Product[];
  categories: Category[];
}

export default function ShopBrowser({ products, categories }: ShopBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as SortKey) || "featured";
  const maxPrice = Number(searchParams.get("max") || 0);

  const [search, setSearch] = useState(query);
  const [limit, setLimit] = useState(PAGE_SIZE);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    setLimit(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (maxPrice > 0) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
        );
    }

    return list;
  }, [products, activeCategory, query, sort, maxPrice]);

  const visible = filtered.slice(0, limit);

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur border-y border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 py-3">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
              {[{ slug: "all", name: "All" }, ...categories].map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => updateParams({ category: cat.slug === "all" ? null : cat.slug })}
                  className={`px-4 py-2 text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <form
                className="flex-1 lg:w-56"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateParams({ q: search.trim() || null });
                }}
              >
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </form>

              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value === "featured" ? null : e.target.value })}
                aria-label="Sort products"
                className="px-3 py-2 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-black"
              >
                {SORTS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={maxPrice || ""}
                onChange={(e) => updateParams({ max: e.target.value || null })}
                aria-label="Maximum price"
                className="px-3 py-2 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-black"
              >
                <option value="">Any price</option>
                <option value="300">Under ₱300</option>
                <option value="350">Under ₱350</option>
                <option value="500">Under ₱500</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-neutral-500 text-sm">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {query ? ` for “${query}”` : ""}
            </p>
            {(activeCategory !== "all" || query || maxPrice > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  router.replace("/products", { scroll: false });
                  setLimit(PAGE_SIZE);
                }}
                className="text-xs tracking-[0.15em] uppercase text-neutral-500 hover:text-black transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center border border-neutral-200">
              <p className="font-oswald text-3xl font-bold text-neutral-300 uppercase mb-4">
                No products found
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  router.replace("/products", { scroll: false });
                }}
                className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          )}

          {filtered.length > visible.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setLimit((value) => value + PAGE_SIZE)}
                className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
              >
                Load More ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
