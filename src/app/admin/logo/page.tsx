"use client";

import { useEffect, useState } from "react";
import type { Business } from "@/lib/types";
import { Alert, btnPrimary, btnSecondary, cardCls, inputCls, PageHeader } from "../ui";

export default function AdminLogo() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data.business);
        setLogoUrl(data.business?.logo ?? "");
      })
      .catch(() => setError("Failed to load current logo"));
  }, []);

  async function save(logo: string) {
    if (!business) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "business",
          data: { ...business, logo },
        }),
      });
      if (!res.ok) {
        setError("Failed to save logo");
        return;
      }
      setLogoUrl(logo);
      setMessage("Logo updated across the site.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Connection error");
    }
    setSaving(false);
  }

  const DEFAULT_LOGO = "/logo.svg";

  return (
    <div>
      <PageHeader
        title="Logo"
        subtitle="Brand logo shown in the navbar, footer, and about sections"
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className={`${cardCls} p-7`}>
          <h3 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase mb-5">
            Preview
          </h3>
          <div className="flex items-center justify-center py-10 bg-neutral-50 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo preview"
              className="w-32 h-32 rounded-full object-cover ring-2 ring-neutral-200"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src =
                  "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=200";
              }}
            />
          </div>
          <div className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src =
                  "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=100";
              }}
            />
            <span className="font-oswald text-sm font-bold tracking-[0.18em] uppercase">
              MicsApparel
            </span>
          </div>
        </div>

        <div className={`${cardCls} p-7 space-y-5`}>
          <h3 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase">
            Update Logo
          </h3>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className={inputCls}
              placeholder="https://example.com/logo.jpg"
            />
            <p className="text-neutral-400 text-xs mt-2">
              JPG, PNG, or SVG URL (JPG/PNG recommended for best rendering)
            </p>
          </div>

          {message && <Alert>{message}</Alert>}
          {error && <Alert tone="error">{error}</Alert>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => save(logoUrl)}
              disabled={saving || !logoUrl}
              className={btnPrimary}
            >
              {saving ? "Saving…" : "Save Logo"}
            </button>
            <button
              type="button"
              onClick={() => save(DEFAULT_LOGO)}
              className={btnSecondary}
            >
              Reset to Default
            </button>
          </div>

          <div className="pt-5 border-t border-neutral-200">
            <h4 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase mb-3">
              Quick Sources
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLogoUrl(DEFAULT_LOGO)}
                className="block w-full text-left px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:text-black hover:border-neutral-400 transition-all"
              >
                Local MA Logo (default)
              </button>
              <button
                type="button"
                onClick={() =>
                  setLogoUrl(
                    "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=400&bold=true&font=oswald"
                  )
                }
                className="block w-full text-left px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:text-black hover:border-neutral-400 transition-all"
              >
                Generated MA Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
