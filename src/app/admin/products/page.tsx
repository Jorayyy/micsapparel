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
  const [marked, setMarked] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const markedIds = marked.filter((id) => products.some((p) => p.id === id));

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

  function toggleMark(id: string) {
    setMarked((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  }

  async function handleDeleteMarked() {
    if (markedIds.length === 0) return;
    if (!confirm(`Delete ${markedIds.length} product${markedIds.length !== 1 ? "s" : ""}? This cannot be undone.`)) return;
    try {
      const results = await Promise.all(
        markedIds.map((id) =>
          fetch("/api/admin/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          })
        )
      );
      const failed = results.filter((r) => !r.ok).length;
      setMarked([]);
      flash(failed ? `Failed to delete ${failed} product(s).` : "Marked products deleted.", failed > 0);
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  async function toggleFeatured(product: Product) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, featured: !product.featured }),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Failed to update", true);
        return;
      }
      setProducts((list) => list.map((p) => (p.id === product.id ? data.product : p)));
    } catch {
      flash("Connection error", true);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight">
            Products
          </h1>
          <p className="text-neutral-500 mt-1.5 text-sm">Manage your product catalog</p>
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
        <div className="mb-5 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!editing && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowBulk((v) => !v)}
            className="px-5 py-2.5 border border-neutral-300 text-xs tracking-widest uppercase hover:bg-neutral-50 transition-colors"
          >
            {showBulk ? "Close Bulk Photos" : "Bulk Photos"}
          </button>
        </div>
      )}

      {!editing && showBulk && (
        <BulkPhotos
          categories={categories}
          onDone={() => {
            flash("Products created from photos.");
            load();
          }}
        />
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
          {markedIds.length > 0 && (
            <div className="px-4 py-3 rounded-lg bg-neutral-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-neutral-600">
                  {markedIds.length} selected
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkEdit((v) => !v)}
                    className="px-4 py-2 text-xs rounded-lg bg-black text-white hover:bg-neutral-800 transition-all tracking-widest uppercase"
                  >
                    {showBulkEdit ? "Close bulk edit" : "Bulk edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarked([])}
                    className="px-4 py-2 text-xs border border-neutral-300 rounded-lg hover:bg-white transition-all tracking-widest uppercase"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteMarked}
                    className="px-4 py-2 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all tracking-widest uppercase"
                  >
                    Delete selected ({markedIds.length})
                  </button>
                </div>
              </div>
              {showBulkEdit && (
                <BulkEdit
                  ids={markedIds}
                  categories={categories}
                  onDone={(updated, failed) => {
                    setShowBulkEdit(false);
                    flash(
                      updated > 0
                        ? `Updated ${updated} product${updated === 1 ? "" : "s"}${
                            failed ? `, ${failed} failed` : ""
                          }.`
                        : "No products updated.",
                      updated === 0 || failed > 0
                    );
                    load();
                  }}
                />
              )}
            </div>
          )}
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-neutral-200 rounded-lg p-5">
              <div className="flex flex-wrap items-center gap-5">
                <input
                  type="checkbox"
                  checked={marked.includes(product.id)}
                  onChange={() => toggleMark(product.id)}
                  aria-label={`Select ${product.name}`}
                  className="w-4 h-4 accent-black shrink-0"
                />
                <div className="w-16 h-16 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
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
                    onClick={() => toggleFeatured(product)}
                    className={`px-4 py-2 text-xs border transition-all tracking-widest uppercase ${
                      product.featured
                        ? "border-black bg-black text-white hover:bg-neutral-800"
                        : "border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {product.featured ? "Featured" : "Mark"}
                  </button>
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
            <div className="py-16 bg-white border border-neutral-200 rounded-lg text-center">
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
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black text-white">
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
    <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-100 text-xs"
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
            <div key={`${image}-${index}`} className="relative group aspect-square rounded-md bg-neutral-100 overflow-hidden">
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
                className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors";

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

type BulkPriceAction = "none" | "set" | "increase" | "decrease" | "add" | "subtract";
type BulkTriState = "" | "on" | "off";

function BulkEdit({
  ids,
  categories,
  onDone,
}: {
  ids: string[];
  categories: Category[];
  onDone: (updated: number, failed: number) => void;
}) {
  const [priceAction, setPriceAction] = useState<BulkPriceAction>("none");
  const [priceValue, setPriceValue] = useState("");
  const [compareAction, setCompareAction] = useState<"none" | "set" | "clear">("none");
  const [compareValue, setCompareValue] = useState("");
  const [status, setStatus] = useState<"" | ProductStatus>("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState<BulkTriState>("");
  const [isNew, setIsNew] = useState<BulkTriState>("");
  const [stock, setStock] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function apply() {
    const patch: Record<string, unknown> = {};
    let priceAdjust: { mode: "percent" | "amount"; value: number } | undefined;

    if (priceAction !== "none") {
      const value = Number(priceValue);
      if (priceValue.trim() === "" || !Number.isFinite(value) || value < 0) {
        setError("Enter a valid price value.");
        return;
      }
      if (priceAction === "set") patch.price = value;
      else if (priceAction === "increase") priceAdjust = { mode: "percent", value };
      else if (priceAction === "decrease")
        priceAdjust = { mode: "percent", value: -value };
      else if (priceAction === "add") priceAdjust = { mode: "amount", value };
      else priceAdjust = { mode: "amount", value: -value };
    }

    if (compareAction === "set") {
      const value = Number(compareValue);
      if (compareValue.trim() === "" || !Number.isFinite(value) || value < 0) {
        setError("Enter a valid compare-at price.");
        return;
      }
      patch.compareAtPrice = value;
    } else if (compareAction === "clear") {
      patch.compareAtPrice = null;
    }

    if (status) patch.status = status;
    if (category) patch.category = category;
    if (featured) patch.featured = featured === "on";
    if (isNew) patch.isNew = isNew === "on";

    if (stock !== "") {
      const value = Number(stock);
      if (!Number.isInteger(value) || value < 0) {
        setError("Stock must be a whole number, 0 or more.");
        return;
      }
      patch.stock = value;
    }

    if (!priceAdjust && Object.keys(patch).length === 0) {
      setError("Choose at least one change.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, patch, priceAdjust }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      onDone(data.updated ?? 0, data.failed?.length ?? 0);
    } catch {
      setError("Connection error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Price change">
          <select
            value={priceAction}
            onChange={(e) => setPriceAction(e.target.value as BulkPriceAction)}
            className={inputCls}
          >
            <option value="none">No change</option>
            <option value="set">Set exact price (₱)</option>
            <option value="increase">Increase by %</option>
            <option value="decrease">Decrease by %</option>
            <option value="add">Add amount (₱)</option>
            <option value="subtract">Subtract amount (₱)</option>
          </select>
        </Field>
        <Field label="Price value">
          <input
            type="number"
            min={0}
            step="0.01"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            disabled={priceAction === "none"}
            placeholder={priceAction === "none" ? "—" : "0"}
            className={`${inputCls} disabled:bg-neutral-100 disabled:text-neutral-400`}
          />
        </Field>
        <Field label="Compare-at price">
          <select
            value={compareAction}
            onChange={(e) =>
              setCompareAction(e.target.value as "none" | "set" | "clear")
            }
            className={inputCls}
          >
            <option value="none">No change</option>
            <option value="set">Set price</option>
            <option value="clear">Clear price</option>
          </select>
        </Field>
        <Field label="Compare-at value (₱)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={compareValue}
            onChange={(e) => setCompareValue(e.target.value)}
            disabled={compareAction !== "set"}
            placeholder={compareAction === "set" ? "0" : "—"}
            className={`${inputCls} disabled:bg-neutral-100 disabled:text-neutral-400`}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | ProductStatus)}
            className={inputCls}
          >
            <option value="">No change</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">No change</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Featured">
          <select
            value={featured}
            onChange={(e) => setFeatured(e.target.value as BulkTriState)}
            className={inputCls}
          >
            <option value="">No change</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </Field>
        <Field label="New arrival">
          <select
            value={isNew}
            onChange={(e) => setIsNew(e.target.value as BulkTriState)}
            className={inputCls}
          >
            <option value="">No change</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </Field>
        <Field label="Stock">
          <input
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="No change"
            className={inputCls}
          />
        </Field>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={apply}
        disabled={busy}
        className="px-7 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {busy ? "Applying…" : `Apply to ${ids.length} selected`}
      </button>
    </div>
  );
}

type BulkItem = { id: string; url: string; filename: string; name: string };

function prettify(filename: string): string {
  return filename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function BulkPhotos({
  categories,
  onDone,
}: {
  categories: Category[];
  onDone: () => void;
}) {
  const [category, setCategory] = useState(categories[0]?.slug ?? "");
  const [items, setItems] = useState<BulkItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const activeCategory = category || categories[0]?.slug || "";

  async function handleFiles(fileList: FileList) {
    setBusy(true);
    setStatus("Uploading…");
    const added: BulkItem[] = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.media) {
          added.push({
            id: data.media.id,
            url: data.media.url,
            filename: data.media.filename,
            name: prettify(data.media.filename),
          });
        }
      } catch {}
    }
    setItems((prev) => [...prev, ...added]);
    setStatus(
      `${added.length} photo${added.length === 1 ? "" : "s"} ready. Rename any, then create.`
    );
    setBusy(false);
  }

  async function create() {
    if (items.length === 0) return;
    setBusy(true);
    setStatus("Creating…");
    let ok = 0;
    let fail = 0;
    for (const it of items) {
      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: it.name.trim() || "Untitled product",
            price: 0,
            category: activeCategory,
            images: [it.url],
            status: "draft",
          }),
        });
        if (res.ok) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }
    setStatus(
      `Created ${ok} product${ok === 1 ? "" : "s"}${fail ? `, ${fail} failed` : ""}.`
    );
    setBusy(false);
    if (ok > 0) {
      setItems([]);
      onDone();
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6 space-y-4">
      <div>
        <h2 className="font-oswald text-lg font-bold uppercase">Bulk Photos</h2>
        <p className="text-neutral-500 text-sm mt-1">
          Pick a category, select many photos. Each photo becomes a draft product named after its
          file — rename any before creating.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Category for this batch">
          <select
            value={activeCategory}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} min-w-[200px]`}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <label className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors cursor-pointer">
          {busy ? "Working…" : "Select Photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {status && <p className="text-sm text-neutral-500">{status}</p>}

      {items.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it, index) => (
              <div key={it.id} className="border border-neutral-200 rounded-lg p-3">
                <div className="aspect-square bg-neutral-100 rounded-md mb-2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.url} alt={it.filename} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-neutral-400 truncate mb-2">{it.filename}</p>
                <input
                  value={it.name}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x, i) => (i === index ? { ...x, name: e.target.value } : x))
                    )
                  }
                  placeholder="Product name"
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={create}
            disabled={busy}
            className="px-7 py-3.5 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Create {items.length} product{items.length === 1 ? "" : "s"}
          </button>
        </>
      )}
    </div>
  );
}
