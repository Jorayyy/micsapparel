import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import {
  getBusiness,
  getFaqs,
  getReviews,
  setFaqs,
  updateBusiness,
  upsertReview,
} from "@/lib/store";
import type { Business, Faq, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    business: getBusiness(),
    faqs: getFaqs(),
    reviews: getReviews({ includeHidden: true }),
  });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { section, data } = body as {
      section?: string;
      data?: unknown;
    };

    switch (section) {
      case "business": {
        const patch = data as Partial<Business>;
        updateBusiness(patch);
        break;
      }
      case "faqs": {
        if (!Array.isArray(data)) throw new Error("Invalid FAQs");
        setFaqs(data as Faq[]);
        break;
      }
      case "reviews": {
        if (!data || typeof data !== "object") throw new Error("Invalid review");
        upsertReview(data as Review);
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    return NextResponse.json({
      business: getBusiness(),
      faqs: getFaqs(),
      reviews: getReviews({ includeHidden: true }),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
