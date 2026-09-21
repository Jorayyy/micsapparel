"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminLogo() {
  const [logo, setLogo] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setCurrentLogo(data.business.logo);
        setLogo(data.business.logo);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage("File too large. Maximum 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      setLogo(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "business",
          data: { logo },
        }),
      });

      if (res.ok) {
        setMessage("Logo updated successfully!");
        setCurrentLogo(logo);
      } else {
        setMessage("Failed to update logo");
      }
    } catch {
      setMessage("Connection error");
    }
    setSaving(false);
  }

  function handleReset() {
    const fbLogo = "https://graph.facebook.com/61575002625239/picture?type=large&width=400";
    setLogo(fbLogo);
    setPreview("");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-oswald text-3xl font-bold text-white">Change Logo</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Current Logo */}
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <h3 className="font-oswald text-lg font-bold text-white mb-4">Current Logo</h3>
          <div className="flex items-center gap-6">
            <img
              src={currentLogo}
              alt="Current Logo"
              className="w-32 h-32 rounded-full object-cover border-2 border-white/10"
            />
            <div>
              <p className="text-white font-medium">MicsApparel</p>
              <p className="text-gray-400 text-sm mt-1">
                {currentLogo.includes("graph.facebook.com")
                  ? "Facebook profile picture"
                  : "Custom uploaded logo"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload New Logo */}
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <h3 className="font-oswald text-lg font-bold text-white mb-4">Upload New Logo</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Select image (JPG, PNG, or WebP - Max 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#e94560] file:text-white file:font-semibold hover:file:bg-[#ff6b81] file:cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Or enter image URL
              </label>
              <input
                type="url"
                value={logo}
                onChange={(e) => {
                  setLogo(e.target.value);
                  setPreview("");
                }}
                placeholder="https://example.com/logo.jpg"
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
              />
            </div>

            {/* Preview */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Preview</p>
              <img
                src={preview || logo}
                alt="Logo Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://graph.facebook.com/61575002625239/picture?type=large";
                }}
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-[#e94560]"}`}>
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || logo === currentLogo}
                className="px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald font-semibold rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Logo"}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-all"
              >
                Reset to Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-white/5">
        <h3 className="font-oswald text-lg font-bold text-white mb-3">Tips</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Use a square image (1:1 ratio) for best results</li>
          <li>• Recommended size: 400x400px or larger</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• Maximum file size: 2MB</li>
          <li>• The logo appears in the navbar, footer, and throughout the site</li>
        </ul>
      </div>
    </div>
  );
}
