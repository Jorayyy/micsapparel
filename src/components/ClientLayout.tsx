"use client";

import { ContentProvider } from "@/lib/content-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ContentProvider>
  );
}
