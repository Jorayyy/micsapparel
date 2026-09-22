import type { Order, Product } from "@/lib/types";
import { formatPeso } from "@/lib/format";

const SITE_BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://micsapparel.com"
).replace(/\/+$/, "");

export function messengerUrl(base: string, text: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(text)}`;
}

export function productInquiryText(product: Product): string {
  return `Hi MicsApparel! I'm interested in the ${product.name} (${
    formatPeso(product.price)
  }). Is it still available? ${`${SITE_BASE}/products/${product.slug}`}`;
}

export function orderMessageText(order: Order): string {
  const lines: string[] = [
    `Hi MicsApparel! I'd like to confirm my order.`,
    ``,
    `Order #: ${order.orderNumber}`,
    ``,
    `Items:`,
    ...order.items.map(
      (item) =>
        `- ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} x${item.qty} — ${formatPeso(
          item.price * item.qty
        )}`
    ),
    ``,
    `Subtotal: ${formatPeso(order.subtotal)}`,
    `Shipping: calculated upon confirmation`,
    `Payment: ${order.paymentMethod.toUpperCase()}`,
    ``,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.province} ${
      order.customer.zip
    }`.trim(),
  ];
  if (order.customer.notes) {
    lines.push(`Notes: ${order.customer.notes}`);
  }
  return lines.join("\n");
}
