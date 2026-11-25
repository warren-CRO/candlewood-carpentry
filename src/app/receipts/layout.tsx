import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Receipt Scanner — Traction Tools",
  robots: "noindex, nofollow",
  icons: {
    icon: "/traction-icon-192.png",
    apple: "/traction-apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Traction Tools",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A4A",
};

export default function ReceiptsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
