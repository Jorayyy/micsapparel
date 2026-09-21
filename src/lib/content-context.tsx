"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { business as defaultBusiness, products as defaultProducts, testimonials as defaultTestimonials, faqs as defaultFaqs } from "@/data/business";

interface SiteContent {
  business: typeof defaultBusiness;
  products: typeof defaultProducts;
  testimonials: typeof defaultTestimonials;
  faqs: typeof defaultFaqs;
}

const ContentContext = createContext<SiteContent>({
  business: defaultBusiness,
  products: defaultProducts,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
});

const STORAGE_KEY = "micsapparel-content";

function loadContent(): SiteContent {
  if (typeof window === "undefined") {
    return {
      business: defaultBusiness,
      products: defaultProducts,
      testimonials: defaultTestimonials,
      faqs: defaultFaqs,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        business: { ...defaultBusiness, ...parsed.business },
        products: parsed.products || defaultProducts,
        testimonials: parsed.testimonials || defaultTestimonials,
        faqs: parsed.faqs || defaultFaqs,
      };
    }
  } catch {
    // Fallback to defaults
  }

  return {
    business: defaultBusiness,
    products: defaultProducts,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
  };
}

function saveContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Storage full or unavailable
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>({
    business: defaultBusiness,
    products: defaultProducts,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setContent(loadContent());
    setLoaded(true);
  }, []);

  const updateContent = (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    saveContent(newContent);
  };

  const updateBusiness = (businessUpdates: Partial<typeof defaultBusiness>) => {
    const newContent = {
      ...content,
      business: { ...content.business, ...businessUpdates },
    };
    setContent(newContent);
    saveContent(newContent);
  };

  const updateProducts = (products: typeof defaultProducts) => {
    const newContent = { ...content, products };
    setContent(newContent);
    saveContent(newContent);
  };

  const updateTestimonials = (testimonials: typeof defaultTestimonials) => {
    const newContent = { ...content, testimonials };
    setContent(newContent);
    saveContent(newContent);
  };

  const updateFaqs = (faqs: typeof defaultFaqs) => {
    const newContent = { ...content, faqs };
    setContent(newContent);
    saveContent(newContent);
  };

  return (
    <ContentContext.Provider
      value={{
        ...content,
        _updateBusiness: updateBusiness,
        _updateProducts: updateProducts,
        _updateTestimonials: updateTestimonials,
        _updateFaqs: updateFaqs,
        _loaded: loaded,
      } as SiteContent & {
        _updateBusiness: typeof updateBusiness;
        _updateProducts: typeof updateProducts;
        _updateTestimonials: typeof updateTestimonials;
        _updateFaqs: typeof updateFaqs;
        _loaded: boolean;
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  return context as SiteContent & {
    _updateBusiness: (updates: Partial<typeof defaultBusiness>) => void;
    _updateProducts: (products: typeof defaultProducts) => void;
    _updateTestimonials: (testimonials: typeof defaultTestimonials) => void;
    _updateFaqs: (faqs: typeof defaultFaqs) => void;
    _loaded: boolean;
  };
}

// Helper to get content without context (for server components)
export function getDefaultContent(): SiteContent {
  return {
    business: defaultBusiness,
    products: defaultProducts,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
  };
}
