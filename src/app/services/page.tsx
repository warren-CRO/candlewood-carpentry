import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | Candlewood Carpentry",
  description:
    "New construction, renovations, home extensions, and finish carpentry in western Connecticut. Licensed and insured general contractor.",
};

const SERVICES = [
  {
    id: "new-construction",
    title: "New Construction",
    lead: "Your land, your vision, our hands.",
    image: "/images/house-framing.jpg",
    imageAlt: "Residential house framing under construction",
    paragraphs: [
      "We build custom homes from foundation to finish. Whether you bring your own architect or need help finding one, we manage the entire process — permits, framing, mechanicals, finishes, and final walkthrough.",
      "Every new build starts with a detailed scope and timeline. No surprises, no change-order games. We price it honest and build it right.",
    ],
    details: [
      "Custom single-family homes",
      "Garages and outbuildings",
      "Full project management",
      "Permit coordination",
    ],
  },
  {
    id: "renovations",
    title: "Renovations",
    lead: "Modernize without losing what matters.",
    image: "/images/kitchen-remodel.jpg",
    imageAlt: "Modern kitchen renovation with clean finishes",
    paragraphs: [
      "Kitchens, bathrooms, basements, whole-home renovations. We work with what your house already has and make it better — keeping the character while bringing everything up to current standards.",
      "We know older Connecticut homes. We know what is behind those plaster walls. No guesswork, just experience.",
    ],
    details: [
      "Kitchen and bathroom remodels",
      "Basement finishing",
      "Whole-home renovations",
      "Historic home updates",
    ],
  },
  {
    id: "extensions",
    title: "Home Extensions",
    lead: "More room for the life you actually have.",
    image: "/images/construction-progress.jpg",
    imageAlt: "Residential construction addition in progress",
    paragraphs: [
      "Additions, bump-outs, second stories. When your family outgrows your house but you love the neighborhood, we add the space you need without the cost and disruption of moving.",
      "We handle engineering, permits, and construction — and we match the addition to the existing house so it looks like it was always there.",
    ],
    details: [
      "Room additions",
      "Second-story additions",
      "Bump-outs and sunrooms",
      "In-law suites",
    ],
  },
  {
    id: "finishes",
    title: "Finish Carpentry",
    lead: "The work people notice.",
    image: "/images/interior-trim.jpg",
    imageAlt: "Detailed interior trim and molding work",
    paragraphs: [
      "Trim, crown molding, wainscoting, built-in bookshelves, custom cabinetry. This is the detail work that separates a good house from a great one.",
      "Chad started as a finish carpenter. It is still where his best work shows. If you care about tight joints and clean lines, we should talk.",
    ],
    details: [
      "Crown molding and trim",
      "Custom built-ins and shelving",
      "Wainscoting and paneling",
      "Custom cabinetry",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-primary text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-accent-light text-lg max-w-2xl">
            Four disciplines, decades of experience. Every project gets the same
            attention — because Chad is on every job.
          </p>
        </div>
      </section>

      {/* Service sections */}
      {SERVICES.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 ${i % 2 === 1 ? "bg-white" : ""}`}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 order-2 md:order-1">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {service.title}
                </h2>
                <p className="text-accent font-medium text-lg mb-6">
                  {service.lead}
                </p>
                {service.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-muted leading-relaxed mb-4 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-accent/5 rounded-lg p-6 border border-accent-light">
                  <h3 className="font-semibold text-primary mb-4">
                    What we do
                  </h3>
                  <ul className="space-y-3">
                    {service.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="text-accent mt-0.5">&#10003;</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-accent-light mb-10 max-w-xl mx-auto">
            We&apos;ll come take a look, talk it through, and give you an honest
            number. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-primary font-semibold rounded hover:bg-accent-light transition-colors"
            >
              Get a Free Estimate
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-accent-light text-accent-light font-semibold rounded hover:bg-white/10 transition-colors"
            >
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
