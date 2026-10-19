# SKILLS.md — MicsApparel working notes

Repo playbook for future tasks. Keep this file updated when patterns, commands, or
data rules change. Read `AGENTS.md` first too (it has the Next.js warning block).

## 1. What this is

- Storefront + admin for **MicsApparel**, a streetwear brand in Tacloban City, PH.
- Next.js **16** App Router, React 19, TypeScript (strict), Tailwind CSS **v4**.
- PostgreSQL (Neon) is the source of truth. Data is mostly JSONB columns.
- Money and dates are **en-PH / PHP**.
- Deploys to Vercel from `main` (pushes auto-deploy).

## 2. Commands

```bash
npm install
npm run dev            # next dev (rewrites the AGENTS.md block below)
npm run lint           # eslint (next core-web-vitals + typescript)
npx tsc --noEmit       # typecheck; there is no "typecheck" script
npm run build          # production build; ensure DATABASE_URL is available
npm run migrate:neon   # one-off import of legacy .data/store.json
```

- No test framework, no CI, no test scripts. "Verified" means `npm run lint` +
  `npx tsc --noEmit` pass and the flow was checked manually in the browser.
- Windows + PowerShell environment. `rg` is not installed; use the editor's
  Grep tool / `Select-String`.

## 3. Environment

Copy `.env.example` → `.env.local`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | **Required.** Neon Postgres connection string (`sslmode=require`). |
| `ADMIN_PASSWORD` | Admin login. Required in production. Dev fallback: `micsapparel2024`. |
| `ADMIN_SESSION_SECRET` | Optional cookie-signing secret; derived from password if unset. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/sitemap (default `https://micsapparel.com`). |
| `DATA_DIR` | Legacy file-store path only used by `migrate:neon`. |

- Tables auto-create and catalog seeds on first request (`src/lib/db.ts`,
  `src/lib/store.ts`).
- Uploaded images live in Postgres (`media.content`), served from `/api/media/...`.
  Production does not rely on the local filesystem.
- Never commit `.env*`, `.data/`, or secrets.

## 4. Directory map

```
src/app/
  page.tsx, products/, collections/, cart/, checkout/, about/, faq/, contact/
  layout.tsx                 root layout: fonts, Providers, metadata, JSON-LD
  globals.css                Tailwind v4 entry + custom utilities
  admin/                     client admin pages; layout guards auth
    ui.tsx                   shared admin styles: cardCls, inputCls, btn*, PageHeader, Alert
    AdminShell.tsx           sidebar/nav (add new admin links here)
    products/page.tsx        filters + table + bulk edit drawer
  api/
    catalog/route.ts         public catalog snapshot
    orders/route.ts          public order creation
    admin/{products,categories,orders,reviews,content,upload,auth,check}/route.ts
    media/[id]/route.ts      serves image bytes from DB (or legacy files)
src/components/              storefront UI (Navbar, Footer, CartDrawer, ProductCard, ...)
src/data/business.ts         seed business/categories/faqs/reviews + re-export products
src/data/products.ts         seed products
src/lib/
  types.ts                   all domain types
  store.ts                   ALL data access (business/products/categories/reviews/faqs/media/orders)
  db.ts                      pool, schema, query(), withTransaction(), init/seed
  admin-auth.ts              session cookie, login throttling, isSameOrigin
  images.ts                  image URL validation + hint
  format.ts                  formatPeso / formatDate / formatDateTime
  site.ts, seo.ts, messenger.ts, content-context.tsx, cart-context.tsx
scripts/                     one-off node scripts (migration, seed cleanup)
```

## 5. Data layer rules

- Tables: `meta`, `business`, `products`, `categories`, `reviews`, `faqs`, `orders`, `media`.
- Most entity fields are inside a `data jsonb` column. A few are mirrored into
  real columns for querying: product `id/slug/status/sort_order`, order
  `id/order_number/status`, review `status`, category `sort_order`.
  **When changing a field that is mirrored, update both the column and the JSON.**
- Access data only through `src/lib/store.ts` (`getProducts`, `updateProduct`,
  `createOrder`, etc.). Don't write ad-hoc SQL in pages/routes.
- `query()` / `withTransaction()` call `initDb()` automatically. `withTransaction`
  is required for multi-row invariants (orders use `SELECT ... FOR UPDATE`).
- Writes call `touchLastUpdated()`, which updates `meta.lastUpdated`.
- No migration framework: add idempotent `CREATE TABLE IF NOT EXISTS` /
  `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements to `SCHEMA` in `db.ts`.
- Seeding runs once when `meta.seeded` is absent. Editing `src/data/*` does **not**
  update an already-seeded database. Use the admin UI (or a one-off script) for
  live data changes.
- `getBusiness()` merges the seed object with DB data, so newly added business
  fields appear on existing installs. Products/categories/reviews/FAQs do not
  get that treatment.

## 6. Domain rules

### Products

- `status`: `active | draft | archived`. Storefront `getProducts()` returns only
  active; admin uses `includeUnlisted: true`.
- `stock`: `null` means **not tracked** (always sellable). `lowStockAt` defaults
  to 5; low-stock UI uses `stock <= lowStockAt`.
- `variants`: `{ id, name, value, price, stock, sku }`; `price`/`stock` null mean
  inherit product values.
- `category` stores the category **slug**, not its id.
- `images`: array of URLs. First image is the thumbnail.
- Product slug is unique. `updateProduct` regenerates the slug whenever
  `name` or `slug` is present in the patch — pass the existing slug when editing
  other fields if you don't want it to change.
- `ProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string }`.

### Orders

- Public `POST /api/orders`; no online payment integration. Payment methods:
  `gcash | maya | bank | cod`.
- `createOrder` validates required customer fields, active status, quantities
  1–99, and stock; decrements product stock and matched variant stock inside one
  transaction. Order number format: `MA-YYMMDD-XXXX`.
- Statuses: `pending | confirmed | shipped | delivered | cancelled`; every change
  appends to `order.history`.

### Images

- `isValidImageUrl`: allows root-relative `/...`, `data:image/...`, http(s);
  rejects Facebook/Instagram page/post hosts. Use `imageUrlHint` in errors.
- Admin upload: `POST /api/admin/upload` (multipart `file`), max **8 MB**,
  types jpg/png/webp/gif/avif → stored in DB → URL `/api/media/<uuid>.<ext>`.
- Storefront rendering uses `ProductImage` (`next/image`, remote hosts allowed
  globally in `next.config.ts`). Admin pages use plain `<img>` with an eslint
  disable comment.

## 7. Auth and API conventions

- Admin pages are guarded by `src/app/admin/layout.tsx`:
  `isAdminAuthenticated()` or render `<AdminLogin />`.
- Admin API route pattern:

```ts
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ items: await getItems() });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  try {
    const body = await request.json();
    if (!body?.id) return NextResponse.json({ error: "Id required" }, { status: 400 });
    // validate inputs, call store function
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- Rule of thumb: **reads require auth; every mutation also requires same-origin.**
- Error shape is always `{ error: string }`; success returns the entity or
  `{ success: true }`.
- Admin UI is client-side (`"use client"`), fetches `/api/admin/...`, then
  `load()`s fresh data. Show errors via the page's `flash()` helper.
- Login: `POST /api/admin/auth`, logout: `DELETE /api/admin/auth`.
  Rate limit: 5 failures / 15 min per IP (in-memory).

## 8. UI conventions

### Admin

- Shared tokens live in `src/app/admin/ui.tsx` (`cardCls`, `inputCls`,
  `btnPrimary`, `btnSecondary`, `btnSmall`, `btnSmallDanger`, `chipCls`,
  `PageHeader`, `Alert`, `Card`). Prefer these for new admin pages.
- Add new admin sections to the `links` array in `AdminShell.tsx` (and an icon).
- Style: black/white/neutral, Oswald for headings (`font-oswald`), uppercase
  tracking on buttons/labels, `text-[13px]` nav, rounded-lg controls.
- Products page current behavior:
  - Search (name/slug/SKU), category/status filters, sort; selection applies to
    the **filtered** view.
  - Table rows with a `⋯` menu using native `<details>`; close it with
    `closeDetails()` before navigating/acting.
  - Bulk edit is a fixed right drawer, scope `selected | matching` (matching
    filters: category + current status), chunks 500 ids per request.
  - Selecting keeps ids in state across reloads; deleting clears them.
- Bulk endpoint `PATCH /api/admin/products/bulk`:
  `{ ids: string[], patch?: {...}, priceAdjust?: { mode: "percent" | "amount", value } }`
  whitelist: price, compareAtPrice, status, category, featured, isNew, stock,
  badge. Max 500 ids/request.

### Storefront

- Pages are server components with `export const dynamic = "force-dynamic"` and
  read from `@/lib/store`. Interactive islands are client components.
- `ClientLayout` wraps children in `ContentProvider` (business/faqs/categories)
  and `CartProvider`; hides Navbar/Footer/Cart/Messenger on `/admin`.
- Use `useContent()` and `useCart()` rather than prop-drilling.
- `ShopBrowser` is the reference for catalog filtering/sorting/pagination
  (URL params + client filtering).
- Formatting: use `formatPeso`, `formatDate`, `formatDateTime` from
  `@/lib/format` in new code (some older admin code inlines `toLocaleString`).
- Currency is PHP; dates en-PH. Never hardcode `$`.

## 9. Common recipes

### Add a field to Product (e.g. `material`)

1. `src/lib/types.ts` → add to `Product`.
2. `src/app/admin/products/page.tsx` → add to `EMPTY` and the editor form;
   include it in `handleSave` payload if it isn't spread automatically.
3. `src/app/api/admin/products/route.ts` → map it in `POST createProduct(...)`
   and extend `normalize()` if it needs coercion.
4. `src/lib/store.ts` → `createProduct` spreads `input`, so no change unless the
   field needs special handling.
5. `src/app/api/admin/products/bulk/route.ts` → whitelist it if bulk-editable.
6. Seed data `src/data/products.ts` must satisfy the type (add a default).
7. Display it where needed (product page/card/admin table).
8. `npm run lint` + `npx tsc --noEmit`.

### Add a new admin-managed entity

1. Add a table to `SCHEMA` in `src/lib/db.ts` (id + `data jsonb` + mirrored
   columns only if you need to query them).
2. Add types to `src/lib/types.ts`, CRUD functions to `src/lib/store.ts`,
   and include it in `getStoreSnapshot()` if storefront needs it.
3. Add `/api/admin/<entity>/route.ts` following the auth pattern.
4. Add `src/app/admin/<entity>/page.tsx` (client) and a nav link in `AdminShell`.
5. Seed initial rows in `store.ts#seedIfEmpty` only if a first-run default matters.

### Add or change an admin bulk action

1. Extend the whitelist + validation in `api/admin/products/bulk/route.ts`.
2. Add the field to the drawer UI in `admin/products/page.tsx`; only send keys
   that changed.
3. If the value is relative (percent/amount), compute it server-side against
   fresh data.
4. Keep the 500-id chunking and report partial failures.

### Change the database schema

- Edit `SCHEMA` in `src/lib/db.ts` with idempotent SQL. There is no down migration.
- Backfill existing rows explicitly if the new field can't be defaulted in code.
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` is the established pattern (see
  `orders.updated_at`).

## 10. Gotchas

- **Next 16**: `cookies()` and route `params` are async (`await cookies()`,
  `await context.params`). Before writing Next-specific code, read the relevant
  file under `node_modules/next/dist/docs/` (per `AGENTS.md`). `next dev`
  re-adds the AGENTS.md warning block; don't fight it.
- `updateProduct` slug regeneration (see Domain rules) — partial updates with
  `name` can change URLs.
- Products `PUT` is used for both full edits and single-field patches (e.g.
  featured toggle). It accepts partial input, not only complete products.
- `normalize()` only coerces string `price`, `compareAtPrice`, `stock`,
  `lowStockAt`; other numeric fields must already be numbers.
- Category slugs are foreign keys by convention. Renaming a slug orphans
  products until they're reassigned (bulk category change exists in the drawer).
- `deleteCategory` does not check for products.
- `/api/admin/content` is a section-based endpoint: `{ section: "business" | "faqs" | "reviews", data }`.
  FAQs are edited there; business content too.
- Reviews also have `/api/admin/reviews` + `/admin/reviews` (POST/PUT upsert, DELETE).
  `/api/admin/content` can upsert reviews too — keep both paths in mind.
- Media URLs are immutable-cached for a year; re-upload rather than overwrite.
- Microsoft/Windows line endings: git may warn about LF→CRLF; harmless.
- No comments in code unless they explain a non-obvious "why" (repo convention).
- Keep server components server-first; add `"use client"` only for interactivity.

## 11. QA checklist before saying "done"

- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] Admin flow tested: login, create/edit/delete, bulk action, error path.
- [ ] Storefront reflects the change (active products only).
- [ ] Mobile/narrow layout checked when touching tables, drawers, or filters.
- [ ] Stock/variant/order effects verified when touching products or checkout.
- [ ] Images validated (URL rules, upload size/type).
- [ ] No secrets or `.env` files staged.

## 12. Git / workflow

- Branch: `main`, remote `origin` (GitHub `Jorayyy/micsapparel`).
- Commit style: short imperative subject, e.g. `Add bulk edit for product price`.
- Only commit/push when explicitly asked. The user often says "pushhh" meaning
  stage the intended files, commit, and push in one go.
- Check `git status`/`git diff` first; never commit secrets or `.data`.
