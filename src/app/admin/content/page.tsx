"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BusinessContent {
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  motto: string;
  founded: string;
  location: {
    city: string;
    province: string;
    country: string;
    full: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    email: string | null;
    messenger: string;
    facebook: string;
    tiktok: string;
    tiktokHandle: string;
  };
  hours: {
    status: string;
    description: string;
  };
  owner: {
    name: string;
    title: string;
  };
}

export default function AdminContent() {
  const [content, setContent] = useState<BusinessContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "about">("general");

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data.business);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "business",
          data: content,
        }),
      });

      if (res.ok) {
        setMessage("Content updated successfully!");
      } else {
        setMessage("Failed to update content");
      }
    } catch {
      setMessage("Connection error");
    }
    setSaving(false);
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-oswald text-3xl font-bold text-white">Edit Content</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald font-semibold rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-[#e94560]/10 text-[#e94560]"}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {(["general", "contact", "about"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-oswald font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#e94560] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Business Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Business Name</label>
                <input
                  type="text"
                  value={content.name}
                  onChange={(e) => setContent({ ...content, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={content.tagline}
                  onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Motto / Quote</label>
                <input
                  type="text"
                  value={content.motto}
                  onChange={(e) => setContent({ ...content, motto: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Founded</label>
                <input
                  type="text"
                  value={content.founded}
                  onChange={(e) => setContent({ ...content, founded: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Owner Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={content.owner.name}
                  onChange={(e) => setContent({ ...content, owner: { ...content.owner, name: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={content.owner.title}
                  onChange={(e) => setContent({ ...content, owner: { ...content.owner, title: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone (raw, for call links)</label>
                  <input
                    type="text"
                    value={content.contact.phoneRaw}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, phoneRaw: e.target.value } })}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={content.contact.email || ""}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value || null } })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">TikTok Handle</label>
                <input
                  type="text"
                  value={content.contact.tiktokHandle}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, tiktokHandle: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Location</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={content.location.city}
                    onChange={(e) => setContent({ ...content, location: { ...content.location, city: e.target.value } })}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Province</label>
                  <input
                    type="text"
                    value={content.location.province}
                    onChange={(e) => setContent({ ...content, location: { ...content.location, province: e.target.value } })}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={content.location.country}
                    onChange={(e) => setContent({ ...content, location: { ...content.location, country: e.target.value } })}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Address Display</label>
                <input
                  type="text"
                  value={content.location.full}
                  onChange={(e) => setContent({ ...content, location: { ...content.location, full: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Business Hours</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <input
                  type="text"
                  value={content.hours.status}
                  onChange={(e) => setContent({ ...content, hours: { ...content.hours, status: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={content.hours.description}
                  onChange={(e) => setContent({ ...content, hours: { ...content.hours, description: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === "about" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
            <h3 className="font-oswald text-lg font-bold text-white mb-4">Business Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Description</label>
                <textarea
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Short Description (for cards/SEO)</label>
                <textarea
                  value={content.shortDescription}
                  onChange={(e) => setContent({ ...content, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
