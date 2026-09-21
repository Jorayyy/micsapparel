"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/check");
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch {
      // Not authenticated
    }
    setIsLoading(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    }
    setIsLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPassword("");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center font-oswald text-3xl font-bold text-black mb-4">
              MA
            </div>
            <h1 className="font-oswald text-3xl font-bold text-white uppercase tracking-wider">
              Admin Panel
            </h1>
            <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">
              MicsApparel Manager
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0a0a0a] border border-white/5 p-8">
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-gray-600"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-gray-600 text-xs text-center mt-6">
              Default: micsapparel2024
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" target="_blank" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-oswald text-sm font-bold text-black">
                  MA
                </div>
                <span className="font-oswald text-sm font-bold text-white tracking-[0.2em] uppercase hidden sm:block">
                  MicsApparel
                </span>
              </a>
              <span className="text-gray-600">|</span>
              <span className="font-oswald text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-gray-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs text-gray-500 hover:text-white border border-white/10 hover:bg-white/5 transition-all tracking-widest uppercase"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-[#050505] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/logo", label: "Logo" },
              { href: "/admin/products", label: "Products" },
              { href: "/admin/content", label: "Content" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[11px] font-bold text-gray-500 hover:text-white tracking-[0.2em] uppercase whitespace-nowrap hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {children}
      </main>
    </div>
  );
}
