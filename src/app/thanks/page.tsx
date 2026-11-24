import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <section className="thanks">
      <div className="wrap">
        <p className="eyebrow" style={{ color: "var(--slate)" }}>
          Thank you
        </p>
        <h1>Your request has been sent.</h1>
        <p>Chad will get back to you as soon as he can, usually within a day.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
