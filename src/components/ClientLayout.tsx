"use client";

import { ContentProvider } from "@/lib/content-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MessengerChat from "@/components/MessengerChat";
import type { Business, Faq } from "@/lib/types";

export default function ClientLayout({
  business,
  faqs,
  children,
}: {
  business: Business;
  faqs: Faq[];
  children: React.ReactNode;
}) {
  return (
    <ContentProvider business={business} faqs={faqs}>
      <CartProvider>
        <Navbar />
        <main className="min-h-screen pt-16 lg:pt-20 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <CartDrawer />
        <MessengerChat />
      </CartProvider>
    </ContentProvider>
  );
}
