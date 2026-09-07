import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/constants";

const SERVICES = [
  {
    title: "New Construction",
    description:
      "Custom homes built from the ground up. We work with your architect or bring our own.",
    href: "/services#new-construction",
    image: "/images/house-framing.jpg",
  },
  {
    title: "Renovations",
    description:
      "Kitchens, bathrooms, whole-home renovations. We modernize older homes without losing what makes them worth keeping.",
    href: "/services#renovations",
    image: "/images/kitchen-remodel.jpg",
  },
  {
    title: "Home Extensions",
    description:
      "Additions, bump-outs, second stories. More space for how your family actually lives.",
    href: "/services#extensions",
    image: "/images/construction-progress.jpg",
  },
  {
    title: "Finish Carpentry",
    description:
      "Trim, crown molding, built-ins, custom cabinetry. The detail work that turns a house into your home.",
    href: "/services#finishes",
    image: "/images/interior-trim.jpg",
  },
];

const TRUST = [
  "Licensed & Insured",
  "15+ Years Experience",
  "Owner on Every Job",
  "Free Estimates",
];

const SERVICE_AREAS = [
  "Shelton",
  "New Fairfield",
  "New Milford",
  "Brookfield",
  "Bethel",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center">
        <Image
          src="/images/hero-home.jpg"
          alt="Custom-built home in a wooded lakeside setting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Built right.
            <br />
            Built to last.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-accent-light max-w-2xl leading-relaxed">
            General contractor in western Connecticut. New construction,
            renovations, extensions, and finish carpentry — done with the care
            your home deserves.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-primary font-semibold rounded hover:bg-accent-light transition-colors text-center"
            >
              Get a Free Estimate
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-accent-light text-accent-light font-semibold rounded hover:bg-white/10 transition-colors text-center"
            >
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-accent/10 border-y border-accent-light">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {TRUST.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-accent font-bold">&#10003;</span>
                <span className="text-sm font-medium text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What We Do
          </h2>
          <p className="text-muted mb-12 max-w-2xl">
            Four things, done well. We don&apos;t try to be everything — we
            focus on the work we&apos;re best at.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group block overflow-hidden rounded-lg border border-accent-light hover:border-accent transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-xl font-semibold text-primary group-hover:text-cta transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-cta group-hover:translate-x-1 transition-transform">
                    Learn more &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted mb-12 max-w-2xl">
            We don&apos;t run ads. Our work speaks for itself — and so do the
            people we&apos;ve built for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "Chad rebuilt our entire kitchen and never once made us feel like we were inconveniencing him. He showed up early, cleaned up every day, and the finished product was better than what we imagined. We have already recommended him to two neighbors.",
                name: "Mike & Sarah T.",
                location: "New Fairfield, CT",
                project: "Full kitchen renovation",
              },
              {
                quote:
                  "We interviewed four contractors for our addition. Chad was the only one who walked the property, asked real questions, and gave us a detailed scope before talking price. The addition looks like it was always part of the house.",
                name: "Jennifer L.",
                location: "Brookfield, CT",
                project: "Two-room addition",
              },
              {
                quote:
                  "After a bad experience with another contractor who disappeared mid-project, Chad came in and finished our basement the right way. He was honest about what needed to be redone and what could be saved. Wish we had found him first.",
                name: "Tom R.",
                location: "Bethel, CT",
                project: "Basement finishing",
              },
              {
                quote:
                  "The trim work in our living room is the first thing every guest comments on. Chad is a real craftsman. You can tell he actually cares about getting it right, not just getting it done.",
                name: "Karen & Dave P.",
                location: "Shelton, CT",
                project: "Custom built-ins and crown molding",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-lg border border-accent-light bg-accent/5"
              >
                <div className="flex gap-1 mb-4 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted">
                    {testimonial.location} &middot; {testimonial.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/carpenter-working.jpg"
                alt="Contractor working on a residential project"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Meet Chad
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-4">
                Chad Colesworthy grew up watching his father frame houses in the
                hills above Candlewood Lake. He started swinging a hammer before
                he could drive. Three decades later, he still shows up to every
                job site — not to manage from a truck, but to build.
              </p>
              <p className="text-lg text-muted leading-relaxed mb-8">
                Candlewood Carpentry is a small crew by design. Chad is the lead
                contractor on every project. When you hire us, you get him.
              </p>
              <Link
                href="/about"
                className="text-cta font-semibold hover:text-cta-hover transition-colors"
              >
                More about us &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="relative py-20">
        <Image
          src="/images/lakeside-home.jpg"
          alt="Homes along Candlewood Lake in western Connecticut"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bg/90" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Serving Western Connecticut
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            We work where we live. Our projects are in the towns we drive
            through every day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="px-5 py-2 bg-white rounded-full text-sm font-medium text-primary border border-accent-light"
              >
                {area}, CT
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to talk about your project?
          </h2>
          <p className="text-accent-light mb-10 max-w-xl mx-auto">
            No pressure, no pitch. Tell us what you&apos;re thinking and
            we&apos;ll tell you what it takes.
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
