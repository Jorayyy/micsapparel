export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "gcash" | "maya" | "bank" | "cod";

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  stock: number | null;
  sku: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  features: string[];
  category: string;
  images: string[];
  sku: string | null;
  status: ProductStatus;
  featured: boolean;
  isNew: boolean;
  badge: string | null;
  stock: number | null;
  lowStockAt: number;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  order: number;
  status: "active" | "hidden";
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  source: string;
  status: "published" | "hidden";
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variantId: string | null;
  variantLabel: string | null;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  history: { status: OrderStatus; at: string; note?: string }[];
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface BusinessValue {
  title: string;
  description: string;
}

export interface BusinessMilestone {
  year: string;
  title: string;
  description: string;
}

export interface Business {
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  motto: string;
  mission: string;
  founded: string;
  logo: string;
  location: { city: string; province: string; country: string; full: string };
  contact: {
    phone: string;
    phoneRaw: string;
    email: string | null;
    messenger: string;
    facebook: string;
    tiktok: string;
    tiktokHandle: string;
    address: string;
    hours: string;
    region: string;
  };
  hours: { status: string; description: string };
  owner: { name: string; title: string };
  stats: { followers: string; rating: string; reviewCount: number; yearsInBusiness: string };
  social: { facebook: string; tiktok: string; messenger: string };
  values: BusinessValue[];
  milestones: BusinessMilestone[];
}

export interface StoreData {
  business: Business;
  products: Product[];
  categories: Category[];
  reviews: Review[];
  faqs: Faq[];
  orders: Order[];
  media: MediaItem[];
  lastUpdated: string;
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantId: string | null;
  variantLabel: string | null;
}
