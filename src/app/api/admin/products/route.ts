import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductInput,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ products: getProducts({ includeUnlisted: true }) });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const input = (await request.json()) as ProductInput;
    if (!input?.name || typeof input.price !== "number") {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }
    const normalized = normalize(input);
    const product = createProduct({
      name: normalized.name ?? "",
      price: normalized.price ?? 0,
      compareAtPrice: normalized.compareAtPrice ?? null,
      description: normalized.description ?? "",
      features: normalized.features ?? [],
      category: normalized.category ?? "caps",
      images: normalized.images ?? [],
      sku: normalized.sku ?? null,
      status: normalized.status ?? "active",
      featured: normalized.featured ?? false,
      isNew: normalized.isNew ?? false,
      badge: normalized.badge ?? null,
      stock: normalized.stock ?? null,
      lowStockAt: normalized.lowStockAt ?? 5,
      variants: normalized.variants ?? [],
      slug: normalized.slug,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const body = (await request.json()) as { id?: string } & ProductInput;
    if (!body?.id) {
      return NextResponse.json({ error: "Product id required" }, { status: 400 });
    }
    const { id, ...patch } = body;
    const product = updateProduct(id, normalize(patch));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const body = (await request.json()) as { id?: string };
    if (!body?.id) {
      return NextResponse.json({ error: "Product id required" }, { status: 400 });
    }
    const removed = deleteProduct(body.id);
    if (!removed) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function normalize(input: Partial<ProductInput>): Partial<ProductInput> {
  const out: Partial<ProductInput> = { ...input };
  if (typeof out.price === "string") out.price = Number(out.price);
  if (typeof out.compareAtPrice === "string") {
    out.compareAtPrice = out.compareAtPrice === "" ? null : Number(out.compareAtPrice);
  }
  if (typeof out.stock === "string") {
    out.stock = out.stock === "" ? null : Number(out.stock);
  }
  if (typeof out.lowStockAt === "string") out.lowStockAt = Number(out.lowStockAt);
  if (Array.isArray(out.images)) out.images = out.images.filter(Boolean);
  if (Array.isArray(out.features)) out.features = out.features.filter(Boolean);
  if (Array.isArray(out.variants)) out.variants = out.variants.filter(Boolean);
  return out;
}
