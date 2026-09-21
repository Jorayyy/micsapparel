import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-4">
        <h1 className="font-oswald text-[clamp(6rem,20vw,12rem)] font-bold text-white/[0.03] leading-none">
          404
        </h1>
        <h2 className="font-oswald text-3xl font-bold text-white uppercase tracking-tight -mt-8">
          Page Not Found
        </h2>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/"
            className="px-8 py-4 bg-white text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 border border-white/20 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
          >
            View Products
          </Link>
        </div>
      </div>
    </section>
  );
}
