"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-oswald text-[20vw] font-bold text-white/[0.02] uppercase">
          404
        </span>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <span className="font-oswald text-8xl lg:text-[10rem] font-bold text-white/10">
            404
          </span>
        </div>

        <h1 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
