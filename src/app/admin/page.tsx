"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SiteContent {
  business: {
    name: string;
    tagline: string;
    description: string;
    motto: string;
    founded: string;
    logo: string;
    contact: {
      phone: string;
      email: string | null;
    };
  };
  products: Array<{
    id: number;
    name: string;
    price: number;
    category: string;
  }>;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-oswald text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your MicsApparel website content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <p className="text-gray-400 text-sm">Products</p>
          <p className="font-oswald text-3xl font-bold text-white mt-1">
            {content?.products?.length || 0}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <p className="text-gray-400 text-sm">Business Name</p>
          <p className="font-oswald text-xl font-bold text-white mt-1">
            {content?.business?.name || "MicsApparel"}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <p className="text-gray-400 text-sm">Logo Status</p>
          <p className="font-oswald text-lg font-bold text-[#e94560] mt-1">
            {content?.business?.logo?.includes("graph.facebook.com") ? "Facebook Logo" : "Custom Logo"}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
          <p className="text-gray-400 text-sm">Last Updated</p>
          <p className="font-oswald text-sm font-bold text-white mt-1">
            {content?.lastUpdated ? new Date(content.lastUpdated).toLocaleDateString() : "Never"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/logo"
          className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] border border-white/5 hover:border-[#e94560]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mb-4 group-hover:bg-[#e94560] transition-all">
            <svg className="w-6 h-6 text-[#e94560] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-oswald text-xl font-bold text-white mb-2">Change Logo</h3>
          <p className="text-gray-400 text-sm">Upload a new logo or profile picture</p>
        </Link>

        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] border border-white/5 hover:border-[#e94560]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mb-4 group-hover:bg-[#e94560] transition-all">
            <svg className="w-6 h-6 text-[#e94560] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-oswald text-xl font-bold text-white mb-2">Manage Products</h3>
          <p className="text-gray-400 text-sm">Add, edit, or remove products</p>
        </Link>

        <Link
          href="/admin/content"
          className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] border border-white/5 hover:border-[#e94560]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mb-4 group-hover:bg-[#e94560] transition-all">
            <svg className="w-6 h-6 text-[#e94560] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-oswald text-xl font-bold text-white mb-2">Edit Content</h3>
          <p className="text-gray-400 text-sm">Update business info, about text, and more</p>
        </Link>
      </div>

      {/* Current Logo Preview */}
      <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-white/5">
        <h3 className="font-oswald text-lg font-bold text-white mb-4">Current Logo</h3>
        <div className="flex items-center gap-6">
          <img
            src={content?.business?.logo || "https://graph.facebook.com/61575002625239/picture?type=large"}
            alt="Current Logo"
            className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
          />
          <div>
            <p className="text-white font-medium">{content?.business?.name || "MicsApparel"}</p>
            <p className="text-gray-400 text-sm mt-1">
              {content?.business?.logo?.includes("graph.facebook.com")
                ? "Using Facebook profile picture"
                : "Using custom uploaded logo"}
            </p>
            <Link href="/admin/logo" className="text-[#e94560] text-sm mt-2 inline-block hover:underline">
              Change logo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
