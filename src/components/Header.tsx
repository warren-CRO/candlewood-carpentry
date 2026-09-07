"use client";

import Link from "next/link";
import { useState } from "react";
import { PHONE, PHONE_HREF } from "@/lib/constants";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-accent-light">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-primary font-semibold tracking-wide text-lg">
          CANDLEWOOD CARPENTRY
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            className="text-sm font-semibold text-cta hover:text-cta-hover"
          >
            {PHONE}
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-accent-light px-6 py-4 space-y-3 bg-background">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-muted hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            className="block font-semibold text-cta text-lg"
          >
            Call {PHONE}
          </a>
        </nav>
      )}
    </header>
  );
}
