import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://micsapparel.com"),
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
    url: "https://micsapparel.com",
    siteName: "MicsApparel",
    title: "MicsApparel | Premium Streetwear from Tacloban City",
    description:
      "Premium streetwear clothing brand based in Tacloban City, Philippines. Shop caps, hats, and streetwear accessories.",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              name: "MicsApparel",
              description:
                "Premium streetwear clothing brand based in Tacloban City, Philippines",
              url: "https://micsapparel.com",
              telephone: "+639926853803",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Tacloban City",
                addressRegion: "Leyte",
                addressCountry: "PH",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 11.2497,
                longitude: 125.0024,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61575002625239",
                "https://www.tiktok.com/@micko.badilla",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${oswald.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
