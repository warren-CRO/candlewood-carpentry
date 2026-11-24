import type { Metadata } from "next";
import { SERVICES, SERVICE_DETAILS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ServiceArea } from "@/components/ServiceArea";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Renovations, kitchen and bath remodels, interior and exterior painting, decks, and general carpentry in the Candlewood Lake area of Connecticut.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | Candlewood Carpentry LLC", url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="One local company for the projects that change how your home looks and feels."
      />
      <section className="section">
        <div className="wrap">
          {SERVICES.map((s) => {
            const d = SERVICE_DETAILS[s.id];
            return (
              <article key={s.id} id={s.id} className="service-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.icon} alt="" width={96} height={96} />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
                <ul className="bullets">
                  {d.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
      <ServiceArea />
      <CTABand />
    </>
  );
}
