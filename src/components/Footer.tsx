import { PHONE, PHONE_HREF, EMAIL } from "@/lib/constants";

const SERVICE_AREAS = [
  "Shelton",
  "New Fairfield",
  "New Milford",
  "Brookfield",
  "Bethel",
];

export function Footer() {
  return (
    <footer className="bg-primary text-accent-light">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">
              Candlewood Carpentry
            </h3>
            <p className="text-sm leading-relaxed opacity-80">
              General contractor serving western Connecticut.
              <br />
              Licensed &amp; Insured.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p>
                <a href={PHONE_HREF} className="hover:text-white">
                  {PHONE}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:text-white"
                >
                  {EMAIL}
                </a>
              </p>
              <p>Mon–Fri 7am–5pm</p>
              <p>Saturday by appointment</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Service Area</h4>
            <ul className="text-sm opacity-80 space-y-1">
              {SERVICE_AREAS.map((area) => (
                <li key={area}>{area}, CT</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Candlewood Carpentry. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
