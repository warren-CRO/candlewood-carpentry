import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PHONE,
  PHONE_HREF,
  SERVICES,
  SERVICE_DETAILS,
  TESTIMONIALS,
} from "@/lib/constants";
import { ServiceArea } from "@/components/ServiceArea";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const STEPS = [
  {
    title: "Tell Chad about it",
    text: "Call, text, or send the form with a few photos. Chad reads every request himself.",
  },
  {
    title: "Get an estimate",
    text: "Chad walks the job, asks real questions, and gives you a clear scope and price.",
  },
  {
    title: "Get it done right",
    text: "The work gets done on schedule, the site stays clean, and you deal with the owner the whole way.",
  },
];

const WORK = [
  { src: "/images/assets/deck.jpg", tag: "Decks", caption: "Deck build with clean railings and stairs", alt: "Finished deck" },
  { src: "/images/assets/kitchen-1.jpg", tag: "Kitchens", caption: "Kitchen remodel with new cabinetry", alt: "Remodeled kitchen" },
  { src: "/images/assets/bath.jpg", tag: "Baths", caption: "Bathroom renovation, finished to the details", alt: "Renovated bathroom" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="eyebrow">Thoughtful work. Lasting results.</p>
            <h1>Craftsmanship that feels right at home.</h1>
            <p className="lede">
              Renovations, remodels, decks, painting, and carpentry from a local
              owner-operator who answers his own phone.
            </p>
            <div className="btn-row">
              <Link href="/contact" className="btn light">
                Request an Estimate
              </Link>
              <a href={PHONE_HREF} className="btn ghost">
                Call {PHONE}
              </a>
            </div>
          </div>
          <div className="hero-photos">
            <div className="photo">
              <Image
                src="/images/assets/kitchen-1.jpg"
                alt="Kitchen remodeled by Candlewood Carpentry"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 540px"
              />
            </div>
            <div className="photo">
              <Image
                src="/images/assets/deck.jpg"
                alt="Deck built by Candlewood Carpentry"
                fill
                sizes="(max-width: 980px) 100vw, 540px"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="cards-wrap">
        <div className="wrap">
          <div className="cards">
            {SERVICES.map((s) => (
              <Link key={s.id} href={`/services#${s.id}`} className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SERVICE_DETAILS[s.id].icon} alt="" width={76} height={76} />
                <h3>{s.title}</h3>
                <p>{SERVICE_DETAILS[s.id].short}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2>Simple, from the first call to the last coat.</h2>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="step">
                <div className="num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section mist">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Selected work</p>
            <h2>Recent projects around the lake.</h2>
          </div>
          <div className="work-grid">
            {WORK.map((w) => (
              <div key={w.src} className="work-item">
                <div className="photo">
                  <Image
                    src={w.src}
                    alt={w.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 370px"
                  />
                </div>
                <span className="tag">{w.tag}</span>
                <p>{w.caption}</p>
              </div>
            ))}
          </div>
          <div className="center-row">
            <Link href="/gallery" className="btn">
              View full gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Image
            src="/images/assets/logo-badge.png"
            alt="Candlewood Carpentry badge showing a carpenter on a water ski"
            width={400}
            height={400}
            className="badge-big"
          />
          <div>
            <p className="eyebrow">Meet Chad</p>
            <h2>Yes, that is a carpenter on a water ski.</h2>
            <p>
              The badge says it: serious about the work, not so serious about
              himself. Chad Colesworthy is the owner, the estimator, and the
              guy on the job.
            </p>
            <p>
              When you hire Candlewood Carpentry, you get straight answers, a
              clean site, and a finished result you can feel good about.
            </p>
            <div className="btn-row">
              <Link href="/about" className="btn outline">
                About Chad
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section mist">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Reviews</p>
            <h2>What neighbors say.</h2>
          </div>
          <div className="reviews">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <blockquote key={t.name} className="review">
                <div className="stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>{t.quote}</p>
                <footer>
                  {t.name}
                  <span>
                    {t.project} · {t.location}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ServiceArea />
      <CTABand />
    </>
  );
}
