import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  const file = join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}
loadEnvLocal();

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key text PRIMARY KEY,
  value text NOT NULL
);
CREATE TABLE IF NOT EXISTS business (
  id int PRIMARY KEY CHECK (id = 1),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  slug text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products (slug);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status);
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS reviews (
  id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'published',
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS faqs (
  id text PRIMARY KEY,
  sort_order int NOT NULL DEFAULT 0,
  data jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  order_number text NOT NULL,
  status text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key ON orders (order_number);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE TABLE IF NOT EXISTS media (
  id text PRIMARY KEY,
  url text NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size bigint NOT NULL,
  content bytea,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL
);
`;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
  process.exit(1);
}

const dataDir = process.env.DATA_DIR || join(process.cwd(), ".data");
const storeFile = join(dataDir, "store.json");
if (!existsSync(storeFile)) {
  console.error(`No store.json found at ${storeFile}`);
  process.exit(1);
}

const store = JSON.parse(readFileSync(storeFile, "utf8"));
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

const j = (value) => JSON.stringify(value);

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(SCHEMA);

    if (store.business) {
      await client.query(
        `INSERT INTO business (id, data, updated_at) VALUES (1, $1::jsonb, now())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        [j(store.business)]
      );
    }

    for (const [index, product] of (store.products ?? []).entries()) {
      await client.query(
        `INSERT INTO products (id, slug, status, data, created_at, updated_at, sort_order)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug,
           status = EXCLUDED.status,
           data = EXCLUDED.data,
           created_at = EXCLUDED.created_at,
           updated_at = EXCLUDED.updated_at,
           sort_order = EXCLUDED.sort_order`,
        [
          product.id,
          product.slug,
          product.status ?? "active",
          j(product),
          product.createdAt,
          product.updatedAt,
          index,
        ]
      );
    }

    for (const category of store.categories ?? []) {
      await client.query(
        `INSERT INTO categories (id, data, sort_order) VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, sort_order = EXCLUDED.sort_order`,
        [category.id, j(category), category.order ?? 0]
      );
    }

    for (const review of store.reviews ?? []) {
      await client.query(
        `INSERT INTO reviews (id, status, data, created_at)
         VALUES ($1, $2, $3::jsonb, $4)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           data = EXCLUDED.data,
           created_at = EXCLUDED.created_at`,
        [review.id, review.status ?? "published", j(review), review.createdAt]
      );
    }

    for (const faq of store.faqs ?? []) {
      await client.query(
        `INSERT INTO faqs (id, sort_order, data) VALUES ($1, $2, $3::jsonb)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, sort_order = EXCLUDED.sort_order`,
        [faq.id, faq.order ?? 0, j(faq)]
      );
    }

    for (const order of store.orders ?? []) {
      await client.query(
        `INSERT INTO orders (id, order_number, status, data, created_at)
         VALUES ($1, $2, $3, $4::jsonb, $5)
         ON CONFLICT (id) DO UPDATE SET
           order_number = EXCLUDED.order_number,
           status = EXCLUDED.status,
           data = EXCLUDED.data,
           created_at = EXCLUDED.created_at`,
        [order.id, order.orderNumber, order.status, j(order), order.createdAt]
      );
    }

    for (const item of store.media ?? []) {
      const content = readUpload(item);
      await client.query(
        `INSERT INTO media (id, url, filename, mime_type, size, content, data, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
         ON CONFLICT (id) DO UPDATE SET
           url = EXCLUDED.url,
           filename = EXCLUDED.filename,
           mime_type = EXCLUDED.mime_type,
           size = EXCLUDED.size,
           content = COALESCE(EXCLUDED.content, media.content),
           data = EXCLUDED.data,
           created_at = EXCLUDED.created_at`,
        [
          item.id,
          item.url,
          item.filename,
          item.mimeType,
          item.size,
          content,
          j(item),
          item.createdAt,
        ]
      );
    }

    const lastUpdated = store.lastUpdated || new Date().toISOString();
    await client.query(
      `INSERT INTO meta (key, value) VALUES ('lastUpdated', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [lastUpdated]
    );
    await client.query(
      `INSERT INTO meta (key, value) VALUES ('seeded', '1')
       ON CONFLICT (key) DO UPDATE SET value = '1'`
    );

    await client.query("COMMIT");
    console.log("Migration complete:", {
      products: (store.products ?? []).length,
      categories: (store.categories ?? []).length,
      reviews: (store.reviews ?? []).length,
      faqs: (store.faqs ?? []).length,
      orders: (store.orders ?? []).length,
      media: (store.media ?? []).length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

function readUpload(item) {
  const uploads = join(dataDir, "uploads");
  if (!existsSync(uploads)) return null;
  const ext = (item.url.split(".").pop() ?? "").toLowerCase();
  const candidates = [`${item.id}.${ext}`, item.id];
  for (const name of candidates) {
    const file = join(uploads, name);
    if (existsSync(file)) return readFileSync(file);
  }
  const files = readdirSync(uploads);
  const match = files.find((f) => f.startsWith(item.id));
  if (match) return readFileSync(join(uploads, match));
  return null;
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
