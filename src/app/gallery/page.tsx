import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of recent decks, kitchens, and bathrooms by Candlewood Carpentry in the Candlewood Lake area.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery | Candlewood Carpentry LLC", url: "/gallery" },
};

const PHOTOS = [
  { src: "/images/assets/deck.jpg", alt: "Finished deck", caption: "Deck build" },
  { src: "/images/assets/kitchen-1.jpg", alt: "Remodeled kitchen", caption: "Kitchen remodel" },
  { src: "/images/assets/bath.jpg", alt: "Renovated bathroom", caption: "Bathroom renovation" },
  { src: "/images/assets/kitchen-2.jpg", alt: "Kitchen with new cabinetry", caption: "Kitchen cabinetry and finish work" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="A closer look at the work." />
      <section className="section">
        <div className="wrap">
          <div className="gallery-grid">
            {PHOTOS.map((p) => (
              <figure key={p.src} className="gallery-item">
                <div className="photo">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                  />
                </div>
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
            {/* TODO: replace with real interior painting photo */}
            <figure className="gallery-item">
              <div className="placeholder">Interior painting photo coming soon</div>
              <figcaption>Interior painting</figcaption>
            </figure>
            {/* TODO: replace with real exterior painting photo */}
            <figure className="gallery-item">
              <div className="placeholder">Exterior painting photo coming soon</div>
              <figcaption>Exterior painting</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="section mist">
        <div className="wrap section-head center">
          <h2>Have a space you want changed?</h2>
          <p>Tell Chad what you have in mind and he will take it from there.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link href="/contact" className="btn">
              Request an Estimate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
