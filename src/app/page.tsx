import Image from "next/image";
import Link from "next/link";
import {
  PHONE,
  PHONE_HREF,
  SMS_HREF,
  EMAIL,
  OWNER,
  COMPANY,
  SERVICE_AREAS,
  SERVICES,
  TESTIMONIALS,
} from "@/lib/constants";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

const TRUST = [
  "Licensed & Insured",
  "Owner on Every Job",
  "Free Estimates",
  "Candlewood Lake Area",
];

const BEFORE_AFTER = [
  {
    before: "/images/kitchen-remodel.jpg",
    after: "/images/project-kitchen.jpg",
    beforeAlt: "Kitchen before renovation",
    afterAlt: "Kitchen after renovation by Candlewood Carpentry",
    label: "Kitchen remodel — New Fairfield, CT",
  },
  {
    before: "/images/construction-progress.jpg",
    after: "/images/project-bath.jpg",
    beforeAlt: "Bathroom before renovation",
    afterAlt: "Bathroom after renovation by Candlewood Carpentry",
    label: "Bathroom renovation — Brookfield, CT",
  },
];

function StarIcon() {
  return (
    <svg className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative text-white overflow-hidden" style={{background: "radial-gradient(circle at 75% 18%, #2a527a 0, #193c5e 25%, #0d1f31 65%)"}}>
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full max-w-[380px] mb-8 rounded-2xl overflow-hidden bg-[#0b1a2a] border border-white/15 shadow-2xl">
                <Image
                  src="/images/preferred-logo.png"
                  alt={`${COMPANY} logo`}
                  width={760}
                  height={760}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-10 h-px bg-sky-muted" />
                <span className="text-[11px] font-black tracking-[2.2px] uppercase text-sky-muted">
                  Thoughtful work. Lasting results.
                </span>
              </div>
              <h1 className="text-[clamp(45px,5vw,67px)] leading-[1.01] tracking-[-3px] text-balance">
                Craftsmanship that feels right at home.
              </h1>
            </div>

            <div className="relative min-h-[420px] md:min-h-[500px]">
              <div className="absolute inset-[26px_46px_60px_24px] rounded-3xl overflow-hidden shadow-2xl border border-white/12">
                <Image src="/images/project-kitchen.jpg" alt="Kitchen renovation" fill className="object-cover" priority />
              </div>
              <div className="absolute right-0 top-0 w-[190px] h-[138px] rounded-2xl overflow-hidden border-[6px] border-white shadow-2xl">
                <Image src="/images/project-deck.jpg" alt="Deck project" fill className="object-cover" />
              </div>
              <div className="absolute left-0 bottom-5 w-[175px] h-[132px] rounded-2xl overflow-hidden border-[6px] border-white shadow-2xl">
                <Image src="/images/project-bath.jpg" alt="Bathroom remodel" fill className="object-cover" />
              </div>
              <div className="absolute right-0 bottom-[18px] w-[285px] bg-[rgba(9,23,37,0.94)] border border-white/14 rounded-2xl p-[18px] shadow-2xl">
                <span className="block text-[10px] tracking-[1.7px] text-sky-muted font-black mb-1.5">NO JOB TOO BIG OR SMALL</span>
                <strong className="text-lg leading-tight">Home improvements built around your space.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-gradient-to-r from-[#faf8f4] to-[#eef4fa] border-b border-line">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {TRUST.map((item, i) => (
              <div
                key={item}
                className={`py-6 px-6 ${i < 3 ? "border-r border-line" : ""}`}
              >
                <strong className="block text-[17px] text-primary">{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-11">
            <div>
              <span className="block text-[10px] tracking-[2px] font-black uppercase text-muted mb-3">Services</span>
              <h2 className="text-[clamp(36px,5vw,58px)] leading-[1.04] tracking-[-2px]">
                One local company for the projects that change how your home looks and feels.
              </h2>
            </div>
            <p className="max-w-[380px] text-muted text-base">
              From a fresh coat of paint to a larger remodel, {COMPANY} can help with the work that keeps getting pushed down the list.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="group relative min-h-[300px] border border-line rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#f8fafc] shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <span className="block text-[11px] tracking-[2px] font-black text-sky mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[22px] font-bold text-primary mb-2">{service.title}</h3>
                  <p className="text-sm text-muted">{service.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-gradient-to-b from-white to-[#f6f8fa]">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-11">
            <div>
              <span className="block text-[10px] tracking-[2px] font-black uppercase text-muted mb-3">What People Say</span>
              <h2 className="text-[clamp(36px,5vw,50px)] leading-[1.08] tracking-[-2px] max-w-[600px]">
                The work speaks for itself — and so do the people we&apos;ve built for.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="text-sm font-bold text-primary">5.0</span>
              <span className="text-sm text-muted">from {TESTIMONIALS.length} reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-7 rounded-2xl border border-line bg-white"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="text-muted leading-relaxed mb-5 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-line pt-4">
                  <p className="font-bold text-primary text-sm">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.location} &middot; {t.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before & After Gallery ── */}
      <section id="gallery" className="py-24 bg-gradient-to-b from-[#10263d] to-[#0a1a2a] text-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-11">
            <div>
              <span className="block text-[10px] tracking-[2px] font-black uppercase text-sky-muted mb-3">Selected Work</span>
              <h2 className="text-[clamp(36px,5vw,58px)] leading-[1.04] tracking-[-2px]">
                See the difference.
              </h2>
            </div>
            <p className="max-w-[380px] text-white/70 text-base">
              Drag the slider to compare before and after. Real projects from the Candlewood Lake area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BEFORE_AFTER.map((item) => (
              <BeforeAfterSlider
                key={item.label}
                before={item.before}
                after={item.after}
                beforeAlt={item.beforeAlt}
                afterAlt={item.afterAlt}
                label={item.label}
              />
            ))}
          </div>

          {/* Static gallery cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { src: "/images/project-deck.jpg", title: "Decks", sub: "Outdoor upgrades & railing work" },
              { src: "/images/project-kitchen.jpg", title: "Kitchen Remodel", sub: "Clean, updated finishes" },
              { src: "/images/project-bath.jpg", title: "Bath Remodel", sub: "Bathroom upgrades & finish work" },
            ].map((card) => (
              <div
                key={card.title}
                className="relative min-h-[320px] rounded-2xl overflow-hidden border border-white/12 shadow-lg"
              >
                <Image src={card.src} alt={card.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute left-6 right-6 bottom-5 z-10">
                  <span className="block text-[10px] tracking-[1.8px] font-black text-sky-muted uppercase">{card.title}</span>
                  <strong className="block text-[20px] mt-1 leading-tight">{card.sub}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Chad ── */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#f6f8fa] to-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="grid grid-cols-1 md:grid-cols-[0.72fr_1.28fr] gap-12 items-center">
            <div className="bg-gradient-to-br from-[#10283f] to-[#1c456a] rounded-3xl p-5 shadow-2xl">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/carpenter-working.jpg"
                  alt={`${OWNER} — owner of ${COMPANY}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-white/60 text-xs mt-3 italic">
                Replace with a real photo of Chad on a job site
              </p>
            </div>

            <div>
              <span className="block text-[10px] tracking-[2px] font-black uppercase text-muted mb-3">About {COMPANY}</span>
              <h2 className="text-[clamp(36px,5vw,52px)] leading-[1.08] tracking-[-2px] mb-6">
                Local work. Straight answers. A finished result you can feel good about.
              </h2>
              <p className="text-muted text-[17px] leading-relaxed mb-4">
                {COMPANY} serves the Candlewood Lake area with renovations, kitchen and bath remodels, decks, painting, and all carpentry needs. The focus is simple: dependable work, clear communication, and attention to the details that make a project feel complete.
              </p>
              <p className="text-muted text-[17px] leading-relaxed mb-8">
                {OWNER} is on every job. The person you shake hands with at the estimate is the person who builds your home. That&apos;s not a marketing line — it&apos;s how the company works.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Owner", value: OWNER },
                  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
                  { label: "Phone", value: PHONE, href: PHONE_HREF },
                ].map((item) => (
                  <div key={item.label} className="p-4 border border-line rounded-2xl bg-white">
                    <span className="block text-[10px] tracking-[1.6px] text-muted font-black uppercase mb-1.5">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-extrabold text-primary hover:text-cta">{item.value}</a>
                    ) : (
                      <strong className="text-sm font-extrabold text-primary">{item.value}</strong>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Area ── */}
      <section className="py-16 bg-white border-y border-line">
        <div className="mx-auto max-w-[1180px] px-5 text-center">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Serving Western Connecticut
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="px-5 py-2 bg-[#f6f8fa] rounded-full text-sm font-medium text-primary border border-line"
              >
                {area}, CT
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-24" style={{background: "linear-gradient(135deg, #ebe3d7, #f8f5ef)"}}>
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <span className="block text-[10px] tracking-[2px] font-black uppercase text-muted mb-3">Start a Project</span>
              <h2 className="text-[clamp(36px,5vw,52px)] leading-[1.08] tracking-[-2px] mb-4">
                Tell Chad what you have in mind.
              </h2>
              <p className="text-muted text-[17px] mb-8">
                Call, text, or email with a quick description. Photos are helpful if you already have them.
              </p>
              <div className="flex flex-col gap-2.5">
                <a href={PHONE_HREF} className="inline-flex items-center px-4 py-3 bg-primary text-white rounded-xl font-extrabold text-sm">
                  Call {PHONE}
                </a>
                <a href={SMS_HREF} className="inline-flex items-center px-4 py-3 bg-primary text-white rounded-xl font-extrabold text-sm">
                  Text {PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="inline-flex items-center px-4 py-3 bg-primary text-white rounded-xl font-extrabold text-sm">
                  {EMAIL}
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <div className="bg-white border border-[#ded8cd] rounded-2xl p-7 shadow-md">
      <h3 className="text-[22px] font-black mb-5">Quick Estimate Request</h3>
      <form
        action={`mailto:${EMAIL}`}
        method="GET"
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-black mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full border border-line rounded-xl px-4 py-3.5 bg-[#fbfcfd] text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-black mb-1.5">
              Phone <span className="text-muted font-bold text-[10px] ml-1">Optional</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Your phone number"
              className="w-full border border-line rounded-xl px-4 py-3.5 bg-[#fbfcfd] text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/10"
            />
          </div>
          <div>
            <label className="block text-xs font-black mb-1.5">
              Email <span className="text-muted font-bold text-[10px] ml-1">Optional</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className="w-full border border-line rounded-xl px-4 py-3.5 bg-[#fbfcfd] text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/10"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black mb-1.5">Town</label>
          <input
            type="text"
            name="town"
            placeholder="Your town"
            className="w-full border border-line rounded-xl px-4 py-3.5 bg-[#fbfcfd] text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/10"
          />
        </div>
        <div>
          <label className="block text-xs font-black mb-1.5">Project</label>
          <textarea
            name="project"
            required
            rows={3}
            placeholder="Describe the project — painting, renovation, deck, kitchen, bath, carpentry, etc."
            className="w-full border border-line rounded-xl px-4 py-3.5 bg-[#fbfcfd] text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/10 resize-y"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`sms:+12034707424`}
            className="flex items-center justify-center px-4 py-3.5 bg-[#c0392b] text-white rounded-xl font-extrabold text-sm hover:bg-[#a93226] transition-colors"
          >
            Text Chad
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center justify-center px-4 py-3.5 border-2 border-primary text-primary rounded-xl font-extrabold text-sm hover:bg-primary hover:text-white transition-colors"
          >
            Email Chad
          </a>
        </div>
        <p className="text-[11px] text-muted text-center">
          Choose how you&apos;d like to send your request. Your details are filled into the message for you.
        </p>
      </form>
    </div>
  );
}
