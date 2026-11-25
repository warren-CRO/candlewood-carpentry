import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Receipt Splitter",
  robots: "noindex, nofollow",
};

export default function ReceiptsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
