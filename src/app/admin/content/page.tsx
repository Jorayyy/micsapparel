"use client";

import { useEffect, useState } from "react";
import type { Business, Faq } from "@/lib/types";

type Tab = "business" | "faqs";

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>("business");
  const [business, setBusiness] = useState<Business | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setBusiness(data.business);
          setFaqs(data.faqs || []);
        }
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

  async function saveSection(section: "business" | "faqs", data: unknown) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) {
        flash("Failed to save", true);
        return;
      }
      const payload = await res.json();
      if (payload.business) setBusiness(payload.business);
      if (payload.faqs) setFaqs(payload.faqs);
      flash("Saved. Changes are live on the site.");
    } catch {
      flash("Connection error", true);
    }
    setSaving(false);
  }

  if (!business) return <p className="text-neutral-400 text-sm">Loading…</p>;

  function setB<K extends keyof Business>(key: K, value: Business[K]) {
    setBusiness((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">Content</h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Business information, FAQs — saved on the server so every visitor sees it
        </p>
      </div>

      <div className="flex items-center gap-1 mb-7 border-b border-neutral-200">
        {(
          [
            { key: "business" as Tab, label: "Business Info" },
            { key: "faqs" as Tab, label: "FAQs" },
          ]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`px-5 py-3 text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 transition-colors ${
              tab === item.key
                ? "text-black border-black"
                : "text-neutral-400 border-transparent hover:text-neutral-700"
            }`}
          >
            {item.label}
          </button>
        ))}
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

      {tab === "business" && (
        <div className="space-y-6">
          <Section title="Basic Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Brand Name" value={business.name} onChange={(v) => setB("name", v)} />
              <Input label="Founded" value={business.founded} onChange={(v) => setB("founded", v)} />
            </div>
            <Input label="Tagline" value={business.tagline} onChange={(v) => setB("tagline", v)} />
            <Input label="Motto" value={business.motto} onChange={(v) => setB("motto", v)} />
            <Textarea
              label="Description"
              value={business.description}
              onChange={(v) => setB("description", v)}
              rows={4}
            />
            <Textarea
              label="Short Description (footer)"
              value={business.shortDescription}
              onChange={(v) => setB("shortDescription", v)}
              rows={2}
            />
            <Textarea label="Mission" value={business.mission} onChange={(v) => setB("mission", v)} rows={3} />
          </Section>

          <Section title="Contact">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone (display)"
                value={business.contact.phone}
                onChange={(v) =>
                  setB("contact", { ...business.contact, phone: v })
                }
              />
              <Input
                label="Phone (raw, for tel: link)"
                value={business.contact.phoneRaw}
                onChange={(v) =>
                  setB("contact", { ...business.contact, phoneRaw: v })
                }
              />
              <Input
                label="Messenger URL"
                value={business.contact.messenger}
                onChange={(v) =>
                  setB("contact", { ...business.contact, messenger: v })
                }
              />
              <Input
                label="Facebook URL"
                value={business.contact.facebook}
                onChange={(v) =>
                  setB("contact", { ...business.contact, facebook: v })
                }
              />
              <Input
                label="TikTok URL"
                value={business.contact.tiktok}
                onChange={(v) =>
                  setB("contact", { ...business.contact, tiktok: v })
                }
              />
              <Input
                label="TikTok Handle"
                value={business.contact.tiktokHandle}
                onChange={(v) =>
                  setB("contact", { ...business.contact, tiktokHandle: v })
                }
              />
              <Input
                label="Address"
                value={business.contact.address}
                onChange={(v) =>
                  setB("contact", { ...business.contact, address: v })
                }
              />
              <Input
                label="Hours"
                value={business.contact.hours}
                onChange={(v) =>
                  setB("contact", { ...business.contact, hours: v })
                }
              />
            </div>
          </Section>

          <Section title="Social Links (used by site CTAs)">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Facebook"
                value={business.social.facebook}
                onChange={(v) => setB("social", { ...business.social, facebook: v })}
              />
              <Input
                label="TikTok"
                value={business.social.tiktok}
                onChange={(v) => setB("social", { ...business.social, tiktok: v })}
              />
              <Input
                label="Messenger"
                value={business.social.messenger}
                onChange={(v) => setB("social", { ...business.social, messenger: v })}
              />
            </div>
          </Section>

          <Section title="Stats (edit only with real numbers)">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Followers"
                value={business.stats.followers}
                onChange={(v) => setB("stats", { ...business.stats, followers: v })}
              />
              <Input
                label="Recommended"
                value={business.stats.rating}
                onChange={(v) => setB("stats", { ...business.stats, rating: v })}
              />
              <Input
                label="Years in Business"
                value={business.stats.yearsInBusiness}
                onChange={(v) =>
                  setB("stats", { ...business.stats, yearsInBusiness: v })
                }
              />
            </div>
          </Section>

          <SaveButton
            saving={saving}
            onClick={() => saveSection("business", business)}
          />
        </div>
      )}

      {tab === "faqs" && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white border border-neutral-200 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  FAQ {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFaqs(faqs.filter((f) => f.id !== faq.id))
                  }
                  className="text-xs text-red-600 hover:text-red-700 tracking-widest uppercase"
                >
                  Remove
                </button>
              </div>
              <Input
                label="Question"
                value={faq.question}
                onChange={(v) =>
                  setFaqs(faqs.map((f) => (f.id === faq.id ? { ...f, question: v } : f)))
                }
              />
              <div className="mt-3">
                <Textarea
                  label="Answer"
                  value={faq.answer}
                  onChange={(v) =>
                    setFaqs(faqs.map((f) => (f.id === faq.id ? { ...f, answer: v } : f)))
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFaqs([
                ...faqs,
                {
                  id: `faq_${Date.now()}`,
                  question: "New question",
                  answer: "New answer",
                  order: faqs.length + 1,
                },
              ])
            }
            className="px-5 py-3 border border-neutral-300 text-xs tracking-widest uppercase hover:bg-white transition-colors"
          >
            + Add FAQ
          </button>

          <SaveButton saving={saving} onClick={() => saveSection("faqs", faqs)} />
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 p-6">
      <h3 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase mb-5">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <div className="pt-5 border-t border-neutral-200">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
      <p className="text-neutral-400 text-xs mt-3">
        Saved to the server — visible to every visitor immediately.
      </p>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors";

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${inputCls} resize-none`}
      />
    </div>
  );
}
