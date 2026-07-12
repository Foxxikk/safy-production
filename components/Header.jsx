"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = {
  Company: [
    { label: "About us", href: "/about-us" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  Policy: [
    { label: "Cookie policy", href: "/cookie-policy" },
    { label: "Terms & Conditions", href: "/gdpr" },
    { label: "Privacy policy", href: "/gdpr" },
  ],
  "šafy": [
    { label: "Team", href: "/teams" },
    { label: "Services", href: "/services" },
    { label: "References", href: "/reference" },
    { label: "Careers", href: "/careers" },
    { label: "Our projects", href: "/our-projects" },
  ],
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dark = pathname.startsWith("/reference") || pathname.startsWith("/teams");

  const base = dark ? "bg-black text-white border-white/10" : "bg-white/95 text-ink border-black/5";

  // zavřít menu při změně stránky
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // zámek scrollu při otevřeném menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${base}`}>
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link href="/" aria-label="Šafy production">
            <Image
              src={dark ? "/images/logos/safy-white.svg" : "/images/logos/safy-logo.svg"}
              alt="šafy"
              width={96}
              height={37}
              priority
            />
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 text-lg font-medium hover:text-brand transition-colors"
            aria-label="Otevřít menu"
          >
            Menu
            <span className="flex flex-col gap-[5px]">
              <span className={`block w-7 h-0.5 ${dark ? "bg-white" : "bg-ink"}`} />
              <span className={`block w-7 h-0.5 ${dark ? "bg-white" : "bg-ink"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black text-white transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link href="/" aria-label="Šafy production">
            <Image src="/images/logos/safy-white.svg" alt="šafy" width={96} height={37} />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-lg font-medium hover:text-brand transition-colors"
            aria-label="Zavřít menu"
          >
            Close
            <span className="relative w-7 h-7">
              <span className="absolute top-1/2 left-0 w-7 h-0.5 bg-white rotate-45" />
              <span className="absolute top-1/2 left-0 w-7 h-0.5 bg-white -rotate-45" />
            </span>
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-6 h-[calc(100vh-5rem)] flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <h2 className="display-xl text-7xl md:text-9xl">Menu</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pb-16 md:pb-24">
            {Object.entries(menu).map(([title, items]) => (
              <div key={title}>
                <h3 className="font-bold text-2xl mb-5">{title}</h3>
                <ul className="space-y-3">
                  {items.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="text-lg text-white/50 hover:text-brand transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
