import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { getBusiness } from "@/lib/store";
import { SITE_URL } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MicsApparel | Premium Streetwear from Tacloban City",
    template: "%s | MicsApparel",
  },
  description:
    "MicsApparel is a premium streetwear clothing brand based in Tacloban City, Philippines. Shop caps, hats, and streetwear accessories. Quality fashion at affordable prices.",
  keywords: [
    "MicsApparel",
    "streetwear",
    "clothing brand",
    "Tacloban City",
    "Philippines",
    "caps",
    "hats",
    "fashion",
    "affordable fashion",
    "Filipino brand",
  ],
  authors: [{ name: "MicsApparel" }],
  creator: "MicsApparel",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: SITE_URL,
    siteName: "MicsApparel",
    title: "MicsApparel | Premium Streetwear from Tacloban City",
    description:
      "Premium streetwear clothing brand based in Tacloban City, Philippines. Shop caps, hats, and streetwear accessories.",
    images: [
      {
        url: `${SITE_URL}/logo.svg`,
        width: 1200,
        height: 630,
        alt: "MicsApparel - Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MicsApparel | Premium Streetwear from Tacloban City",
    description:
      "Premium streetwear clothing brand based in Tacloban City, Philippines.",
    images: [`${SITE_URL}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const business = await getBusiness();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(business)),
          }}
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased`}>
        <ClientLayout business={business}>{children}</ClientLayout>
      </body>
    </html>
  );
}
