import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="font-oswald text-[22vw] font-bold text-neutral-100 uppercase select-none">
          404
        </span>
      </div>

      <div className="relative z-10 text-center px-6 py-24">
        <p className="font-oswald text-6xl lg:text-8xl font-bold text-neutral-200 mb-4">
          404
        </p>
        <h1 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-neutral-500 mb-9 max-w-md mx-auto text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </section>
  );
}
