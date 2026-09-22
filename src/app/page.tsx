import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SafeImg from "@/components/SafeImg";
import { getBusiness, getCategories, getProducts, getReviews, productImage } from "@/lib/store";
import { messengerUrl } from "@/lib/messenger";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

const marqueeWords = [
  "MicsApparel",
  "Premium Streetwear",
  "Tacloban City",
  "Since 2024",
  "Faith-Driven",
];

export default function Home() {
  const business = getBusiness();
  const products = getProducts();
  const categories = getCategories();
  const reviews = getReviews().slice(0, 6);

  const featured = products.filter((p) => p.featured).slice(0, 6);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const startingPrice = products.length
    ? Math.min(...products.map((p) => p.price))
    : null;

  const messenger = messengerUrl(
    business.social.messenger,
    "Hi MicsApparel! I'd like to place an order."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-white">
        <div
          className="absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[560px] h-[560px] bg-neutral-100 rotate-45"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-neutral-300 text-neutral-500 text-[11px] tracking-[0.25em] uppercase">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                  Est. {business.founded} — {business.location.city}
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-oswald text-[clamp(3.5rem,11vw,8rem)] font-bold leading-[0.88] tracking-tight uppercase">
                  <span className="block">Mics</span>
                  <span className="block text-neutral-300">Apparel</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="text-neutral-500 text-lg max-w-md leading-relaxed">
                  Premium streetwear from the heart of Tacloban City. Bold designs.
                  Authentic style. Faith-driven.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/products"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
                  >
                    Shop Now
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <a
                    href={messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 border border-neutral-300 text-neutral-700 font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
                  >
                    Message Us
                  </a>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <dl className="flex flex-wrap items-end gap-10 pt-7 border-t border-neutral-200">
                  <div>
                    <dt className="sr-only">Followers</dt>
                    <dd className="font-oswald text-3xl font-bold">
                      {business.stats.followers}
                    </dd>
                    <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase mt-1">
                      Followers
                    </p>
                  </div>
                  <div>
                    <dt className="sr-only">Recommended</dt>
                    <dd className="font-oswald text-3xl font-bold">
                      {business.stats.rating}
                    </dd>
                    <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase mt-1">
                      Recommended
                    </p>
                  </div>
                  {startingPrice !== null && (
                    <div>
                      <dt className="sr-only">Starting price</dt>
                      <dd className="font-oswald text-3xl font-bold">
                        {formatPeso(startingPrice)}+
                      </dd>
                      <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase mt-1">
                        Starting Price
                      </p>
                    </div>
                  )}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={200} className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-[480px] aspect-[4/5] bg-neutral-100 overflow-hidden group">
                {featured[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productImage(featured[0])}
                    alt={featured[0].name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
                  Featured Drop
                </div>
                {featured[0] && (
                  <Link
                    href={`/products/${featured[0].slug}`}
                    className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-white px-4 py-3 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="font-oswald text-sm font-bold uppercase">
                      {featured[0].name}
                    </span>
                    <span className="text-sm font-medium">
                      {formatPeso(featured[0].price)}
                    </span>
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-5 border-y border-neutral-200 overflow-hidden bg-white">
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="font-oswald text-5xl font-bold text-neutral-100 uppercase tracking-wider mx-6"
            >
              {marqueeWords.join(" — ")} —{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
                    Collection
                  </span>
                  <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
                    Featured
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black tracking-widest uppercase transition-colors"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            <div className="sm:hidden mt-7 text-center">
              <Link
                href="/products"
                className="inline-flex px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-widest uppercase"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 lg:py-28 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
                    Fresh
                  </span>
                  <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight">
                    New Arrivals
                  </h2>
                </div>
                <Link
                  href="/products?sort=newest"
                  className="text-sm text-neutral-500 hover:text-black tracking-widest uppercase transition-colors"
                >
                  Shop New
                </Link>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newArrivals.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <Reveal>
              <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
                Browse
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-10">
                Shop by Category
              </h2>
            </Reveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {categories.map((category, i) => {
                const count = products.filter((p) => p.category === category.slug).length;
                return (
                  <Reveal key={category.id} delay={i * 80}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group block p-8 border border-neutral-200 hover:border-black transition-colors min-h-[220px] flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-oswald text-5xl font-bold text-neutral-100 group-hover:text-neutral-200 transition-colors">
                          0{i + 1}
                        </span>
                        <h3 className="font-oswald text-2xl font-bold uppercase mt-5">
                          {category.name}
                        </h3>
                        <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mt-6">
                        {count} product{count !== 1 ? "s" : ""} →
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div className="space-y-6">
                <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block">
                  About Us
                </span>
                <h2 className="font-oswald text-4xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95]">
                  Born in
                  <br />
                  Tacloban
                </h2>
                <p className="text-neutral-500 leading-relaxed max-w-lg">
                  {business.description}
                </p>
                <p className="text-neutral-400 italic text-base border-l-2 border-neutral-200 pl-5">
                  &ldquo;{business.motto}&rdquo;
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 text-sm tracking-widest uppercase group"
                >
                  <span className="w-12 h-px bg-black group-hover:w-16 transition-all" />
                  Learn More
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden flex items-center justify-center">
                <SafeImg
                  src={business.logo}
                  alt={business.name}
                  className="w-40 h-40 rounded-full object-cover opacity-70"
                />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <p className="font-oswald text-3xl font-bold uppercase">{business.name}</p>
                  <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase mt-1">
                    Est. {business.founded} · {business.location.full}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <Reveal>
            <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3 text-center">
              Why Us
            </span>
            <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight text-center mb-12">
              Different
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {business.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="p-7 bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-neutral-300 transition-all h-full">
                  <span className="font-oswald text-4xl font-bold text-neutral-200">
                    0{i + 1}
                  </span>
                  <h3 className="font-oswald text-xl font-bold uppercase mt-4 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 lg:py-28 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <Reveal>
              <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3 text-center">
                Reviews
              </span>
              <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight text-center mb-12">
                What They Say
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-5">
              {reviews.slice(0, 3).map((review, i) => (
                <Reveal key={review.id} delay={i * 80}>
                  <figure className="p-7 bg-white border border-neutral-200 h-full">
                    <div className="flex gap-1 mb-5" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, star) => (
                        <svg key={star} className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-neutral-600 leading-relaxed mb-6 text-sm">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-oswald font-bold text-xs">
                        {review.name[0]}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{review.name}</span>
                        <span className="block text-neutral-400 text-xs">{review.source}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Reveal>
            <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
              Follow the Brand
            </span>
            <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-5">
              Join {business.stats.followers} Followers
            </h2>
            <p className="text-neutral-500 mb-9 max-w-xl mx-auto">
              New drops, restocks, and behind-the-scenes from Tacloban City — straight to
              your feed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
              >
                Follow on Facebook
              </a>
              <a
                href={business.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
              >
                Follow on TikTok
              </a>
              <a
                href={business.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-neutral-300 font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors"
              >
                Chat on Messenger
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Reveal>
            <h2 className="font-oswald text-5xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-6">
              Get Yours
              <br />
              Now
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Premium streetwear from Tacloban City. Order online or message us on
              Messenger.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-10 py-5 bg-white text-black font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
              >
                Shop the Collection
              </Link>
              <a
                href={messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border border-white/25 text-white font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
              >
                Order via Messenger
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
