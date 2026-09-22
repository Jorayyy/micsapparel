"use client";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { messengerUrl, productInquiryText } from "@/lib/messenger";
import { formatPeso } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";

interface ProductPurchaseProps {
  product: Product;
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [recent, setRecent] = useState<Product[]>([]);

  const available =
    product.status === "active" && (product.stock === null || product.stock > 0);

  const variantGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    product.variants.forEach((variant) => {
      if (!groups.has(variant.name)) groups.set(variant.name, new Set());
      groups.get(variant.name)?.add(variant.value);
    });
    return Array.from(groups.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product.variants]);

  const activeVariant = useMemo(() => {
    if (!variantGroups.length) return null;
    const complete = variantGroups.every((group) => selected[group.name]);
    if (!complete) return null;
    return (
      product.variants.find((variant) =>
        variantGroups.every((group) => selected[group.name] === variant.value)
      ) ?? null
    );
  }, [product.variants, variantGroups, selected]);

  const needsSelection = variantGroups.length > 0 && !activeVariant;
  const price = activeVariant?.price ?? product.price;
  const canAdd = available && !needsSelection;

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem("micsapparel-recent-v1");
        if (!raw) return;
        const parsed = JSON.parse(raw) as Product[];
        if (!Array.isArray(parsed)) return;
        setRecent(
          parsed.filter((p) => p.slug !== product.slug).slice(0, 4)
        );
      } catch {
        // ignore
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("micsapparel-recent-v1");
      const parsed: Product[] = raw ? JSON.parse(raw) : [];
      const next = [
        product,
        ...parsed.filter((p) => p.slug !== product.slug),
      ].slice(0, 8);
      localStorage.setItem("micsapparel-recent-v1", JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [product]);

  function handleAdd() {
    if (!canAdd) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price,
        image: product.images[0] ?? "",
        variantId: activeVariant?.id ?? null,
        variantLabel: activeVariant
          ? `${activeVariant.name}: ${activeVariant.value}`
          : null,
      },
      qty
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] text-neutral-500 tracking-[0.25em] uppercase mb-2">
          {product.category}
        </p>
        <h1 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <span className="font-oswald text-3xl font-bold">{formatPeso(price)}</span>
          {product.compareAtPrice && product.compareAtPrice > price && (
            <span className="text-neutral-400 line-through">
              {formatPeso(product.compareAtPrice)}
            </span>
          )}
          {product.badge && (
            <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <p className="text-neutral-600 leading-relaxed">{product.description}</p>

      {product.features.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="mt-1.5 w-1.5 h-1.5 bg-black shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {variantGroups.map((group) => (
        <div key={group.name}>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
            {group.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = selected[group.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSelected((current) => ({ ...current, [group.name]: value }))
                  }
                  className={`px-4 py-2.5 border text-sm transition-colors ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:border-black"
                  }`}
                  aria-pressed={active}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-neutral-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-12 hover:bg-neutral-50 transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="w-11 h-12 hover:bg-neutral-50 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <span className="text-sm text-neutral-500">
          {!available
            ? "Sold out"
            : product.stock !== null && product.stock <= product.lowStockAt
              ? `Only ${product.stock} left`
              : "In stock"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {needsSelection ? `Select ${variantGroups[0]?.name}` : "Add to Cart"}
        </button>
        <a
          href={messengerUrl(
            "https://m.me/profile.php?id=61575002625239",
            productInquiryText(product)
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 border border-neutral-300 text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
        >
          Ask via Messenger
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6 text-center">
        {[
          { label: "Nationwide Shipping", hint: "PH delivery" },
          { label: "GCash / Maya", hint: "Also COD" },
          { label: "7-Day Returns", hint: "Unused items" },
        ].map((item) => (
          <div key={item.label}>
            <p className="font-oswald text-[11px] font-bold uppercase tracking-wider">
              {item.label}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">{item.hint}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="pt-6 border-t border-neutral-200">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
            Recently Viewed
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recent.map((item) => (
              <a
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group block bg-neutral-100 p-3 hover:bg-neutral-200 transition-colors"
              >
                <p className="font-oswald text-xs font-semibold uppercase truncate">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formatPeso(item.price)}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
