"use client";

import { PHONE, PHONE_HREF, EMAIL } from "@/lib/constants";

const SERVICE_AREAS = [
  "Shelton",
  "New Fairfield",
  "New Milford",
  "Brookfield",
  "Bethel",
];

const SERVICE_OPTIONS = [
  "New Construction",
  "Renovation",
  "Home Extension",
  "Finish Carpentry",
  "Not sure yet",
];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-primary text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-accent-light text-lg max-w-2xl">
            Call, email, or fill out the form. We respond within one business
            day.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="md:col-span-2 space-y-8">
              {/* Phone */}
              <div>
                <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                  Call Us
                </h2>
                <a
                  href={PHONE_HREF}
                  className="text-2xl font-bold text-primary hover:text-cta transition-colors"
                >
                  {PHONE}
                </a>
                <p className="text-sm text-muted mt-1">
                  Mon&ndash;Fri 7am&ndash;5pm
                </p>
              </div>

              {/* Email */}
              <div>
                <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                  Email
                </h2>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-lg font-medium text-primary hover:text-cta transition-colors"
                >
                  {EMAIL}
                </a>
              </div>

              {/* Hours */}
              <div>
                <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                  Hours
                </h2>
                <div className="text-muted space-y-1 text-sm">
                  <p>Monday &ndash; Friday: 7:00 AM &ndash; 5:00 PM</p>
                  <p>Saturday: By appointment</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Service area */}
              <div>
                <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                  Service Area
                </h2>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_AREAS.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-accent/5 rounded-full text-xs font-medium text-muted border border-accent-light"
                    >
                      {area}, CT
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const subject = encodeURIComponent(
                    `Inquiry: ${data.get("service") || "General"}`
                  );
                  const body = encodeURIComponent(
                    `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nService: ${data.get("service")}\n\n${data.get("message")}`
                  );
                  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded border border-accent-light bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded border border-accent-light bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded border border-accent-light bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    What do you need?
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 rounded border border-accent-light bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta"
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded border border-accent-light bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-cta text-white font-semibold rounded hover:bg-cta-hover transition-colors"
                >
                  Send Inquiry
                </button>
                <p className="text-xs text-muted">
                  This opens your email client with the form details. No data is
                  stored on this site.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
