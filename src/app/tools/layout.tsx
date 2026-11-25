import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools — Candlewood Carpentry",
  robots: "noindex, nofollow",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
