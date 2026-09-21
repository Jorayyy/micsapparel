import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e94560] rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4a574] rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="font-oswald text-9xl font-bold text-gradient mb-4">404</h1>
        <h2 className="font-oswald text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#ff6b81] text-white font-oswald text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-[#e94560]/30 transition-all hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 border-2 border-white/20 text-white font-oswald text-lg font-semibold rounded-full hover:bg-white/5 transition-all"
          >
            View Products
          </Link>
        </div>
      </div>
    </section>
  );
}
