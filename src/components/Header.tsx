"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href ? ("page" as const) : undefined;

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image
            src="/images/assets/logo-badge.png"
            alt="Candlewood Carpentry logo"
            width={68}
            height={68}
            priority
          />
          <span>
            <span className="brand-name">Candlewood Carpentry</span>
            <span className="brand-tag">Carpentry · Painting · Renovations</span>
          </span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current(l.href)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn light"
            onClick={() => setOpen(false)}
          >
            Request an Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
