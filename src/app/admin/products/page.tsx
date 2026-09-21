"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  badge: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSave(product: Product) {
    setSaving(true);
    setMessage("");

    try {
      let updatedProducts: Product[];
      if (isAdding) {
        updatedProducts = [...products, { ...product, id: Date.now() }];
      } else {
        updatedProducts = products.map(p => p.id === product.id ? product : p);
      }

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "products",
          data: updatedProducts,
        }),
      });

      if (res.ok) {
        setProducts(updatedProducts);
        setEditingProduct(null);
        setIsAdding(false);
        setMessage(isAdding ? "Product added!" : "Product updated!");
      } else {
        setMessage("Failed to save product");
      }
    } catch {
      setMessage("Connection error");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;

    setSaving(true);
    try {
      const updatedProducts = products.filter(p => p.id !== id);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "products",
          data: updatedProducts,
        }),
      });

      if (res.ok) {
        setProducts(updatedProducts);
        setMessage("Product deleted!");
      }
    } catch {
      setMessage("Connection error");
    }
    setSaving(false);
  }

  async function handleImageUpload(productId: number, file: File) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const updatedProducts = products.map(p =>
        p.id === productId ? { ...p, image: base64 } : p
      );

      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "products",
          data: updatedProducts,
        }),
      });

      setProducts(updatedProducts);
      setMessage("Image uploaded!");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-oswald text-3xl font-bold text-white">Manage Products</h1>
        </div>
        <button
          onClick={() => {
            setEditingProduct({
              id: 0,
              name: "",
              price: 300,
              currency: "₱",
              category: "Caps",
              image: "/images/close-cap.jpg",
              description: "",
              features: [],
              inStock: true,
              badge: null,
            });
            setIsAdding(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald font-semibold rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition-all"
        >
          + Add Product
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("success") || message.includes("uploaded") || message.includes("deleted") || message.includes("added") || message.includes("updated") ? "bg-green-500/10 text-green-400" : "bg-[#e94560]/10 text-[#e94560]"}`}>
          {message}
        </div>
      )}

      {/* Product Edit Form */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          isAdding={isAdding}
          onSave={handleSave}
          onCancel={() => {
            setEditingProduct(null);
            setIsAdding(false);
          }}
          onImageUpload={handleImageUpload}
          saving={saving}
        />
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-6 p-4 rounded-2xl bg-[#1a1a2e] border border-white/5 hover:border-white/10 transition-all"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://graph.facebook.com/61575002625239/picture?type=large";
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-lg font-bold text-white">{product.name}</h3>
                {product.badge && (
                  <span className="px-2 py-0.5 bg-[#e94560]/20 text-[#e94560] text-xs rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{product.category} — ₱{product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="px-3 py-2 text-sm text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                📷 Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(product.id, file);
                  }}
                />
              </label>
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setIsAdding(false);
                }}
                className="px-3 py-2 text-sm text-[#e94560] border border-[#e94560]/30 rounded-lg hover:bg-[#e94560]/10 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-2 text-sm text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  isAdding,
  onSave,
  onCancel,
  onImageUpload,
  saving,
}: {
  product: Product;
  isAdding: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
  onImageUpload: (productId: number, file: File) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(product);
  const [featuresInput, setFeaturesInput] = useState(product.features.join(", "));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...form,
      features: featuresInput.split(",").map(f => f.trim()).filter(Boolean),
    });
  }

  return (
    <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-[#e94560]/30">
      <h3 className="font-oswald text-xl font-bold text-white mb-6">
        {isAdding ? "Add New Product" : "Edit Product"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price (₱)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
            >
              <option value="Caps">Caps</option>
              <option value="Hats">Hats</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Badge (optional)</label>
            <input
              type="text"
              value={form.badge || ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value || null })}
              placeholder="e.g., Best Seller, New"
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Features (comma-separated)</label>
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Premium quality, Adjustable fit, Comfortable"
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            className="w-4 h-4 rounded border-white/10 bg-[#0a0a0f] text-[#e94560] focus:ring-[#e94560]"
          />
          <label htmlFor="inStock" className="text-sm text-gray-400">In Stock</label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald font-semibold rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : isAdding ? "Add Product" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
