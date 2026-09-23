"use client";

import { useEffect, useState } from "react";
import { formatDate, formatPeso } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function changeStatus(id: string, status: OrderStatus) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setMessage(`Order marked as ${status}.`);
        setTimeout(() => setMessage(""), 3000);
        load();
      } else {
        const data = await res.json().catch(() => null);
        setMessage(data?.error || "Failed to update order.");
        setTimeout(() => setMessage(""), 3000);
        load();
      }
    } catch {
      setMessage("Failed to update order.");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const filtered =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const counts = STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">Orders</h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Review incoming orders and update their status
        </p>
      </div>

      {message && (
        <div className="mb-5 px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All ({orders.length})
        </FilterButton>
        {STATUSES.map((status) => (
          <FilterButton
            key={status}
            active={filter === status}
            onClick={() => setFilter(status)}
          >
            {status} ({counts[status] ?? 0})
          </FilterButton>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 bg-white border border-neutral-200 text-center">
          <p className="font-oswald text-2xl font-bold text-neutral-300 uppercase">
            No orders {filter !== "all" ? `with status ${filter}` : "yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-neutral-200">
              <div className="p-5 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-oswald text-lg font-bold tracking-wide">
                      {order.orderNumber}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm mt-1">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    {formatDate(order.createdAt)} · {order.paymentMethod.toUpperCase()} ·{" "}
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <p className="font-oswald text-xl font-bold">{formatPeso(order.total)}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                    aria-label={`Status for ${order.orderNumber}`}
                    className="px-3 py-2 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-black uppercase tracking-wider"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="px-4 py-2 text-xs border border-neutral-300 hover:bg-neutral-50 tracking-widest uppercase"
                  >
                    {expanded === order.id ? "Hide" : "Details"}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-neutral-200 p-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                      Items
                    </h3>
                    <ul className="space-y-3">
                      {order.items.map((item, index) => (
                        <li key={`${item.productId}-${index}`} className="flex gap-3 text-sm">
                          <div className="w-12 h-14 bg-neutral-100 shrink-0 overflow-hidden">
                            {item.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            {item.variantLabel && (
                              <p className="text-xs text-neutral-500">{item.variantLabel}</p>
                            )}
                            <p className="text-xs text-neutral-500">
                              {item.qty} × {formatPeso(item.price)}
                            </p>
                          </div>
                          <span className="font-medium">
                            {formatPeso(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-neutral-200 text-sm flex justify-between">
                      <span className="text-neutral-500">Subtotal</span>
                      <span className="font-medium">{formatPeso(order.subtotal)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                      Customer
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex gap-3">
                        <dt className="text-neutral-400 w-20 shrink-0">Name</dt>
                        <dd>{order.customer.name}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="text-neutral-400 w-20 shrink-0">Phone</dt>
                        <dd>{order.customer.phone}</dd>
                      </div>
                      {order.customer.email && (
                        <div className="flex gap-3">
                          <dt className="text-neutral-400 w-20 shrink-0">Email</dt>
                          <dd>{order.customer.email}</dd>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <dt className="text-neutral-400 w-20 shrink-0">Address</dt>
                        <dd>
                          {order.customer.address}, {order.customer.city},{" "}
                          {order.customer.province} {order.customer.zip}
                        </dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="text-neutral-400 w-20 shrink-0">Payment</dt>
                        <dd className="uppercase">{order.paymentMethod}</dd>
                      </div>
                      {order.customer.notes && (
                        <div className="flex gap-3">
                          <dt className="text-neutral-400 w-20 shrink-0">Notes</dt>
                          <dd>{order.customer.notes}</dd>
                        </div>
                      )}
                    </dl>

                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mt-5 mb-3">
                      History
                    </h3>
                    <ul className="space-y-1.5 text-xs text-neutral-500">
                      {order.history.map((entry, index) => (
                        <li key={index}>
                          {entry.status} — {new Date(entry.at).toLocaleString("en-PH")}
                          {entry.note ? ` (${entry.note})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors ${
        active ? "bg-black text-white" : "bg-white border border-neutral-200 text-neutral-500 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}
