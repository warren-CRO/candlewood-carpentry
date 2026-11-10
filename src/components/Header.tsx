"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PHONE, PHONE_HREF, EMAIL, COMPANY } from "@/lib/constants";

const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#091725] text-white/75 text-xs">
        <div className="mx-auto max-w-[1180px] px-5 min-h-[34px] flex items-center justify-between gap-5">
          <span>Serving the Candlewood Lake area</span>
          <div className="hidden sm:flex gap-5">
            <a href={`mailto:${EMAIL}`} className="hover:text-white">
              {EMAIL}
            </a>
            <a href={PHONE_HREF} className="hover:text-white">
              {PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md text-white border-b border-white/8">
        <div className="mx-auto max-w-[1180px] px-5 min-h-[78px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/preferred-logo.png"
              alt={COMPANY}
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover border border-white/25"
            />
            <div>
              <span className="block font-extrabold text-[17px]">
                {COMPANY}
              </span>
              <span className="block text-[10px] tracking-[1.45px] uppercase text-white/60">
                Carpentry &bull; Painting &bull; Renovations
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 ml-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-white/80 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#contact"
            className="hidden md:inline-flex px-4 py-2.5 border border-white/25 rounded-full text-[13px] font-extrabold bg-white/5 hover:bg-white/10 ml-4"
          >
            Request an Estimate
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto p-2 text-white text-[26px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden px-5 py-5 space-y-3 bg-primary border-t border-white/8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-white/80 hover:text-white font-bold"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="block text-sky font-bold text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Request an Estimate
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
