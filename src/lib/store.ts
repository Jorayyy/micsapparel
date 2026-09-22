import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  business as seedBusiness,
  categories as seedCategories,
  faqs as seedFaqs,
  products as seedProducts,
  reviews as seedReviews,
} from "@/data/business";
import type {
  Business,
  Category,
  Faq,
  MediaItem,
  Order,
  OrderCustomer,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductVariant,
  Review,
  StoreData,
} from "@/lib/types";

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"] as const;
const LEGACY_IMAGE_NAMES: Record<string, string[]> = {
  "classic-snapback": ["snapback"],
};

export function dataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  // Vercel/serverless: project dir is read-only; /tmp is writable per instance.
  if (process.env.VERCEL || process.env.NEXT_PHASE === "phase-production-build") {
    return join("/tmp", "micsapparel-data");
  }
  return join(process.cwd(), ".data");
}

function storeFile(): string {
  return join(dataDir(), "store.json");
}

export function uploadsDir(): string {
  return join(dataDir(), "uploads");
}

function seed(): StoreData {
  return {
    business: structuredClone(seedBusiness),
    products: structuredClone(seedProducts),
    categories: structuredClone(seedCategories),
    reviews: structuredClone(seedReviews),
    faqs: structuredClone(seedFaqs),
    orders: [],
    media: [],
    lastUpdated: new Date().toISOString(),
  };
}

let cache: StoreData | null = null;
let cacheMtime = -1;

function load(): StoreData {
  if (cache && cacheMtime === -2) return cache;
  const file = storeFile();
  try {
    const st = statSync(file);
    if (cache && cacheMtime === st.mtimeMs) return cache;
    const raw = JSON.parse(readFileSync(file, "utf8")) as Partial<StoreData>;
    const merged: StoreData = { ...seed(), ...raw };
    cache = merged;
    cacheMtime = st.mtimeMs;
    return merged;
  } catch {
    if (cache) return cache;
    const fresh = seed();
    cache = fresh;
    cacheMtime = -2;
    persist(fresh);
    return fresh;
  }
}

function persist(data: StoreData): void {
  cache = data;
  try {
    mkdirSync(dataDir(), { recursive: true });
    const file = storeFile();
    writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    try {
      cacheMtime = statSync(file).mtimeMs;
    } catch {
      cacheMtime = -2;
    }
  } catch {
    // Read-only FS (e.g. failed /tmp): keep in-memory cache only.
    cacheMtime = -2;
  }
}

function mutate<T>(fn: (data: StoreData) => T): T {
  const data = load();
  const result = fn(data);
  data.lastUpdated = new Date().toISOString();
  persist(data);
  return result;
}

function findLocalImage(candidates: string[]): string | null {
  const dir = join(process.cwd(), "public", "images");
  for (const name of candidates) {
    for (const ext of IMAGE_EXTS) {
      const file = join(dir, `${name}.${ext}`);
      if (existsSync(file)) return `/images/${name}.${ext}`;
    }
  }
  return null;
}

function resolveImages(product: Product): Product {
  const names = [product.slug, ...(LEGACY_IMAGE_NAMES[product.slug] ?? [])];
  const local = findLocalImage(names);
  if (!local) return product;
  const rest = product.images.filter(
    (img) => img !== local && !img.startsWith("/images/")
  );
  return { ...product, images: [local, ...rest] };
}

export function productImage(product: Product): string {
  return product.images[0] ?? "";
}

export function isProductAvailable(product: Product): boolean {
  return product.status === "active" && (product.stock === null || product.stock > 0);
}

// --- Business ---

export function getBusiness(): Business {
  return load().business;
}

export function updateBusiness(patch: Partial<Business>): Business {
  return mutate((data) => {
    data.business = {
      ...data.business,
      ...patch,
      contact: { ...data.business.contact, ...(patch.contact ?? {}) },
      social: { ...data.business.social, ...(patch.social ?? {}) },
      stats: { ...data.business.stats, ...(patch.stats ?? {}) },
      location: { ...data.business.location, ...(patch.location ?? {}) },
      hours: { ...data.business.hours, ...(patch.hours ?? {}) },
      owner: { ...data.business.owner, ...(patch.owner ?? {}) },
    };
    return data.business;
  });
}

// --- Products ---

export function getProducts(options?: { includeUnlisted?: boolean }): Product[] {
  const products = load().products.map(resolveImages);
  if (options?.includeUnlisted) return products;
  return products.filter((p) => p.status === "active");
}

export function getProductBySlug(slug: string): Product | null {
  const found = load().products.find((p) => p.slug === slug);
  return found ? resolveImages(found) : null;
}

export function getProductById(id: string): Product | null {
  const found = load().products.find((p) => p.id === id);
  return found ? resolveImages(found) : null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUniqueSlug(base: string, ignoreId?: string): string {
  const products = load().products;
  let slug = base || "product";
  let n = 2;
  while (products.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export type ProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> & {
  slug?: string;
};

export function createProduct(input: ProductInput): Product {
  return mutate((data) => {
    const now = new Date().toISOString();
    const slug = ensureUniqueSlug(slugify(input.slug || input.name));
    const product: Product = {
      ...input,
      id: `prod_${randomUUID()}`,
      slug,
      createdAt: now,
      updatedAt: now,
    };
    data.products.push(product);
    return product;
  });
}

export function updateProduct(id: string, patch: Partial<ProductInput>): Product | null {
  return mutate((data) => {
    const index = data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const current = data.products[index];
    const next: Product = { ...current, ...patch, updatedAt: new Date().toISOString() };
    if (patch.slug !== undefined || patch.name !== undefined) {
      const desired = slugify(patch.slug || patch.name || current.slug);
      next.slug = ensureUniqueSlug(desired || current.slug, id);
    }
    data.products[index] = next;
    return next;
  });
}

export function deleteProduct(id: string): boolean {
  return mutate((data) => {
    const before = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    return data.products.length !== before;
  });
}

// --- Categories ---

export function getCategories(options?: { includeHidden?: boolean }): Category[] {
  const categories = [...load().categories].sort((a, b) => a.order - b.order);
  if (options?.includeHidden) return categories;
  return categories.filter((c) => c.status === "active");
}

export function getCategoryBySlug(slug: string): Category | null {
  return load().categories.find((c) => c.slug === slug) ?? null;
}

export type CategoryInput = Omit<Category, "id"> & { id?: string };

export function createCategory(input: CategoryInput): Category {
  return mutate((data) => {
    const category: Category = {
      ...input,
      id: input.id || `cat_${randomUUID()}`,
    };
    data.categories.push(category);
    return category;
  });
}

export function updateCategory(id: string, patch: Partial<CategoryInput>): Category | null {
  return mutate((data) => {
    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    data.categories[index] = { ...data.categories[index], ...patch, id };
    return data.categories[index];
  });
}

export function deleteCategory(id: string): boolean {
  return mutate((data) => {
    const before = data.categories.length;
    data.categories = data.categories.filter((c) => c.id !== id);
    return data.categories.length !== before;
  });
}

// --- Reviews ---

export function getReviews(options?: { includeHidden?: boolean }): Review[] {
  const reviews = [...load().reviews].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  if (options?.includeHidden) return reviews;
  return reviews.filter((r) => r.status === "published");
}

export type ReviewInput = Omit<Review, "id" | "createdAt"> & { id?: string };

export function upsertReview(input: ReviewInput): Review {
  return mutate((data) => {
    if (input.id) {
      const index = data.reviews.findIndex((r) => r.id === input.id);
      if (index !== -1) {
        data.reviews[index] = { ...data.reviews[index], ...input, id: input.id };
        return data.reviews[index];
      }
    }
    const review: Review = {
      ...input,
      id: input.id || `rev_${randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    data.reviews.unshift(review);
    return review;
  });
}

export function deleteReview(id: string): boolean {
  return mutate((data) => {
    const before = data.reviews.length;
    data.reviews = data.reviews.filter((r) => r.id !== id);
    return data.reviews.length !== before;
  });
}

// --- FAQs ---

export function getFaqs(): Faq[] {
  return [...load().faqs].sort((a, b) => a.order - b.order);
}

export function setFaqs(faqs: Faq[]): Faq[] {
  return mutate((data) => {
    data.faqs = faqs.map((faq, index) => ({
      ...faq,
      id: faq.id || `faq_${randomUUID()}`,
      order: faq.order || index + 1,
    }));
    return data.faqs;
  });
}

// --- Media ---

export function getMedia(): MediaItem[] {
  return [...load().media].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addMedia(item: Omit<MediaItem, "createdAt">): MediaItem {
  return mutate((data) => {
    const media: MediaItem = { ...item, createdAt: new Date().toISOString() };
    data.media.unshift(media);
    return media;
  });
}

export function deleteMedia(id: string): boolean {
  return mutate((data) => {
    const before = data.media.length;
    data.media = data.media.filter((m) => m.id !== id);
    return data.media.length !== before;
  });
}

export function getMediaById(id: string): MediaItem | null {
  return load().media.find((m) => m.id === id) ?? null;
}

// --- Orders ---

export function getOrders(): Order[] {
  return [...load().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderById(id: string): Order | null {
  return load().orders.find((o) => o.id === id || o.orderNumber === id) ?? null;
}

export type OrderDraft = {
  items: { productId: string; qty: number; variantId?: string | null }[];
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
};

export type CreateOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

function makeOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomUUID().replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase();
  return `MA-${y}${m}${d}-${suffix}`;
}

export function createOrder(draft: OrderDraft): CreateOrderResult {
  if (!draft.items.length) return { ok: false, error: "Your cart is empty." };

  const required: (keyof OrderCustomer)[] = ["name", "phone", "address", "city", "province"];
  for (const field of required) {
    if (!draft.customer[field]?.trim()) {
      return { ok: false, error: `Missing required field: ${field}` };
    }
  }

  const data = load();
  const items: OrderItem[] = [];
  const qtyByProduct = new Map<string, number>();

  for (const line of draft.items) {
    const qty = Math.floor(line.qty);
    if (!qty || qty < 1 || qty > 99) {
      return { ok: false, error: "Invalid quantity." };
    }
    const product = data.products.find((p) => p.id === line.productId);
    if (!product) return { ok: false, error: "A product in your cart no longer exists." };
    if (product.status !== "active") {
      return { ok: false, error: `${product.name} is no longer available.` };
    }

    let variant: ProductVariant | null = null;
    if (line.variantId) {
      variant = product.variants.find((v) => v.id === line.variantId) ?? null;
      if (!variant) {
        return { ok: false, error: `${product.name} option is no longer available.` };
      }
    }

    const resolved = resolveImages(product);
    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: resolved.images[0] ?? "",
      price: variant?.price ?? product.price,
      qty,
      variantId: variant?.id ?? null,
      variantLabel: variant ? `${variant.name}: ${variant.value}` : null,
    });

    qtyByProduct.set(product.id, (qtyByProduct.get(product.id) ?? 0) + qty);
    if (variant && variant.stock !== null) {
      if (variant.stock < qty) {
        return {
          ok: false,
          error: `Not enough stock for ${product.name} (${variant.value}).`,
        };
      }
    }
  }

  for (const [productId, qty] of qtyByProduct) {
    const product = data.products.find((p) => p.id === productId);
    if (!product) continue;
    if (product.stock !== null && product.stock < qty) {
      return { ok: false, error: `Not enough stock for ${product.name}.` };
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord_${randomUUID()}`,
    orderNumber: makeOrderNumber(),
    status: "pending",
    items,
    subtotal,
    total: subtotal,
    customer: {
      name: draft.customer.name.trim(),
      email: draft.customer.email?.trim() ?? "",
      phone: draft.customer.phone.trim(),
      address: draft.customer.address.trim(),
      city: draft.customer.city.trim(),
      province: draft.customer.province.trim(),
      zip: draft.customer.zip?.trim() ?? "",
      notes: draft.customer.notes?.trim() ?? "",
    },
    paymentMethod: draft.paymentMethod,
    createdAt: now,
    updatedAt: now,
    history: [{ status: "pending", at: now }],
  };

  mutate((store) => {
    for (const [productId, qty] of qtyByProduct) {
      const product = store.products.find((p) => p.id === productId);
      if (product && product.stock !== null) {
        product.stock = Math.max(0, product.stock - qty);
      }
      if (product) {
        for (const line of items.filter((i) => i.productId === productId)) {
          if (!line.variantId) continue;
          const variant = product.variants.find((v) => v.id === line.variantId);
          if (variant && variant.stock !== null) {
            variant.stock = Math.max(0, variant.stock - line.qty);
          }
        }
      }
    }
    store.orders.push(order);
  });

  return { ok: true, order };
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Order | null {
  return mutate((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return null;
    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;
    order.history.push({ status, at: now, ...(note ? { note } : {}) });
    return order;
  });
}

// --- Store snapshot ---

export function getStoreSnapshot(): StoreData {
  return load();
}
