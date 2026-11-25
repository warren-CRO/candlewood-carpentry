import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Traction Tools",
  description: "Estimates, invoices, receipts & voice assistant for your trades business.",
  robots: "noindex, nofollow",
  manifest: "/tools-manifest.json",
  icons: {
    icon: "/traction-icon-192.png",
    apple: "/traction-apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Traction Tools",
    statusBarStyle: "black-translucent",
    startupImage: [
      { url: "/splash-1170x2532.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash-1290x2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash-750x1334.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash-2048x2732.png", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A4A",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
