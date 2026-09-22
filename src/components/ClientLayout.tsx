"use client";

import { ContentProvider } from "@/lib/content-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import type { Business } from "@/lib/types";

export default function ClientLayout({
  business,
  children,
}: {
  business: Business;
  children: React.ReactNode;
}) {
  return (
    <ContentProvider business={business}>
      <CartProvider>
        <Navbar />
        <main className="min-h-screen pt-16 lg:pt-20 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </ContentProvider>
  );
}
