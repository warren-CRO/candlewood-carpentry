import Image from "next/image";
import { SERVICE_AREAS, PHONE, PHONE_HREF } from "@/lib/constants";

export function ServiceArea() {
  return (
    <section className="section navy">
      <div className="wrap split">
        <div>
          <p className="eyebrow">Service area</p>
          <h2>Working around Candlewood Lake and nearby.</h2>
          <p>
            Based in New Fairfield, Chad takes on projects in these towns. Not
            sure if you are in range? Call{" "}
            <a href={PHONE_HREF} style={{ color: "#fff" }}>
              {PHONE}
            </a>{" "}
            and ask.
          </p>
          <ul className="towns">
            {SERVICE_AREAS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="photo">
          <Image
            src="/images/assets/deck.jpg"
            alt="A finished deck built by Candlewood Carpentry"
            fill
            sizes="(max-width: 980px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}
