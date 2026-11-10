import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingPhoneCTA } from "@/components/FloatingPhoneCTA";
import { PHONE, EMAIL, SERVICE_AREAS, COMPANY, OWNER } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Candlewood Carpentry LLC | Renovations, Painting & Carpentry in the Candlewood Lake Area",
  description: `${COMPANY} — renovations, kitchen and bath remodels, decks, interior and exterior painting, and carpentry serving ${SERVICE_AREAS.slice(0, 5).join(", ")}, and surrounding towns in western Connecticut.`,
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
    title: "Candlewood Carpentry LLC | Renovations, Painting & Carpentry",
    description: `Renovations, kitchen and bath remodels, decks, painting, and carpentry in the Candlewood Lake area. ${OWNER}, owner.`,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://candlewoodcarpentryllc.com/#business",
  name: COMPANY,
  description: `Renovations, kitchen and bath remodels, decks, interior and exterior painting, and general carpentry serving the Candlewood Lake area in western Connecticut.`,
  url: "https://candlewoodcarpentryllc.com",
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
  founder: {
    "@type": "Person",
    name: OWNER,
    jobTitle: "Owner",
  },
  openingHours: "Mo-Fr 07:00-17:00",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Renovations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kitchen & Bath Remodels" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Decks & Outdoor Work" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "General Carpentry" } },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingPhoneCTA />
      </body>
    </html>
  );
}
