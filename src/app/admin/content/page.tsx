"use client";

import { useState, useEffect } from "react";
import { business as defaultBusiness, testimonials as defaultTestimonials, faqs as defaultFaqs } from "@/data/business";

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<"business" | "testimonials" | "faqs">("business");
  const [message, setMessage] = useState("");

  const [business, setBusiness] = useState(defaultBusiness);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("micsapparel-content");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.business) setBusiness({ ...defaultBusiness, ...parsed.business });
        if (parsed.testimonials) setTestimonials(parsed.testimonials);
        if (parsed.faqs) setFaqs(parsed.faqs);
      }
    } catch {}
  }, []);

  function saveContent() {
    const data = { business, testimonials, faqs };
    localStorage.setItem("micsapparel-content", JSON.stringify(data));
    setMessage("Content saved! Changes appear on the site immediately.");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-oswald text-4xl font-bold text-gray-900 uppercase tracking-tight">
          Content
        </h1>
        <p className="text-gray-500 mt-2">Manage business info, testimonials, and FAQs</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200">
        {[
          { key: "business" as const, label: "Business Info" },
          { key: "testimonials" as const, label: "Testimonials" },
          { key: "faqs" as const, label: "FAQs" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all border-b-2 ${
              activeTab === tab.key
                ? "text-gray-900 border-black"
                : "text-gray-400 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded">
          {message}
        </div>
      )}

      {/* Business Info */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-oswald text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">
              Basic Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Founded
                </label>
                <input
                  type="text"
                  value={business.founded}
                  onChange={(e) => setBusiness({ ...business, founded: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={business.tagline}
                onChange={(e) => setBusiness({ ...business, tagline: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                Motto
              </label>
              <input
                type="text"
                value={business.motto}
                onChange={(e) => setBusiness({ ...business, motto: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                Description
              </label>
              <textarea
                value={business.description}
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none rounded"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-oswald text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">
              Contact
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={business.contact.phone}
                  onChange={(e) => setBusiness({ ...business, contact: { ...business.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={business.contact.tiktokHandle}
                  onChange={(e) => setBusiness({ ...business, contact: { ...business.contact, tiktokHandle: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-oswald text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">
              Stats
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Followers
                </label>
                <input
                  type="text"
                  value={business.stats.followers}
                  onChange={(e) => setBusiness({ ...business, stats: { ...business.stats, followers: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Rating
                </label>
                <input
                  type="text"
                  value={business.stats.rating}
                  onChange={(e) => setBusiness({ ...business, stats: { ...business.stats, rating: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Years in Business
                </label>
                <input
                  type="text"
                  value={business.stats.yearsInBusiness}
                  onChange={(e) => setBusiness({ ...business, stats: { ...business.stats, yearsInBusiness: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => {
                      const updated = [...testimonials];
                      updated[i] = { ...t, name: e.target.value };
                      setTestimonials(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                    Source
                  </label>
                  <input
                    type="text"
                    value={t.source}
                    onChange={(e) => {
                      const updated = [...testimonials];
                      updated[i] = { ...t, source: e.target.value };
                      setTestimonials(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Review
                </label>
                <textarea
                  value={t.text}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[i] = { ...t, text: e.target.value };
                    setTestimonials(updated);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQs */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[i] = { ...faq, question: e.target.value };
                    setFaqs(updated);
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                  Answer
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[i] = { ...faq, answer: e.target.value };
                    setFaqs(updated);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={saveContent}
          className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors rounded"
        >
          Save All Changes
        </button>
        <p className="text-gray-400 text-xs mt-3">
          Changes are saved to your browser and reflected on the site immediately.
        </p>
      </div>
    </div>
  );
}
