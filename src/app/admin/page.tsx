import Link from "next/link";
import { getOrders, getProducts, getCategories, getReviews, getMedia } from "@/lib/store";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

const cards = [
  { href: "/admin/orders", label: "Orders", desc: "Process and update order status" },
  { href: "/admin/products", label: "Products", desc: "Add, edit, price, and stock" },
  { href: "/admin/categories", label: "Categories", desc: "Organize your catalog" },
  { href: "/admin/reviews", label: "Reviews", desc: "Publish and manage reviews" },
  { href: "/admin/content", label: "Content", desc: "Business info, FAQs" },
  { href: "/admin/media", label: "Media", desc: "Upload and manage images" },
  { href: "/admin/logo", label: "Logo", desc: "Update the brand logo" },
];

export default function AdminDashboard() {
  const orders = getOrders();
  const products = getProducts({ includeUnlisted: true });
  const categories = getCategories({ includeHidden: true });
  const reviews = getReviews({ includeHidden: true });
  const media = getMedia();

  const pending = orders.filter((o) => o.status === "pending");
  const lowStock = products.filter(
    (p) => p.status === "active" && p.stock !== null && p.stock <= p.lowStockAt
  );
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: String(orders.length) },
    { label: "Pending Orders", value: String(pending.length) },
    { label: "Products", value: String(products.length) },
    { label: "Active Revenue", value: formatPeso(revenue) },
  ];

  return (
    <div>
      <div className="mb-9">
        <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="text-neutral-500 mt-2 text-sm">Manage your MicsApparel store</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-neutral-200 p-5">
            <p className="text-neutral-400 text-[10px] tracking-[0.2em] uppercase mb-1.5">
              {stat.label}
            </p>
            <p className="font-oswald text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="p-6 bg-white border border-neutral-200 hover:border-black hover:shadow-sm transition-all group"
          >
            <h2 className="font-oswald text-lg font-bold uppercase tracking-wide group-hover:text-neutral-600 transition-colors">
              {card.label}
            </h2>
            <p className="text-neutral-500 text-sm mt-1.5">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase mb-4">
            Recent Orders
          </h3>
          {orders.length === 0 ? (
            <p className="text-neutral-400 text-sm">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium">{formatPeso(order.total)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                      {order.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {orders.length > 0 && (
            <Link
              href="/admin/orders"
              className="inline-block mt-4 text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors"
            >
              View all orders →
            </Link>
          )}
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-oswald text-xs font-bold text-neutral-400 tracking-[0.2em] uppercase mb-4">
            Store Health
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-neutral-500">Categories</span>
              <span className="font-medium">{categories.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-500">Reviews</span>
              <span className="font-medium">{reviews.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-500">Media files</span>
              <span className="font-medium">{media.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-500">Low stock items</span>
              <span className={`font-medium ${lowStock.length ? "text-red-600" : ""}`}>
                {lowStock.length}
              </span>
            </li>
          </ul>
          {lowStock.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                Needs attention
              </p>
              <ul className="space-y-1">
                {lowStock.slice(0, 5).map((product) => (
                  <li key={product.id} className="text-xs text-neutral-600">
                    {product.name} — {product.stock} left
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-xs text-neutral-400">
        <p>
          Data is stored in <code className="text-neutral-500">.data/store.json</code> on
          the server. Set <code className="text-neutral-500">ADMIN_PASSWORD</code> in
          production environment variables.
        </p>
      </div>
    </div>
  );
}
