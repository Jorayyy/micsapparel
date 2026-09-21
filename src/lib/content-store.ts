import { business as defaultBusiness, products as defaultProducts, testimonials as defaultTestimonials, faqs as defaultFaqs } from "@/data/business";

export interface SiteContent {
  business: typeof defaultBusiness;
  products: typeof defaultProducts;
  testimonials: typeof defaultTestimonials;
  faqs: typeof defaultFaqs;
  lastUpdated: string;
}

// In-memory store (resets on cold start - use Vercel KV for production)
let contentStore: SiteContent | null = null;

export function getContent(): SiteContent {
  if (!contentStore) {
    contentStore = {
      business: { ...defaultBusiness },
      products: [...defaultProducts],
      testimonials: [...defaultTestimonials],
      faqs: [...defaultFaqs],
      lastUpdated: new Date().toISOString(),
    };
  }
  return contentStore;
}

export function updateContent(updates: Partial<SiteContent>): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function updateBusiness(businessUpdates: Partial<typeof defaultBusiness>): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    business: { ...current.business, ...businessUpdates },
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function updateProducts(products: typeof defaultProducts): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    products,
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function updateProduct(id: number, updates: Partial<typeof defaultProducts[0]>): SiteContent {
  const current = getContent();
  const products = current.products.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  contentStore = {
    ...current,
    products,
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function addProduct(product: typeof defaultProducts[0]): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    products: [...current.products, product],
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function deleteProduct(id: number): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    products: current.products.filter(p => p.id !== id),
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function updateTestimonials(testimonials: typeof defaultTestimonials): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    testimonials,
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}

export function updateFaqs(faqs: typeof defaultFaqs): SiteContent {
  const current = getContent();
  contentStore = {
    ...current,
    faqs,
    lastUpdated: new Date().toISOString(),
  };
  return contentStore;
}
