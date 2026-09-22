"use client";

import Link from "next/link";
import { formatPeso } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, subtotal, count, setQty, remove, ready } = useCart();

  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
          Your Bag
        </span>
        <h1 className="font-oswald text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-10">
          Cart {ready && count > 0 ? `(${count})` : ""}
        </h1>

        {!ready ? (
          <div className="py-24 text-center text-neutral-400 text-sm">Loading cart…</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border border-neutral-200">
            <p className="font-oswald text-3xl font-bold text-neutral-300 uppercase mb-5">
              Your cart is empty
            </p>
            <Link
              href="/products"
              className="inline-flex px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-5">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-5 p-4 border border-neutral-200 bg-white"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="w-24 h-28 bg-neutral-100 shrink-0 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-oswald text-lg font-bold uppercase hover:text-neutral-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.variantLabel}
                          </p>
                        )}
                        <p className="text-sm text-neutral-500 mt-1">
                          {formatPeso(item.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="text-xs text-neutral-400 hover:text-black tracking-widest uppercase transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="w-9 h-9 hover:bg-neutral-50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="w-9 h-9 hover:bg-neutral-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-oswald text-lg font-bold">
                        {formatPeso(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-28 h-fit border border-neutral-200 p-6 space-y-5">
              <h2 className="font-oswald text-lg font-bold uppercase tracking-widest">
                Order Summary
              </h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">{formatPeso(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-400 text-xs">Calculated on confirmation</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <span className="font-oswald text-sm uppercase tracking-widest">Total</span>
                <span className="font-oswald text-2xl font-bold">{formatPeso(subtotal)}</span>
              </div>

              <div className="grid gap-2">
                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-black text-white text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
                >
                  Proceed to Checkout
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
                <Link
                  href="/products"
                  className="block w-full py-3 text-center text-xs tracking-[0.15em] uppercase text-neutral-500 hover:text-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Payment options: GCash, Maya, bank transfer, or COD for select areas.
                Final shipping is confirmed via Messenger or phone.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
