import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs — Traction Tools",
  description: "Track jobs, expenses, and profitability.",
  robots: "noindex, nofollow",
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
