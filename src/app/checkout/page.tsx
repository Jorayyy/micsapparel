"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPeso } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { PaymentMethod } from "@/lib/types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "gcash", label: "GCash", hint: "Details sent after order" },
  { value: "maya", label: "Maya", hint: "Details sent after order" },
  { value: "bank", label: "Bank Transfer", hint: "Details sent after order" },
  { value: "cod", label: "Cash on Delivery", hint: "Select areas only" },
];

export default function CheckoutPage() {
  const { items, subtotal, ready, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("gcash");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.province.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            variantId: item.variantId,
          })),
          customer: form,
          paymentMethod: payment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.orderNumber)}`);
    } catch {
      setError("Connection error. Please try again.");
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <section className="bg-white">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight mb-4">
            Your cart is empty
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Add some pieces to your cart before checking out.
          </p>
          <Link
            href="/products"
            className="inline-flex px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
          Checkout
        </span>
        <h1 className="font-oswald text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-10">
          Shipping & Payment
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <fieldset className="border border-neutral-200 p-6">
              <legend className="px-2 font-oswald text-xs font-bold tracking-[0.2em] uppercase">
                Contact Information
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <Field
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Juan Dela Cruz"
                />
                <Field
                  label="Mobile Number"
                  required
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="09XX XXX XXXX"
                  type="tel"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Email (optional)"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@email.com"
                    type="email"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-neutral-200 p-6">
              <legend className="px-2 font-oswald text-xs font-bold tracking-[0.2em] uppercase">
                Shipping Address
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <div className="sm:col-span-2">
                  <Field
                    label="Street Address / Barangay"
                    required
                    value={form.address}
                    onChange={(v) => update("address", v)}
                    placeholder="House no., street, barangay"
                  />
                </div>
                <Field
                  label="City / Municipality"
                  required
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  placeholder="Tacloban City"
                />
                <Field
                  label="Province"
                  required
                  value={form.province}
                  onChange={(v) => update("province", v)}
                  placeholder="Leyte"
                />
                <Field
                  label="ZIP Code"
                  value={form.zip}
                  onChange={(v) => update("zip", v)}
                  placeholder="6500"
                />
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                    Order Notes (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Landmark, preferred delivery time, etc."
                    className="w-full px-4 py-3 border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-neutral-200 p-6">
              <legend className="px-2 font-oswald text-xs font-bold tracking-[0.2em] uppercase">
                Payment Method
              </legend>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                      payment === option.value
                        ? "border-black bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={payment === option.value}
                      onChange={() => setPayment(option.value)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-oswald text-sm font-bold uppercase">
                        {option.label}
                      </span>
                      <span className="block text-xs text-neutral-500 mt-0.5">
                        {option.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-4">
                Payment details are sent after your order is confirmed. Shipping fees are
                calculated based on your location and confirmed via Messenger or phone.
              </p>
            </fieldset>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-bold uppercase tracking-widest">
              Your Order
            </h2>

            <ul className="space-y-3 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="w-14 h-16 bg-neutral-100 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-oswald text-xs font-bold uppercase truncate">
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-[11px] text-neutral-500">{item.variantLabel}</p>
                    )}
                    <p className="text-[11px] text-neutral-500">Qty {item.qty}</p>
                  </div>
                  <span className="text-xs font-medium shrink-0">
                    {formatPeso(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPeso(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-400 text-xs">On confirmation</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200">
                <span className="font-oswald uppercase tracking-widest text-sm">Total</span>
                <span className="font-oswald text-2xl font-bold">{formatPeso(subtotal)}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Your order is saved as <strong>Pending</strong>. We&apos;ll confirm stock and
              shipping with you shortly.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
        {label}
        {required && <span className="text-black ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-neutral-300 text-sm focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
}
