"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Business } from "@/lib/types";

const ContentContext = createContext<{ business: Business } | null>(null);

export function ContentProvider({
  business,
  children,
}: {
  business: Business;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={{ business }}>{children}</ContentContext.Provider>
  );
}

export function useContent(): { business: Business } {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
}
