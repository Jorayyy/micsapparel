"use client";

import { useState, useEffect } from "react";

export default function AdminLogo() {
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("micsapparel-logo");
    if (stored) {
      setLogoUrl(stored);
    } else {
      setLogoUrl("https://graph.facebook.com/61575002625239/picture?type=large&width=400");
    }
  }, []);

  function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      localStorage.setItem("micsapparel-logo", logoUrl);
      setMessage("Logo updated! Changes appear on the site immediately.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error saving logo");
    }
    setSaving(false);
  }

  function handleReset() {
    const defaultUrl = "https://graph.facebook.com/61575002625239/picture?type=large&width=400";
    setLogoUrl(defaultUrl);
    localStorage.setItem("micsapparel-logo", defaultUrl);
    setMessage("Logo reset to default");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-oswald text-4xl font-bold text-white uppercase tracking-tight">
          Logo
        </h1>
        <p className="text-gray-500 mt-2">Update the brand logo displayed across the site</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Preview */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8">
          <h3 className="font-oswald text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-6">
            Preview
          </h3>
          <div className="flex items-center justify-center py-10">
            <img
              src={logoUrl}
              alt="Logo Preview"
              className="w-32 h-32 rounded-full object-cover ring-2 ring-white/10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=MA&background=fff&color=000&size=200";
              }}
            />
          </div>
          <div className="mt-6 flex items-center gap-2">
            <img
              src={logoUrl}
              alt="Logo Small"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=MA&background=fff&color=000&size=100";
              }}
            />
            <span className="font-oswald text-sm font-bold tracking-[0.2em] uppercase">
              MicsApparel
            </span>
          </div>
        </div>

        {/* Edit */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8">
          <h3 className="font-oswald text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-6">
            Update Logo
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3">
                Logo URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-4 bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-gray-600"
                placeholder="https://example.com/logo.jpg"
              />
              <p className="text-gray-600 text-xs mt-2">
                Paste a URL to your logo image (JPG, PNG, SVG)
              </p>
            </div>

            {message && (
              <p className="text-white text-sm bg-white/5 px-4 py-3 border border-white/10">
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-white text-black font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Logo"}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-white/10 text-gray-400 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
              >
                Reset to Default
              </button>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h4 className="font-oswald text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-3">
                Quick Sources
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setLogoUrl("https://graph.facebook.com/61575002625239/picture?type=large&width=400")}
                  className="block w-full text-left px-4 py-3 bg-black border border-white/5 text-sm text-gray-400 hover:text-white hover:border-white/10 transition-all"
                >
                  Facebook Page Photo
                </button>
                <button
                  onClick={() => setLogoUrl("https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=400&bold=true&font=oswald")}
                  className="block w-full text-left px-4 py-3 bg-black border border-white/5 text-sm text-gray-400 hover:text-white hover:border-white/10 transition-all"
                >
                  Generated MA Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
