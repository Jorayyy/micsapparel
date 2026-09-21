"use client";

import { useState, useEffect } from "react";
import { products as defaultProducts } from "@/data/business";

type Product = typeof defaultProducts[number];

const STORAGE_KEY = "micsapparel-products";

function loadProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultProducts;
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  function handleSave(product: Product) {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
    saveProducts(updated);
    setEditing(null);
    setMessage("Product updated! Changes appear on the site immediately.");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    setMessage("Product deleted");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleAdd() {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const newProduct: Product = {
      id: newId,
      name: "New Product",
      price: 300,
      currency: "₱",
      category: "Caps",
      image: "https://picsum.photos/seed/new/600/750",
      description: "Product description",
      features: ["Feature 1", "Feature 2"],
      inStock: true,
      badge: null,
    };
    setProducts([...products, newProduct]);
    saveProducts([...products, newProduct]);
    setEditing(newId);
    setMessage("New product added");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-oswald text-4xl font-bold text-white uppercase tracking-tight">
            Products
          </h1>
          <p className="text-gray-500 mt-2">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-white text-black font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 bg-white/5 border border-white/10 text-white text-sm">
          {message}
        </div>
      )}

      <div className="space-y-px bg-white/5">
        {products.map((product) => (
          <div key={product.id} className="bg-[#0a0a0a] p-6">
            {editing === product.id ? (
              <EditForm
                product={product}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="flex items-center gap-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover bg-[#111]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(product.name) + "&background=111&color=fff&size=128";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-oswald text-lg font-bold text-white uppercase">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {product.currency}{product.price} · {product.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(product.id)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all tracking-widest uppercase"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 text-xs text-red-500 hover:text-red-400 border border-red-500/20 hover:bg-red-500/5 transition-all tracking-widest uppercase"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-[#0a0a0a] border border-white/5">
          <p className="font-oswald text-2xl font-bold text-white/10 uppercase">
            No products yet
          </p>
        </div>
      )}
    </div>
  );
}

function EditForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...product });

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Price (₱)
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="Caps">Caps</option>
            <option value="Snapbacks">Snapbacks</option>
            <option value="Dad Caps">Dad Caps</option>
            <option value="Hats">Hats</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Badge
          </label>
          <input
            type="text"
            value={form.badge || ""}
            onChange={(e) => setForm({ ...form, badge: e.target.value || null })}
            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            placeholder="e.g. New, Best Seller"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="px-6 py-3 bg-white text-black font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-white/10 text-gray-400 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
