"use client";

import { useEffect, useState } from "react";
import type { MediaItem } from "@/lib/types";

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

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
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">Media</h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Upload images and copy their URLs into products, content, or logo
          </p>
        </div>
        <label className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors cursor-pointer">
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

      <div className="mb-6 bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        Uploads are stored in <code>.data/uploads</code> on the server. On serverless hosts
        these files reset on redeploy — for permanent images, drop files into{" "}
        <code>public/images</code> or paste an external URL.
      </div>

      {media.length === 0 ? (
        <div className="py-16 bg-white border border-neutral-200 text-center">
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
            <div key={item.id} className="bg-white border border-neutral-200 p-4">
              <div className="aspect-square bg-neutral-100 mb-3 overflow-hidden">
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
                  className="flex-1 px-3 py-2 text-[10px] border border-neutral-300 hover:bg-neutral-50 uppercase tracking-widest"
                >
                  {copied === item.url ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="px-3 py-2 text-[10px] text-red-600 border border-red-200 hover:bg-red-50 uppercase tracking-widest"
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
