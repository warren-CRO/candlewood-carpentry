import type { Metadata } from "next";
import { PHONE, PHONE_HREF, SMS_HREF, EMAIL, OWNER, SERVICE_AREAS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { EstimateForm } from "@/components/EstimateForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Request an estimate from ${OWNER} at Candlewood Carpentry LLC. Call ${PHONE}, text, email, or send the form.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | Candlewood Carpentry LLC", url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Tell Chad what you have in mind." />
      <section className="section">
        <div className="wrap split even">
          <div>
            <h2>Reach Chad directly.</h2>
            <p>The fastest way is a call or text. Email and the form work too.</p>
            <div className="contact-links">
              <a href={PHONE_HREF} className="btn">
                Call {PHONE}
              </a>
              <a href={SMS_HREF} className="btn outline">
                Text {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="btn outline">
                {EMAIL}
              </a>
            </div>
            <div className="contact-meta">
              <p>
                <strong>Owner:</strong> {OWNER}
              </p>
              <p>
                <strong>Service area:</strong> {SERVICE_AREAS.join(", ")}
              </p>
            </div>
          </div>
          <EstimateForm />
        </div>
      </section>
    </>
  );
}
