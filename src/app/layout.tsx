import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  PHONE,
  EMAIL,
  SERVICE_AREAS,
  COMPANY,
  OWNER,
  SERVICES,
} from "@/lib/constants";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const SITE_URL = "https://candlewoodcarpentryllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Candlewood Carpentry LLC | Renovations, Painting & Carpentry in the Candlewood Lake Area",
    template: "%s | Candlewood Carpentry LLC",
  },
  description: `${COMPANY} — renovations, kitchen and bath remodels, decks, interior and exterior painting, and carpentry serving ${SERVICE_AREAS.join(", ")} in western Connecticut.`,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    siteName: COMPANY,
    title: "Candlewood Carpentry LLC | Renovations, Painting & Carpentry",
    description: `Renovations, kitchen and bath remodels, decks, painting, and carpentry in the Candlewood Lake area. ${OWNER}, owner.`,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    type: "website",
    locale: "en_US",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#business`,
  name: COMPANY,
  description:
    "Renovations, kitchen and bath remodels, decks, interior and exterior painting, and general carpentry serving the Candlewood Lake area in western Connecticut.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/assets/logo-badge.png`,
  image: `${SITE_URL}/images/og-image.png`,
  telephone: PHONE,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Fairfield",
    addressRegion: "CT",
    postalCode: "06812",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.4667,
    longitude: -73.4851,
  },
  areaServed: SERVICE_AREAS.map((city) => ({
    "@type": "City",
    name: `${city}, CT`,
  })),
  founder: { "@type": "Person", name: OWNER, jobTitle: "Owner" },
  openingHours: "Mo-Fr 07:00-17:00",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
