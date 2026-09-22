import { existsSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  business as seedBusiness,
  categories as seedCategories,
  faqs as seedFaqs,
  products as seedProducts,
  reviews as seedReviews,
} from "@/data/business";
import { fromJson, initDb, query, toJson, withTransaction } from "@/lib/db";
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
  if (process.env.VERCEL || process.env.NEXT_PHASE === "phase-production-build") {
    return join("/tmp", "micsapparel-data");
  }
  return join(process.cwd(), ".data");
}

export function uploadsDir(): string {
  return join(dataDir(), "uploads");
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let readyPromise: Promise<void> | null = null;

async function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      await initDb();
      await seedIfEmpty();
    })();
    readyPromise.catch(() => {
      readyPromise = null;
    });
  }
  await readyPromise;
}

async function seedIfEmpty(): Promise<void> {
  await withTransaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(727272)");
    const { rows: flagRows } = await client.query<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'seeded'"
    );
    if (flagRows[0]?.value === "1") return;

    const now = new Date().toISOString();

    await client.query(
      "INSERT INTO business (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING",
      [toJson(seedBusiness)]
    );

    for (const [index, product] of seedProducts.entries()) {
      await client.query(
        `INSERT INTO products (id, slug, status, data, created_at, updated_at, sort_order)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.slug,
          product.status,
          toJson(product),
          product.createdAt,
          product.updatedAt,
          index,
        ]
      );
    }

    for (const category of seedCategories) {
      await client.query(
        `INSERT INTO categories (id, data, sort_order)
         VALUES ($1, $2::jsonb, $3) ON CONFLICT (id) DO NOTHING`,
        [category.id, toJson(category), category.order]
      );
    }

    for (const review of seedReviews) {
      await client.query(
        `INSERT INTO reviews (id, status, data, created_at)
         VALUES ($1, $2, $3::jsonb, $4) ON CONFLICT (id) DO NOTHING`,
        [review.id, review.status, toJson(review), review.createdAt]
      );
    }

    for (const faq of seedFaqs) {
      await client.query(
        `INSERT INTO faqs (id, sort_order, data)
         VALUES ($1, $2, $3::jsonb) ON CONFLICT (id) DO NOTHING`,
        [faq.id, faq.order, toJson(faq)]
      );
    }

    await client.query(
      `INSERT INTO meta (key, value) VALUES ('lastUpdated', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [now]
    );
    await client.query(
      `INSERT INTO meta (key, value) VALUES ('seeded', '1')
       ON CONFLICT (key) DO NOTHING`
    );
  });
}

async function touchLastUpdated(): Promise<void> {
  await query(
    `INSERT INTO meta (key, value) VALUES ('lastUpdated', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [new Date().toISOString()]
  );
}

// --- Business ---

export async function getBusiness(): Promise<Business> {
  await ensureReady();
  const rows = await query<{ data: unknown }>("SELECT data FROM business WHERE id = 1");
  if (rows[0]) return fromJson<Business>(rows[0].data);
  return structuredClone(seedBusiness);
}

export async function updateBusiness(patch: Partial<Business>): Promise<Business> {
  await ensureReady();
  const current = await getBusiness();
  const next: Business = {
    ...current,
    ...patch,
    contact: { ...current.contact, ...(patch.contact ?? {}) },
    social: { ...current.social, ...(patch.social ?? {}) },
    stats: { ...current.stats, ...(patch.stats ?? {}) },
    location: { ...current.location, ...(patch.location ?? {}) },
    hours: { ...current.hours, ...(patch.hours ?? {}) },
    owner: { ...current.owner, ...(patch.owner ?? {}) },
  };
  await query(
    `INSERT INTO business (id, data, updated_at) VALUES (1, $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [toJson(next)]
  );
  await touchLastUpdated();
  return next;
}

// --- Products ---

export async function getProducts(options?: {
  includeUnlisted?: boolean;
}): Promise<Product[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM products ORDER BY sort_order, created_at, slug"
  );
  const products = rows.map((row) => resolveImages(fromJson<Product>(row.data)));
  if (options?.includeUnlisted) return products;
  return products.filter((p) => p.status === "active");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM products WHERE slug = $1",
    [slug]
  );
  return rows[0] ? resolveImages(fromJson<Product>(rows[0].data)) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>("SELECT data FROM products WHERE id = $1", [
    id,
  ]);
  return rows[0] ? resolveImages(fromJson<Product>(rows[0].data)) : null;
}

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const rows = await query<{ id: string; slug: string }>("SELECT id, slug FROM products");
  let slug = base || "product";
  let n = 2;
  while (rows.some((row) => row.slug === slug && row.id !== ignoreId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export type ProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> & {
  slug?: string;
};

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureReady();
  const now = new Date().toISOString();
  const slug = await ensureUniqueSlug(slugify(input.slug || input.name));
  const rows = await query<{ next: string }>(
    "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM products"
  );
  const sortOrder = Number(rows[0]?.next ?? 1);
  const product: Product = {
    ...input,
    id: `prod_${randomUUID()}`,
    slug,
    createdAt: now,
    updatedAt: now,
  };
  await query(
    `INSERT INTO products (id, slug, status, data, created_at, updated_at, sort_order)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
    [product.id, product.slug, product.status, toJson(product), now, now, sortOrder]
  );
  await touchLastUpdated();
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>
): Promise<Product | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM products WHERE id = $1",
    [id]
  );
  if (!rows[0]) return null;
  const current = fromJson<Product>(rows[0].data);
  const next: Product = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (patch.slug !== undefined || patch.name !== undefined) {
    const desired = slugify(patch.slug || patch.name || current.slug);
    next.slug = await ensureUniqueSlug(desired || current.slug, id);
  }
  await query(
    `UPDATE products SET slug = $2, status = $3, data = $4::jsonb, updated_at = $5
     WHERE id = $1`,
    [next.id, next.slug, next.status, toJson(next), next.updatedAt]
  );
  await touchLastUpdated();
  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureReady();
  const rows = await query<{ id: string }>("DELETE FROM products WHERE id = $1 RETURNING id", [
    id,
  ]);
  if (rows.length > 0) await touchLastUpdated();
  return rows.length > 0;
}

// --- Categories ---

export async function getCategories(options?: {
  includeHidden?: boolean;
}): Promise<Category[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM categories ORDER BY sort_order, (data->>'name')"
  );
  const categories = rows.map((row) => fromJson<Category>(row.data));
  if (options?.includeHidden) return categories;
  return categories.filter((c) => c.status === "active");
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM categories WHERE data->>'slug' = $1",
    [slug]
  );
  return rows[0] ? fromJson<Category>(rows[0].data) : null;
}

export type CategoryInput = Omit<Category, "id"> & { id?: string };

export async function createCategory(input: CategoryInput): Promise<Category> {
  await ensureReady();
  const category: Category = {
    ...input,
    id: input.id || `cat_${randomUUID()}`,
  };
  await query(
    `INSERT INTO categories (id, data, sort_order) VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, sort_order = EXCLUDED.sort_order`,
    [category.id, toJson(category), category.order]
  );
  await touchLastUpdated();
  return category;
}

export async function updateCategory(
  id: string,
  patch: Partial<CategoryInput>
): Promise<Category | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM categories WHERE id = $1",
    [id]
  );
  if (!rows[0]) return null;
  const next: Category = { ...fromJson<Category>(rows[0].data), ...patch, id };
  await query(
    "UPDATE categories SET data = $2::jsonb, sort_order = $3 WHERE id = $1",
    [id, toJson(next), next.order]
  );
  await touchLastUpdated();
  return next;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await ensureReady();
  const rows = await query<{ id: string }>(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [id]
  );
  if (rows.length > 0) await touchLastUpdated();
  return rows.length > 0;
}

// --- Reviews ---

export async function getReviews(options?: {
  includeHidden?: boolean;
}): Promise<Review[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>("SELECT data FROM reviews");
  const reviews = rows
    .map((row) => fromJson<Review>(row.data))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (options?.includeHidden) return reviews;
  return reviews.filter((r) => r.status === "published");
}

export type ReviewInput = Omit<Review, "id" | "createdAt"> & { id?: string };

export async function upsertReview(input: ReviewInput): Promise<Review> {
  await ensureReady();
  if (input.id) {
    const rows = await query<{ data: unknown }>(
      "SELECT data FROM reviews WHERE id = $1",
      [input.id]
    );
    if (rows[0]) {
      const next: Review = { ...fromJson<Review>(rows[0].data), ...input, id: input.id };
      await query(
        "UPDATE reviews SET data = $2::jsonb, status = $3 WHERE id = $1",
        [input.id, toJson(next), next.status]
      );
      await touchLastUpdated();
      return next;
    }
  }
  const review: Review = {
    ...input,
    id: input.id || `rev_${randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
  await query(
    `INSERT INTO reviews (id, status, data, created_at) VALUES ($1, $2, $3::jsonb, $4)`,
    [review.id, review.status, toJson(review), review.createdAt]
  );
  await touchLastUpdated();
  return review;
}

export async function deleteReview(id: string): Promise<boolean> {
  await ensureReady();
  const rows = await query<{ id: string }>(
    "DELETE FROM reviews WHERE id = $1 RETURNING id",
    [id]
  );
  if (rows.length > 0) await touchLastUpdated();
  return rows.length > 0;
}

// --- FAQs ---

export async function getFaqs(): Promise<Faq[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM faqs ORDER BY sort_order, (data->>'question')"
  );
  return rows.map((row) => fromJson<Faq>(row.data));
}

export async function setFaqs(faqs: Faq[]): Promise<Faq[]> {
  await ensureReady();
  const normalized = faqs.map((faq, index) => ({
    ...faq,
    id: faq.id || `faq_${randomUUID()}`,
    order: faq.order || index + 1,
  }));
  await withTransaction(async (client) => {
    await client.query("DELETE FROM faqs");
    for (const faq of normalized) {
      await client.query(
        "INSERT INTO faqs (id, sort_order, data) VALUES ($1, $2, $3::jsonb)",
        [faq.id, faq.order, toJson(faq)]
      );
    }
  });
  await touchLastUpdated();
  return normalized;
}

// --- Media ---

export async function getMedia(): Promise<MediaItem[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM media ORDER BY created_at DESC"
  );
  return rows.map((row) => fromJson<MediaItem>(row.data));
}

export async function addMedia(
  item: Omit<MediaItem, "createdAt">,
  content?: Buffer
): Promise<MediaItem> {
  await ensureReady();
  const media: MediaItem = { ...item, createdAt: new Date().toISOString() };
  await query(
    `INSERT INTO media (id, url, filename, mime_type, size, content, data, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)`,
    [
      media.id,
      media.url,
      media.filename,
      media.mimeType,
      media.size,
      content ?? null,
      toJson(media),
      media.createdAt,
    ]
  );
  await touchLastUpdated();
  return media;
}

export async function deleteMedia(id: string): Promise<boolean> {
  await ensureReady();
  const rows = await query<{ id: string }>(
    "DELETE FROM media WHERE id = $1 RETURNING id",
    [id]
  );
  if (rows.length > 0) await touchLastUpdated();
  return rows.length > 0;
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>("SELECT data FROM media WHERE id = $1", [
    id,
  ]);
  return rows[0] ? fromJson<MediaItem>(rows[0].data) : null;
}

export async function getMediaContent(
  id: string
): Promise<{ item: MediaItem; content: Buffer | null } | null> {
  await ensureReady();
  const rows = await query<{ data: unknown; content: Buffer | null }>(
    "SELECT data, content FROM media WHERE id = $1",
    [id]
  );
  if (!rows[0]) return null;
  return { item: fromJson<MediaItem>(rows[0].data), content: rows[0].content };
}

// --- Orders ---

export async function getOrders(): Promise<Order[]> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM orders ORDER BY created_at DESC"
  );
  return rows.map((row) => fromJson<Order>(row.data));
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM orders WHERE id = $1 OR order_number = $1",
    [id]
  );
  return rows[0] ? fromJson<Order>(rows[0].data) : null;
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

export async function createOrder(draft: OrderDraft): Promise<CreateOrderResult> {
  if (!draft.items.length) return { ok: false, error: "Your cart is empty." };

  const required: (keyof OrderCustomer)[] = ["name", "phone", "address", "city", "province"];
  for (const field of required) {
    if (!draft.customer[field]?.trim()) {
      return { ok: false, error: `Missing required field: ${field}` };
    }
  }

  await ensureReady();

  const items: OrderItem[] = [];
  const qtyByProduct = new Map<string, number>();
  const stockUpdates = new Map<
    string,
    { product: Product; newStock: number | null; variantStocks: Map<string, number | null> }
  >();

  const productIds = [...new Set(draft.items.map((line) => line.productId))];

  const result = await withTransaction(async (client) => {
    const { rows } = await client.query<{ id: string; data: unknown }>(
      "SELECT id, data FROM products WHERE id = ANY($1::text[]) FOR UPDATE",
      [productIds]
    );
    const loaded = new Map<string, Product>(
      rows.map((row) => [row.id, fromJson<Product>(row.data)])
    );

    for (const line of draft.items) {
      const qty = Math.floor(line.qty);
      if (!qty || qty < 1 || qty > 99) {
        return { ok: false, error: "Invalid quantity." } as CreateOrderResult;
      }
      const product = loaded.get(line.productId);
      if (!product) {
        return {
          ok: false,
          error: "A product in your cart no longer exists.",
        } as CreateOrderResult;
      }
      if (product.status !== "active") {
        return {
          ok: false,
          error: `${product.name} is no longer available.`,
        } as CreateOrderResult;
      }

      let variant: ProductVariant | null = null;
      if (line.variantId) {
        variant = product.variants.find((v) => v.id === line.variantId) ?? null;
        if (!variant) {
          return {
            ok: false,
            error: `${product.name} option is no longer available.`,
          } as CreateOrderResult;
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

      if (!stockUpdates.has(product.id)) {
        stockUpdates.set(product.id, {
          product,
          newStock: product.stock,
          variantStocks: new Map(product.variants.map((v) => [v.id, v.stock])),
        });
      }
      const update = stockUpdates.get(product.id)!;

      if (variant && variant.stock !== null) {
        if (variant.stock < qty) {
          return {
            ok: false,
            error: `Not enough stock for ${product.name} (${variant.value}).`,
          } as CreateOrderResult;
        }
        const currentVariantStock = update.variantStocks.get(variant.id) ?? variant.stock;
        update.variantStocks.set(variant.id, Math.max(0, currentVariantStock - qty));
      }
    }

    for (const [productId, qty] of qtyByProduct) {
      const update = stockUpdates.get(productId);
      if (!update) continue;
      if (update.newStock !== null) {
        if (update.newStock < qty) {
          return {
            ok: false,
            error: `Not enough stock for ${update.product.name}.`,
          } as CreateOrderResult;
        }
        update.newStock = Math.max(0, update.newStock - qty);
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

    for (const update of stockUpdates.values()) {
      const next: Product = {
        ...update.product,
        stock: update.newStock,
        variants: update.product.variants.map((variant) => ({
          ...variant,
          stock: update.variantStocks.has(variant.id)
            ? update.variantStocks.get(variant.id)!
            : variant.stock,
        })),
        updatedAt: now,
      };
      await client.query(
        "UPDATE products SET data = $2::jsonb, updated_at = $3 WHERE id = $1",
        [next.id, toJson(next), now]
      );
    }

    await client.query(
      `INSERT INTO orders (id, order_number, status, data, created_at)
       VALUES ($1, $2, $3, $4::jsonb, $5)`,
      [order.id, order.orderNumber, order.status, toJson(order), order.createdAt]
    );
    await client.query(
      `INSERT INTO meta (key, value) VALUES ('lastUpdated', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [now]
    );

    return { ok: true, order } as CreateOrderResult;
  });

  return result;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order | null> {
  await ensureReady();
  const rows = await query<{ data: unknown }>(
    "SELECT data FROM orders WHERE id = $1",
    [id]
  );
  if (!rows[0]) return null;
  const order = fromJson<Order>(rows[0].data);
  const now = new Date().toISOString();
  order.status = status;
  order.updatedAt = now;
  order.history.push({ status, at: now, ...(note ? { note } : {}) });
  await query(
    "UPDATE orders SET status = $2, data = $3::jsonb, updated_at = $4 WHERE id = $1",
    [order.id, order.status, toJson(order), now]
  );
  await touchLastUpdated();
  return order;
}

// --- Store snapshot ---

export async function getStoreSnapshot(): Promise<StoreData> {
  await ensureReady();
  const [business, productRows, categoryRows, reviewRows, faqRows, orderRows, mediaRows, metaRows] =
    await Promise.all([
      getBusiness(),
      query<{ data: unknown }>(
        "SELECT data FROM products ORDER BY sort_order, created_at, slug"
      ),
      query<{ data: unknown }>(
        "SELECT data FROM categories ORDER BY sort_order, (data->>'name')"
      ),
      query<{ data: unknown }>("SELECT data FROM reviews"),
      query<{ data: unknown }>("SELECT data FROM faqs ORDER BY sort_order"),
      query<{ data: unknown }>("SELECT data FROM orders ORDER BY created_at DESC"),
      query<{ data: unknown }>("SELECT data FROM media ORDER BY created_at DESC"),
      query<{ value: string }>("SELECT value FROM meta WHERE key = 'lastUpdated'"),
    ]);

  return {
    business,
    products: productRows.map((row) => fromJson<Product>(row.data)),
    categories: categoryRows.map((row) => fromJson<Category>(row.data)),
    reviews: reviewRows.map((row) => fromJson<Review>(row.data)),
    faqs: faqRows.map((row) => fromJson<Faq>(row.data)),
    orders: orderRows.map((row) => fromJson<Order>(row.data)),
    media: mediaRows.map((row) => fromJson<MediaItem>(row.data)),
    lastUpdated: metaRows[0]?.value ?? new Date().toISOString(),
  };
}
