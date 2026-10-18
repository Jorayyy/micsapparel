"use client";

import { useEffect, useState } from "react";
import type { Category, MediaItem, Product } from "@/lib/types";
import {
  Alert,
  btnPrimary,
  btnSecondary,
  btnSmall,
  btnSmallDanger,
  cardCls,
  inputCls,
  PageHeader,
} from "../ui";

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/upload");
    if (res.ok) {
      const data = await res.json();
      setMedia(data.media || []);
    }
  }

  useEffect(() => {
    fetch("/api/admin/upload")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMedia(data.media || []);
      })
      .catch(() => {});
  }, []);

  function flash(msg: string, isError = false) {
    setError(isError ? msg : "");
    setMessage(isError ? "" : msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Upload failed", true);
      } else {
        flash("Uploaded. Copy the URL into any product or logo field.");
        load();
      }
    } catch {
      flash("Upload failed", true);
    }
    setUploading(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this media file?")) return;
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        flash("Deleted.");
        load();
      }
    } catch {
      flash("Failed to delete", true);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div>
      <PageHeader
        title="Media"
        subtitle="Upload images and copy their URLs into products, content, or logo"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowBulk((v) => !v)}
              className={btnSecondary}
            >
              {showBulk ? "Close Bulk" : "Bulk Upload"}
            </button>
            <label className={`${btnPrimary} cursor-pointer`}>
              {uploading ? "Uploading…" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        }
      />

      {message && <Alert>{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {showBulk && (
        <BulkAssign
          onUploaded={load}
          onAssigned={() => {
            flash("Photos assigned to products.");
            load();
          }}
        />
      )}

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        Uploads are stored in <code>.data/uploads</code> on the server. On serverless hosts
        these files reset on redeploy — for permanent images, drop files into{" "}
        <code>public/images</code> or paste an external URL.
      </div>

      {media.length === 0 ? (
        <div className={`${cardCls} py-16 text-center`}>
          <p className="font-oswald text-2xl font-bold text-neutral-300 uppercase">
            No uploads yet
          </p>
          <p className="text-neutral-400 text-sm mt-2">
            Use &quot;Upload Image&quot; or add files to public/images
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className={`${cardCls} p-4`}>
              <div className="aspect-square bg-neutral-100 rounded-md mb-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-neutral-500 truncate">{item.filename}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {(item.size / 1024).toFixed(0)} KB
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className={`${btnSmall} flex-1`}
                >
                  {copied === item.url ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className={btnSmallDanger}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type BulkItem = { media: MediaItem; productId: string };

function BulkAssign({
  onUploaded,
  onAssigned,
}: {
  onUploaded: () => void;
  onAssigned: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<BulkItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/admin/categories"), fetch("/api/admin/products")])
      .then(([c, p]) =>
        Promise.all([c.ok ? c.json() : null, p.ok ? p.json() : null])
      )
      .then(([cd, pd]) => {
        const cats: Category[] = cd?.categories ?? [];
        setCategories(cats);
        setProducts(pd?.products ?? []);
        if (cats[0]) setCategory(cats[0].slug);
      })
      .catch(() => {});
  }, []);

  const inCategory = products.filter((p) => p.category === category);

  function matchProduct(filename: string): string {
    const base = filename.toLowerCase().replace(/\.[a-z0-9]+$/, "");
    const hit = [...inCategory]
      .sort((a, b) => b.slug.length - a.slug.length)
      .find((p) => base.includes(p.slug));
    return hit?.id ?? "";
  }

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
          added.push({ media: data.media, productId: matchProduct(file.name) });
        }
      } catch {}
    }
    setItems((prev) => [...prev, ...added]);
    setStatus(`${added.length} photo${added.length === 1 ? "" : "s"} ready to review.`);
    setBusy(false);
    onUploaded();
  }

  async function save() {
    const byProduct = new Map<string, string[]>();
    for (const it of items) {
      if (!it.productId) continue;
      byProduct.set(it.productId, [...(byProduct.get(it.productId) ?? []), it.media.url]);
    }
    if (byProduct.size === 0) {
      setStatus("Pick a product for at least one photo.");
      return;
    }
    setBusy(true);
    setStatus("Saving…");
    let ok = 0;
    let fail = 0;
    for (const [productId, urls] of byProduct) {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        fail++;
        continue;
      }
      const images = [...product.images];
      for (const url of urls) if (!images.includes(url)) images.push(url);
      try {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, images }),
        });
        if (res.ok) {
          const data = await res.json();
          setProducts((list) => list.map((p) => (p.id === productId ? data.product : p)));
          ok++;
        } else {
          fail++;
        }
      } catch {
        fail++;
      }
    }
    setItems((prev) => prev.filter((it) => !byProduct.has(it.productId)));
    setStatus(
      `Assigned to ${ok} product${ok === 1 ? "" : "s"}${fail ? `, ${fail} failed` : ""}.`
    );
    setBusy(false);
    if (ok > 0) onAssigned();
  }

  return (
    <div className={`${cardCls} p-6 mb-6 space-y-4`}>
      <div>
        <h2 className="font-oswald text-lg font-bold uppercase">Bulk Assign Photos</h2>
        <p className="text-neutral-500 text-sm mt-1">
          Pick a category, select many photos, then confirm the product for each.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
            Category for this batch
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} min-w-[200px]`}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={`${btnPrimary} cursor-pointer`}>
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
              <div key={it.media.id} className={`${cardCls} p-3`}>
                <div className="aspect-square bg-neutral-100 rounded-md mb-2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.media.url}
                    alt={it.media.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-neutral-500 truncate mb-2">{it.media.filename}</p>
                <select
                  value={it.productId}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x, i) => (i === index ? { ...x, productId: e.target.value } : x))
                    )
                  }
                  className={inputCls}
                >
                  <option value="">— Assign to product —</option>
                  {inCategory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button type="button" onClick={save} disabled={busy} className={btnPrimary}>
            Assign to products
          </button>
        </>
      )}
    </div>
  );
}
