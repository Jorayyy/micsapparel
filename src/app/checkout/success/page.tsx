import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPeso, formatDateTime } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { getOrderById } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order: identifier } = await searchParams;
  if (!identifier) notFound();

  const order = getOrderById(identifier);
  if (!order) notFound();

  const messenger = messengerUrl(
    "https://m.me/profile.php?id=61575002625239",
    orderMessageText(order)
  );

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto bg-black text-white flex items-center justify-center mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Order Received
          </span>
          <h1 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
            Thank You!
          </h1>
          <p className="text-neutral-500 mt-4 text-sm max-w-md mx-auto">
            Your order has been saved. Confirm it on Messenger so we can lock in stock and
            shipping.
          </p>
        </div>

        <div className="border border-neutral-200">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <div>
              <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
                Order Number
              </p>
              <p className="font-oswald text-xl font-bold tracking-wide">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
                Status
              </p>
              <p className="font-oswald text-sm font-bold uppercase tracking-widest">
                {order.status}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4">
                <div className="w-16 h-20 bg-neutral-100 shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-oswald text-sm font-bold uppercase">{item.name}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-neutral-500 mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.qty} × {formatPeso(item.price)}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPeso(item.price * item.qty)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPeso(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-400 text-xs">Confirmed separately</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200">
                <span className="font-oswald uppercase tracking-widest text-sm">Total</span>
                <span className="font-oswald text-2xl font-bold">
                  {formatPeso(order.total)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 text-sm space-y-1.5">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest">Payment</span>
                <span className="uppercase text-xs font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest">Name</span>
                <span className="text-xs text-right">{order.customer.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest">Phone</span>
                <span className="text-xs text-right">{order.customer.phone}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest">Address</span>
                <span className="text-xs text-right">
                  {order.customer.address}, {order.customer.city}, {order.customer.province}{" "}
                  {order.customer.zip}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-400 text-xs uppercase tracking-widest">Placed</span>
                <span className="text-xs text-right">{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-neutral-200 grid sm:grid-cols-2 gap-3">
            <a
              href={messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 bg-black text-white text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Confirm on Messenger
            </a>
            <Link
              href="/products"
              className="py-4 border border-neutral-300 text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-6 leading-relaxed">
          Keep your order number: <strong>{order.orderNumber}</strong>. We&apos;ll contact
          you on {order.customer.phone} to confirm availability, shipping, and payment
          instructions.
        </p>
      </div>
    </section>
  );
}
