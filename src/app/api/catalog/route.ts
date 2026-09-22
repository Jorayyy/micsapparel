import { NextResponse } from "next/server";
import { getBusiness, getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [business, categories, products] = await Promise.all([
    getBusiness(),
    getCategories(),
    getProducts(),
  ]);
  return NextResponse.json({
    business,
    categories,
    products,
    lastUpdated: new Date().toISOString(),
  });
}
