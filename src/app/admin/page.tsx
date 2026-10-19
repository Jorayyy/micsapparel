import Link from "next/link";
import { getOrders, getProducts, getCategories, getReviews, getMedia } from "@/lib/store";
import { formatPeso } from "@/lib/format";
import { cardCls, PageHeader } from "./ui";

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

export default async function AdminDashboard() {
  const [orders, products, categories, reviews, media] = await Promise.all([
    getOrders(),
    getProducts({ includeUnlisted: true }),
    getCategories({ includeHidden: true }),
    getReviews({ includeHidden: true }),
    getMedia(),
  ]);

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
      <PageHeader title="Dashboard" subtitle="Manage your MicsApparel store" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${cardCls} p-5`}>
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
            className={`${cardCls} p-6 hover:border-black hover:shadow-sm transition-all group`}
          >
            <h2 className="font-oswald text-lg font-bold uppercase tracking-wide group-hover:text-neutral-600 transition-colors">
              {card.label}
            </h2>
            <p className="text-neutral-500 text-sm mt-1.5">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className={`${cardCls} p-6`}>
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

    </div>
  );
}
