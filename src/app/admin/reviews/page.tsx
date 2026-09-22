"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews || []);
    }
  }

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setReviews(data.reviews || []);
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

  async function save(review: Review) {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Failed to save", true);
        return;
      }
      setEditing(null);
      flash("Review saved.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        flash("Failed to delete", true);
        return;
      }
      flash("Review deleted.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  const empty: Review = {
    id: "",
    name: "",
    text: "",
    rating: 5,
    source: "Facebook Review",
    status: "published",
    createdAt: "",
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">Reviews</h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Manage the reviews shown on your homepage
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(empty);
          }}
          className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          + Add Review
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
                Source
              </label>
              <input
                value={editing.source}
                onChange={(e) => setEditing({ ...editing, source: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Rating
              </label>
              <select
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                className={inputCls}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Status
              </label>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Review["status"] })
                }
                className={inputCls}
              >
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                Review text
              </label>
              <textarea
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                rows={4}
                className={`${inputCls} resize-none`}
              />
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
              }}
              className="px-6 py-3 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-neutral-200 p-5 flex flex-wrap gap-4 items-start"
          >
            <div className="flex-1 min-w-[220px]">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-oswald text-lg font-bold uppercase">{review.name}</h3>
                <span className="text-xs text-neutral-400">{review.source}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    review.status === "published"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}
                >
                  {review.status}
                </span>
                <span className="text-xs" aria-label={`${review.rating} stars`}>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-neutral-600 text-sm mt-2">{review.text}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(review);
                }}
                className="px-4 py-2 text-xs border border-neutral-300 hover:bg-neutral-50 tracking-widest uppercase"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(review.id)}
                className="px-4 py-2 text-xs text-red-600 border border-red-200 hover:bg-red-50 tracking-widest uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="py-16 bg-white border border-neutral-200 text-center">
            <p className="font-oswald text-2xl font-bold text-neutral-300 uppercase">
              No reviews yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors";
