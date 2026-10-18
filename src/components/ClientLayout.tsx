"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ContentProvider } from "@/lib/content-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MessengerChat from "@/components/MessengerChat";
import type { Business, Category, Faq } from "@/lib/types";

export default function ClientLayout({
  business,
  faqs,
  categories,
  children,
}: {
  business: Business;
  faqs: Faq[];
  categories: Category[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <ContentProvider business={business} faqs={faqs} categories={categories}>
      <CartProvider>
        {!isAdmin && (
          <Suspense fallback={<div className="h-[104px] lg:h-[124px]" />}>
            <Navbar />
          </Suspense>
        )}
        <main className={isAdmin ? "min-h-screen" : "min-h-screen"}>{children}</main>
        {!isAdmin && (
          <>
            <Footer />
            <CartDrawer />
            <MessengerChat />
          </>
        )}
      </CartProvider>
    </ContentProvider>
  );
}
