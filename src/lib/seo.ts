import type { Business, Product } from "@/lib/types";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function organizationJsonLd(business: Business) {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: business.name,
    description: business.shortDescription,
    url: SITE_URL,
    logo: business.logo,
    telephone: business.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.location.city,
      addressRegion: business.location.province,
      addressCountry: business.location.country,
    },
    sameAs: [business.social.facebook, business.social.tiktok],
  };
}

export function productJsonLd(product: Product, business: Business) {
  const image = product.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: image ? [new URL(image, SITE_URL).toString()] : undefined,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: business.name || SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "PHP",
      price: product.price,
      availability:
        product.status === "active" && (product.stock === null || product.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, SITE_URL).toString(),
    })),
  };
}
