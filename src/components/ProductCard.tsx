"use client";

import Link from "next/link";
import { formatPeso } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const image = product.images[0] ?? "";
  const available =
    product.status === "active" && (product.stock === null || product.stock > 0);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-lg bg-neutral-100 overflow-hidden">
        <ProductImage
          src={image}
          alt={product.name}
          className="w-full h-full"
          priority={priority}
        />

        {product.badge && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white text-black text-[10px] font-bold tracking-widest uppercase">
            {product.badge}
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 space-y-0.5">
        <h3 className="text-[11px] font-medium tracking-[0.14em] uppercase text-neutral-900 group-hover:opacity-70 transition-opacity">
          {product.name}
        </h3>
        <p className="text-[11px] tracking-[0.14em] uppercase text-neutral-500">
          {formatPeso(product.price)}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="ml-2 line-through text-neutral-300">
              {formatPeso(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
