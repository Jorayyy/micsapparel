import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductPurchase from "@/components/ProductPurchase";
import ProductImage from "@/components/ProductImage";
import {
  getBusiness,
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
} from "@/lib/store";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | MicsApparel`,
      description: product.description,
      url: `${SITE_URL}/products/${product.slug}`,
      type: "website",
      images: product.images[0]
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const business = getBusiness();
  const category = getCategoryBySlug(product.category);
  const related = getProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const jsonLd = [
    productJsonLd(product, business),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Shop", url: "/products" },
      { name: product.name, url: `/products/${product.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 tracking-wide">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-black transition-colors">
                  Shop
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="hover:text-black transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-black">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden group">
                <ProductImage
                  src={product.images[0] ?? ""}
                  alt={product.name}
                  className="w-full h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
                    {product.badge}
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1, 5).map((image, i) => (
                    <div
                      key={`${image}-${i}`}
                      className="relative aspect-square bg-neutral-100 overflow-hidden group"
                    >
                      <ProductImage
                        src={image}
                        alt={`${product.name} view ${i + 2}`}
                        className="w-full h-full"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <ProductPurchase product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-2">
                  Keep Exploring
                </span>
                <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm text-neutral-500 hover:text-black tracking-widest uppercase transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
