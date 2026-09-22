import { Pool, type PoolClient, type QueryResultRow } from "pg";

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

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Add it to .env.local (or Vercel project settings). See .env.example."
      );
    }
    pool = new Pool({
      connectionString,
      max: 10,
      ssl: connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return pool;
}

export async function initDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(727271)");
        await client.query(SCHEMA);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        initPromise = null;
        throw err;
      } finally {
        client.release();
      }
    })();
    initPromise.catch(() => {
      initPromise = null;
    });
  }
  await initPromise;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  await initDb();
  const result = await getPool().query<T>(text, params as never[]);
  return result.rows;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  await initDb();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export function toJson(value: unknown): string {
  return JSON.stringify(value);
}

export function fromJson<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  if (value && typeof value === "object") return value as T;
  throw new Error("Expected JSON value from database");
}
