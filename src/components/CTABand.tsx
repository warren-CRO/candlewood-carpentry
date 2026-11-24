import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";

export function CTABand({
  title = "Tell Chad what you have in mind.",
  text = "Send a few details and a photo or two. You will hear back from Chad directly, usually within a day.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="btn-row">
          <Link href="/contact" className="btn light">
            Request an Estimate
          </Link>
          <a href={PHONE_HREF} className="btn ghost">
            Call {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
