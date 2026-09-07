import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Candlewood Carpentry",
  description:
    "Meet Chad Colesworthy, principal and lead contractor at Candlewood Carpentry. Over 15 years of general contracting in western Connecticut.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-primary text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-accent-light text-lg max-w-2xl">
            Small crew. Big standards. One guy who answers the phone and swings
            the hammer.
          </p>
        </div>
      </section>

      {/* Chad's story */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="/images/craftsman-detail.jpg"
                  alt="Contractor working on a residential build"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Chad Colesworthy
              </h2>
              <p className="text-sm font-medium text-accent mb-6 tracking-wide uppercase">
                Principal &amp; Lead Contractor
              </p>

              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Chad grew up in the hills above Candlewood Lake, watching his
                  father and uncles build homes from the dirt up. He was handing
                  tools before he started school and framing walls by the time he
                  was in high school.
                </p>
                <p>
                  After working under several of the best general contractors in
                  Fairfield County, Chad went out on his own. Candlewood
                  Carpentry started the way most good things do — one customer
                  telling another.
                </p>
                <p>
                  Fifteen years later, the company is still small on purpose.
                  Chad is on every job. He does not run crews from a desk. He
                  does not hand off your project to a foreman you have never met.
                  The person you shake hands with at the estimate is the person
                  who builds your home.
                </p>
                <p>
                  That is not a marketing line. It is how the company works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Area photo band */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/new-england-landscape.jpg"
          alt="Rolling hills and trees in western Connecticut"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/30" />
      </section>

      {/* Why Candlewood */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-primary mb-12">
            Why Candlewood
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Owner on Every Job",
                text: "Chad is the lead contractor on every project. No subbing it out, no handoffs. You hired him — you get him.",
              },
              {
                title: "Honest Pricing",
                text: "We give you a detailed scope and a real number. We do not lowball to win the job and make it up in change orders.",
              },
              {
                title: "Built for This Place",
                text: "We know western Connecticut. We know the soil, the codes, the winters. We have been building here our entire lives.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-lg border border-accent-light"
              >
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s talk about what you need.
          </h2>
          <p className="text-accent-light mb-10 max-w-xl mx-auto">
            Every project starts with a conversation. Tell us what you are
            thinking.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-primary font-semibold rounded hover:bg-accent-light transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
