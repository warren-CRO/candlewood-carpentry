import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingPhoneCTA } from "@/components/FloatingPhoneCTA";
import { PHONE, EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Candlewood Carpentry | General Contractor in Western Connecticut",
  description:
    "New construction, renovations, home extensions, and finish carpentry in Shelton, New Fairfield, New Milford, Brookfield, and Bethel, CT. Licensed and insured.",
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
    title: "Candlewood Carpentry | General Contractor in Western Connecticut",
    description:
      "New construction, renovations, home extensions, and finish carpentry in western Connecticut. Licensed and insured.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Candlewood Carpentry",
  description:
    "General contractor specializing in new construction, renovations, home extensions, and finish carpentry in western Connecticut.",
  url: "https://candlewoodcarpentry.com",
  telephone: PHONE,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Fairfield",
    addressRegion: "CT",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Shelton, CT" },
    { "@type": "City", name: "New Fairfield, CT" },
    { "@type": "City", name: "New Milford, CT" },
    { "@type": "City", name: "Brookfield, CT" },
    { "@type": "City", name: "Bethel, CT" },
  ],
  founder: {
    "@type": "Person",
    name: "Chad Colesworthy",
    jobTitle: "Principal and Lead Contractor",
  },
  openingHours: "Mo-Fr 07:00-17:00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingPhoneCTA />
      </body>
    </html>
  );
}
