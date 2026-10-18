"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Business, Category, Faq } from "@/lib/types";

const ContentContext = createContext<{
  business: Business;
  faqs: Faq[];
  categories: Category[];
} | null>(null);

export function ContentProvider({
  business,
  faqs,
  categories,
  children,
}: {
  business: Business;
  faqs: Faq[];
  categories: Category[];
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={{ business, faqs, categories }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): { business: Business; faqs: Faq[]; categories: Category[] } {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
}
