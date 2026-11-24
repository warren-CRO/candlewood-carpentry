import type { Metadata } from "next";
import { OWNER } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ServiceArea } from "@/components/ServiceArea";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${OWNER}, owner of Candlewood Carpentry LLC. Local work, straight answers, and a finished result you can feel good about.`,
  alternates: { canonical: "/about" },
  openGraph: { title: "About | Candlewood Carpentry LLC", url: "/about" },
};

const FACTS = [
  {
    title: "You deal with the owner",
    text: "Chad answers the phone, walks the job, and does the work. No hand-offs and no surprises.",
  },
  {
    title: "No job too big or small",
    text: "From a full kitchen to a door that never closed right, every job gets the same care.",
  },
  {
    title: "A neighbor, not a franchise",
    text: "Candlewood Carpentry is a local company. Your street is part of the reputation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Local work. Straight answers. A finished result you can feel good about."
      />
      <section className="section">
        <div className="wrap split even">
          <div>
            <p className="eyebrow">Meet {OWNER}</p>
            <h2>Yes, that is a carpenter on a water ski.</h2>
            {/* TODO: replace with Chad's real bio (background, years in the trade, why he does this) */}
            <p>
              {OWNER} runs Candlewood Carpentry LLC from Sherman. He
              handles renovations, kitchen and bath remodels, painting, decks,
              and general carpentry for homeowners around Candlewood Lake.
            </p>
            <p>
              The approach is simple: show up when you say you will, explain
              the work before it starts, keep the site clean, and stand behind
              the finished job.
            </p>
          </div>
          {/* TODO: add a real photo of Chad */}
          <div className="about-photo placeholder">Photo of Chad coming soon</div>
        </div>
      </section>
      <section className="section mist">
        <div className="wrap">
          <div className="facts">
            {FACTS.map((f) => (
              <div key={f.title} className="fact">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ServiceArea />
      <CTABand />
    </>
  );
}
