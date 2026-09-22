"use client";

import { formatPeso } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <h2 className="font-oswald text-lg font-bold uppercase tracking-widest">
            Cart ({count})
          </h2>
          <button
            type="button"
            onClick={close}
            className="p-2 -mr-2 text-neutral-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-oswald text-2xl font-bold uppercase text-neutral-300">
              Your cart is empty
            </p>
            <Link
              href="/products"
              onClick={close}
              className="px-6 py-3 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <div className="w-20 h-24 bg-neutral-100 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-oswald text-sm font-semibold uppercase truncate">
                          {item.name}
                        </p>
                        {item.variantLabel && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.variantLabel}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formatPeso(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="text-neutral-400 hover:text-black text-xs shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        className="w-8 h-8 border border-neutral-300 hover:border-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        className="w-8 h-8 border border-neutral-300 hover:border-black transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <span className="ml-auto text-sm font-medium">
                        {formatPeso(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-neutral-200 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-oswald text-xl font-bold">
                  {formatPeso(subtotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Shipping is calculated upon order confirmation.
              </p>
              <div className="grid gap-2">
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full py-4 bg-black text-white text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
                >
                  Checkout
                </Link>
                <a
                  href={messengerUrl(
                    "https://m.me/profile.php?id=61575002625239",
                    orderMessageText({
                      id: "cart",
                      orderNumber: "Cart",
                      status: "pending",
                      items: items.map((item) => ({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        qty: item.qty,
                        variantId: item.variantId,
                        variantLabel: item.variantLabel,
                      })),
                      subtotal,
                      total: subtotal,
                      customer: {
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        city: "",
                        province: "",
                        zip: "",
                        notes: "",
                      },
                      paymentMethod: "gcash",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      history: [],
                    })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 border border-neutral-300 text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
                >
                  Order via Messenger
                </a>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
