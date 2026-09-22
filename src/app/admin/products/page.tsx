"use client";

import { useEffect, useState } from "react";
import { imageUrlHint, isValidImageUrl } from "@/lib/images";
import type { Category, Product, ProductVariant, ProductStatus } from "@/lib/types";

const EMPTY: Product = {
  id: "",
  slug: "",
  name: "",
  price: 0,
  compareAtPrice: null,
  description: "",
  features: [],
  category: "caps",
  images: [],
  sku: null,
  status: "active",
  featured: false,
  isNew: false,
  badge: null,
  stock: null,
  lowStockAt: 5,
  variants: [],
  createdAt: "",
  updatedAt: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }
    } catch {
      setError("Failed to load products");
    }
    setLoading(false);
  }

  useEffect(() => {
    Promise.all([fetch("/api/admin/products"), fetch("/api/admin/categories")])
      .then(([productsRes, categoriesRes]) =>
        Promise.all([
          productsRes.ok ? productsRes.json() : null,
          categoriesRes.ok ? categoriesRes.json() : null,
        ]).then(([productsData, categoriesData]) => {
          if (productsData) setProducts(productsData.products || []);
          if (categoriesData) setCategories(categoriesData.categories || []);
          setLoading(false);
        })
      )
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  function flash(msg: string, isError = false) {
    setError(isError ? msg : "");
    setMessage(isError ? "" : msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);
  }

  async function handleSave(product: Product) {
    setError("");
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        compareAtPrice:
          product.compareAtPrice === null || product.compareAtPrice === undefined
            ? null
            : Number(product.compareAtPrice),
        stock: product.stock === null || product.stock === undefined ? null : Number(product.stock),
        lowStockAt: Number(product.lowStockAt) || 5,
        features: product.features.filter(Boolean),
        images: product.images.filter(Boolean),
        variants: product.variants.filter((v) => v.name && v.value),
      };

      const badImage = payload.images.find((url) => !isValidImageUrl(url));
      if (badImage) {
        flash(`Invalid image URL "${badImage}". ${imageUrlHint}`, true);
        return;
      }

      const res = await fetch("/api/admin/products", {
        method: product.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Failed to save", true);
        return;
      }
      setEditing(null);
      setIsNew(false);
      flash("Product saved.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        flash("Failed to delete", true);
        return;
      }
      flash("Product deleted.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">
            Products
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">Manage your product catalog</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing({ ...EMPTY, id: "" });
            setIsNew(true);
          }}
          className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {message && (
        <div className="mb-5 px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <ProductEditor
          product={editing}
          categories={categories}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null);
            setIsNew(false);
          }}
        />
      ) : loading ? (
        <p className="text-neutral-400 text-sm py-10">Loading…</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-neutral-200 p-5">
              <div className="flex flex-wrap items-center gap-5">
                <div className="w-16 h-16 bg-neutral-100 shrink-0 overflow-hidden">
                  {product.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-[160px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-oswald text-lg font-bold uppercase">
                      {product.name}
                    </h3>
                    <StatusPill status={product.status} />
                    {product.featured && <Tag>Featured</Tag>}
                    {product.isNew && <Tag>New</Tag>}
                  </div>
                  <p className="text-neutral-500 text-sm mt-1">
                    ₱{product.price} · {product.category} ·{" "}
                    {product.stock === null ? "Stock not tracked" : `${product.stock} in stock`}
                  </p>
                  <p className="text-neutral-400 text-xs mt-0.5">/{product.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(product);
                      setIsNew(false);
                    }}
                    className="px-4 py-2 text-xs border border-neutral-300 hover:bg-neutral-50 transition-all tracking-widest uppercase"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 text-xs text-red-600 border border-red-200 hover:bg-red-50 transition-all tracking-widest uppercase"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="py-16 bg-white border border-neutral-200 text-center">
              <p className="font-oswald text-2xl font-bold text-neutral-300 uppercase">
                No products yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: ProductStatus }) {
  const styles: Record<ProductStatus, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
  };
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
      {children}
    </span>
  );
}

function ProductEditor({
  product,
  categories,
  isNew,
  onSave,
  onCancel,
}: {
  product: Product;
  categories: Category[];
  isNew: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Product>({ ...product });
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.media?.url) {
        setForm((current) => ({ ...current, images: [...current.images, data.media.url] }));
      }
    } finally {
      setUploading(false);
    }
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: "",
          value: "",
          price: null,
          stock: null,
          sku: null,
        },
      ],
    }));
  }

  function updateVariant(id: string, patch: Partial<ProductVariant>) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  }

  return (
    <div className="bg-white border border-neutral-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-oswald text-xl font-bold uppercase tracking-wide">
          {isNew ? "New Product" : `Edit: ${product.name}`}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs tracking-widest uppercase text-neutral-500 hover:text-black"
        >
          Cancel
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-from-name"
            className={inputCls}
          />
        </Field>
        <Field label="Price (₱)">
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Compare-at price (₱, optional)">
          <input
            type="number"
            min={0}
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              set("compareAtPrice", e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as ProductStatus)}
            className={inputCls}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Stock (leave blank = not tracked)">
          <input
            type="number"
            min={0}
            value={form.stock ?? ""}
            onChange={(e) =>
              set("stock", e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Low stock alert at">
          <input
            type="number"
            min={0}
            value={form.lowStockAt}
            onChange={(e) => set("lowStockAt", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Badge (optional)">
          <input
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value || null)}
            placeholder="New, Best Seller…"
            className={inputCls}
          />
        </Field>
        <Field label="SKU (optional)">
          <input
            value={form.sku ?? ""}
            onChange={(e) => set("sku", e.target.value || null)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => set("isNew", e.target.checked)}
          />
          New arrival
        </label>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div>
        <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
          Features
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.features.map((feature, index) => (
            <span
              key={`${feature}-${index}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-xs"
            >
              {feature}
              <button
                type="button"
                onClick={() =>
                  set(
                    "features",
                    form.features.filter((_, i) => i !== index)
                  )
                }
                className="text-neutral-400 hover:text-black"
                aria-label={`Remove ${feature}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Add a feature"
            className={`${inputCls} flex-1`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (featureInput.trim()) {
                  set("features", [...form.features, featureInput.trim()]);
                  setFeatureInput("");
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (featureInput.trim()) {
                set("features", [...form.features, featureInput.trim()]);
                setFeatureInput("");
              }
            }}
            className="px-4 border border-neutral-300 text-xs tracking-widest uppercase hover:bg-neutral-50"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
          Images
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3">
          {form.images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative group aspect-square bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  set(
                    "images",
                    form.images.filter((_, i) => i !== index)
                  )
                }
                className="absolute top-1 right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Paste image URL"
            className={`${inputCls} flex-1 min-w-[200px]`}
          />
          <button
            type="button"
            onClick={() => {
              const url = imageInput.trim();
              if (!url) return;
              if (!isValidImageUrl(url)) {
                setImageError(imageUrlHint);
                return;
              }
              setImageError("");
              set("images", [...form.images, url]);
              setImageInput("");
            }}
            className="px-4 border border-neutral-300 text-xs tracking-widest uppercase hover:bg-neutral-50"
          >
            Add URL
          </button>
          <label className="px-4 py-3 border border-neutral-300 text-xs tracking-widest uppercase hover:bg-neutral-50 cursor-pointer">
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {imageError && (
          <p className="mt-2 text-xs text-red-600">{imageError}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase">
            Variants (optional)
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs tracking-widest uppercase text-neutral-500 hover:text-black"
          >
            + Add variant
          </button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-neutral-400 text-sm">
            No variants. Leave empty for single-SKU products.
          </p>
        ) : (
          <div className="space-y-2">
            {form.variants.map((variant) => (
              <div key={variant.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                <Field label="Name">
                  <input
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                    placeholder="Color"
                    className={inputCls}
                  />
                </Field>
                <Field label="Value">
                  <input
                    value={variant.value}
                    onChange={(e) => updateVariant(variant.id, { value: e.target.value })}
                    placeholder="Black"
                    className={inputCls}
                  />
                </Field>
                <Field label="Price override">
                  <input
                    type="number"
                    value={variant.price ?? ""}
                    onChange={(e) =>
                      updateVariant(variant.id, {
                        price: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    value={variant.stock ?? ""}
                    onChange={(e) =>
                      updateVariant(variant.id, {
                        stock: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className={inputCls}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "variants",
                      form.variants.filter((v) => v.id !== variant.id)
                    )
                  }
                  className="h-[46px] px-3 text-xs text-red-600 border border-red-200 hover:bg-red-50 uppercase tracking-widest"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-200 flex gap-3">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="px-7 py-3.5 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          Save Product
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-7 py-3.5 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
