"use client";

import { useState, useEffect } from "react";
import { business as defaultBusiness, products as defaultProducts, testimonials as defaultTestimonials, faqs as defaultFaqs } from "@/data/business";

interface SiteContent {
  business: typeof defaultBusiness;
  products: typeof defaultProducts;
  testimonials: typeof defaultTestimonials;
  faqs: typeof defaultFaqs;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>({
    business: defaultBusiness,
    products: defaultProducts,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          setContent({
            business: data.business || defaultBusiness,
            products: data.products || defaultProducts,
            testimonials: data.testimonials || defaultTestimonials,
            faqs: data.faqs || defaultFaqs,
          });
        }
      } catch {
        // Use defaults
      }
      setLoading(false);
    }

    fetchContent();
  }, []);

  return { content, loading };
}
