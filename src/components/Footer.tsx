import Image from "next/image";
import Link from "next/link";
import {
  PHONE,
  PHONE_HREF,
  EMAIL,
  SERVICE_AREAS,
  COMPANY,
  OWNER,
  SERVICES,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Image
                src="/images/assets/logo-badge.png"
                alt=""
                width={56}
                height={56}
              />
              <span>Candlewood Carpentry</span>
            </div>
            <p>
              {OWNER}, owner.
              <br />
              Serving {SERVICE_AREAS.join(", ")} and the Candlewood Lake area of
              western Connecticut.
            </p>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={PHONE_HREF}>{PHONE}</a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
              <li>
                <Link href="/contact">Request an estimate</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          &copy; {new Date().getFullYear()} {COMPANY}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
