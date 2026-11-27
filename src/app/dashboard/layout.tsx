import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Traction Tools",
  description: "Business profitability and pipeline overview.",
  robots: "noindex, nofollow",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
