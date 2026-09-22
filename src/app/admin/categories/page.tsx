"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories || []);
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCategories(data.categories || []);
      })
      .catch(() => {});
  }, []);

  function flash(msg: string, isError = false) {
    setError(isError ? msg : "");
    setMessage(isError ? "" : msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3500);
  }

  async function save(category: Category) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: category.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Failed to save", true);
        return;
      }
      setEditing(null);
      setIsNew(false);
      flash("Category saved.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products keep their category slug.")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        flash("Failed to delete", true);
        return;
      }
      flash("Category deleted.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  const empty: Category = {
    id: "",
    slug: "",
    name: "",
    description: "",
    image: null,
    order: categories.length + 1,
    status: "active",
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">
            Categories
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">Organize products into collections</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(empty);
            setIsNew(true);
          }}
          className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          + Add Category
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

      {editing && (
        <div className="bg-white border border-neutral-200 p-6 mb-6 space-y-4">
          <h2 className="font-oswald text-lg font-bold uppercase">
            {isNew ? "New Category" : `Edit: ${editing.name}`}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Name
              </label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Slug
              </label>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="auto-from-name"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Description
              </label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Order
              </label>
              <input
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Status
              </label>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Category["status"] })
                }
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => save(editing)}
              className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
              className="px-6 py-3 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-neutral-200 p-5 flex flex-wrap items-center gap-4"
          >
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h3 className="font-oswald text-lg font-bold uppercase">{category.name}</h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    category.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}
                >
                  {category.status}
                </span>
              </div>
              <p className="text-neutral-500 text-sm mt-1">{category.description}</p>
              <p className="text-neutral-400 text-xs mt-0.5">
                /{category.slug} · order {category.order}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(category);
                  setIsNew(false);
                }}
                className="px-4 py-2 text-xs border border-neutral-300 hover:bg-neutral-50 tracking-widest uppercase"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(category.id)}
                className="px-4 py-2 text-xs text-red-600 border border-red-200 hover:bg-red-50 tracking-widest uppercase"
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

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors";
