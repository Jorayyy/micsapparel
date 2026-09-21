import { NextRequest, NextResponse } from "next/server";
import { getContent, updateBusiness, updateProducts, updateTestimonials, updateFaqs } from "@/lib/content-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const content = getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, data } = body;

    switch (section) {
      case "business":
        updateBusiness(data);
        break;
      case "products":
        updateProducts(data);
        break;
      case "testimonials":
        updateTestimonials(data);
        break;
      case "faqs":
        updateFaqs(data);
        break;
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const content = getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
