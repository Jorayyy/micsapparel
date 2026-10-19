import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import { getProductById, updateProduct, type ProductInput } from "@/lib/store";
import type { ProductStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: ProductStatus[] = ["active", "draft", "archived"];

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      ids?: unknown;
      patch?: Record<string, unknown>;
      priceAdjust?: { mode?: unknown; value?: unknown };
    };

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json({ error: "Product ids required" }, { status: 400 });
    }
    if (body.ids.length > 500) {
      return NextResponse.json({ error: "Too many products (max 500)" }, { status: 400 });
    }

    const ids = body.ids.filter(
      (id): id is string => typeof id === "string" && id.length > 0
    );
    if (ids.length !== body.ids.length) {
      return NextResponse.json({ error: "Invalid product ids" }, { status: 400 });
    }

    const raw = body.patch ?? {};
    const patch: Partial<ProductInput> = {};

    if (raw.price !== undefined) {
      if (typeof raw.price !== "number" || !Number.isFinite(raw.price) || raw.price < 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      patch.price = raw.price;
    }
    if (raw.compareAtPrice !== undefined) {
      if (
        raw.compareAtPrice !== null &&
        (typeof raw.compareAtPrice !== "number" ||
          !Number.isFinite(raw.compareAtPrice) ||
          raw.compareAtPrice < 0)
      ) {
        return NextResponse.json({ error: "Invalid compare-at price" }, { status: 400 });
      }
      patch.compareAtPrice = raw.compareAtPrice as number | null;
    }
    if (raw.status !== undefined) {
      if (!STATUSES.includes(raw.status as ProductStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      patch.status = raw.status as ProductStatus;
    }
    if (raw.category !== undefined) {
      if (typeof raw.category !== "string" || !raw.category) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      patch.category = raw.category;
    }
    if (raw.featured !== undefined) {
      if (typeof raw.featured !== "boolean") {
        return NextResponse.json({ error: "Invalid featured value" }, { status: 400 });
      }
      patch.featured = raw.featured;
    }
    if (raw.isNew !== undefined) {
      if (typeof raw.isNew !== "boolean") {
        return NextResponse.json({ error: "Invalid new value" }, { status: 400 });
      }
      patch.isNew = raw.isNew;
    }
    if (raw.stock !== undefined) {
      if (
        raw.stock !== null &&
        (typeof raw.stock !== "number" ||
          !Number.isFinite(raw.stock) ||
          raw.stock < 0 ||
          !Number.isInteger(raw.stock))
      ) {
        return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
      }
      patch.stock = raw.stock as number | null;
    }
    if (raw.badge !== undefined) {
      if (raw.badge !== null && typeof raw.badge !== "string") {
        return NextResponse.json({ error: "Invalid badge" }, { status: 400 });
      }
      patch.badge = raw.badge as string | null;
    }

    let priceAdjust: { mode: "percent" | "amount"; value: number } | undefined;
    if (body.priceAdjust && body.priceAdjust.mode !== undefined) {
      const { mode, value } = body.priceAdjust;
      if (mode !== "percent" && mode !== "amount") {
        return NextResponse.json({ error: "Invalid price adjustment" }, { status: 400 });
      }
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return NextResponse.json({ error: "Invalid price adjustment" }, { status: 400 });
      }
      if (patch.price !== undefined) {
        return NextResponse.json(
          { error: "Set a price or adjust it, not both" },
          { status: 400 }
        );
      }
      priceAdjust = { mode, value };
    }

    if (!priceAdjust && Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const failed: { id: string; error: string }[] = [];
    let updated = 0;

    for (const id of ids) {
      try {
        let next = patch;
        if (priceAdjust) {
          const current = await getProductById(id);
          if (!current) {
            failed.push({ id, error: "Not found" });
            continue;
          }
          const delta =
            priceAdjust.mode === "percent"
              ? current.price * (priceAdjust.value / 100)
              : priceAdjust.value;
          next = {
            ...patch,
            price: Math.max(0, Math.round((current.price + delta) * 100) / 100),
          };
        }
        const product = await updateProduct(id, next);
        if (!product) failed.push({ id, error: "Not found" });
        else updated += 1;
      } catch {
        failed.push({ id, error: "Update failed" });
      }
    }

    return NextResponse.json({ updated, failed });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
