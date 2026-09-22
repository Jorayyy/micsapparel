import { readFileSync } from "node:fs";
import { Client } from "pg";
import { products } from "../src/data/products.ts";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i)] = line.slice(i + 1);
}

const SMOKE_ID = "prod_f6e02898-c8e2-4214-ab46-6e14691d1d5c";

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  const ref = await client.query(
    "SELECT count(*)::int as n FROM orders WHERE data::text LIKE $1",
    [`%${SMOKE_ID}%`]
  );
  if (ref.rows[0].n === 0) {
    const del = await client.query("DELETE FROM products WHERE id = $1", [SMOKE_ID]);
    console.log(del.rowCount ? "removed smoke-test product" : "smoke-test product already gone");
  } else {
    console.log("smoke-test product referenced by orders, left in place");
  }
} catch (e) {
  console.log("smoke-test cleanup skipped:", e.message);
}

const existing = await client.query("SELECT id FROM products");
const have = new Set(existing.rows.map((r) => r.id));
const max = await client.query("SELECT COALESCE(MAX(sort_order), 0)::int as m FROM products");
let sortOrder = max.rows[0].m;

let inserted = 0;
for (const product of products) {
  if (have.has(product.id)) continue;
  sortOrder += 1;
  await client.query(
    `INSERT INTO products (id, slug, status, data, created_at, updated_at, sort_order)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
     ON CONFLICT (id) DO NOTHING`,
    [
      product.id,
      product.slug,
      product.status,
      JSON.stringify(product),
      product.createdAt,
      product.updatedAt,
      sortOrder,
    ]
  );
  inserted += 1;
}

await client.query(
  `INSERT INTO meta (key, value) VALUES ('lastUpdated', $1)
   ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
  [new Date().toISOString()]
);

const counts = await client.query(
  `SELECT data->>'category' as category, count(*)::int as n
   FROM products WHERE status = 'active'
   GROUP BY 1 ORDER BY 1`
);
console.log(`inserted ${inserted} new products`);
console.log(counts.rows.map((r) => `${r.category}: ${r.n}`).join("\n"));
const total = await client.query("SELECT count(*)::int as n FROM products");
console.log("total:", total.rows[0].n);
await client.end();
