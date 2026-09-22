"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Business, Faq } from "@/lib/types";

const ContentContext = createContext<{ business: Business; faqs: Faq[] } | null>(null);

export function ContentProvider({
  business,
  faqs,
  children,
}: {
  business: Business;
  faqs: Faq[];
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={{ business, faqs }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): { business: Business; faqs: Faq[] } {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
}
