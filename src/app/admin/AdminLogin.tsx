"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword("");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid password");
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-black flex items-center justify-center font-oswald text-2xl font-bold text-white mb-4">
            MA
          </div>
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-wider">
            Admin Panel
          </h1>
          <p className="text-neutral-500 mt-2 text-sm tracking-widest uppercase">
            MicsApparel Manager
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 border border-neutral-200 shadow-sm"
        >
          <label className="block text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-3">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
            placeholder="Enter password"
            autoFocus
            required
          />

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-black tracking-widest uppercase transition-colors"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
