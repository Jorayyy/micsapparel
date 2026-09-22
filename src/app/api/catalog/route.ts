import { NextResponse } from "next/server";
import { getBusiness, getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    business: getBusiness(),
    categories: getCategories(),
    products: getProducts(),
    lastUpdated: new Date().toISOString(),
  });
}
