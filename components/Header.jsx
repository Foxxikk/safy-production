"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "../lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Šafy production">
          <Image src="/images/logos/safy-logo.svg" alt="šafy" width={96} height={37} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[17px]">
          <Link href="/reference" className="hover:text-brand transition-colors">Reference</Link>
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link href="/services" className="hover:text-brand transition-colors inline-flex items-center gap-1">
              Services
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 4L6 8L10.5 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
            {servicesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
                <div className="bg-white shadow-xl border border-black/5 rounded-md py-3 w-72">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block px-5 py-2 hover:bg-brand/15 transition-colors"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/about-us" className="hover:text-brand transition-colors">About us</Link>
          <Link href="/contact" className="hover:text-brand transition-colors">Contact</Link>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-7 h-0.5 bg-ink transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-7 h-0.5 bg-ink ${open ? "opacity-0" : ""}`} />
          <span className={`block w-7 h-0.5 bg-ink transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-black/5 bg-white px-6 py-6 flex flex-col gap-4 text-lg">
          <Link href="/reference" onClick={() => setOpen(false)}>Reference</Link>
          <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/about-us" onClick={() => setOpen(false)}>About us</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
