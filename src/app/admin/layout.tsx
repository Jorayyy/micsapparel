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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center font-oswald text-3xl font-bold text-white mb-4">
              MA
            </div>
            <h1 className="font-oswald text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-2">MicsApparel Website Manager</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#1a1a2e] rounded-2xl p-8 border border-white/5">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-[#e94560] text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald font-semibold rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition-all disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-gray-500 text-xs text-center mt-4">
              Default password: micsapparel2024
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Admin Header */}
      <header className="bg-[#1a1a2e] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e94560] to-[#d4a574] flex items-center justify-center font-oswald text-sm font-bold text-white">
                MA
              </div>
              <span className="font-oswald text-lg font-bold text-white">Admin Panel</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
