"use client";

import Image from "next/image";

import { useLang } from "../LangContext";
import { TapeLink } from "../TapeTransition";

/** Tmavá hlavička, která leží na úvodní fotce a zůstává nahoře při scrollu. */
export default function V3Header() {
  const { lang, setLang } = useLang();

  return (
    <header
      className="sticky top-0 z-20 border-b border-white/[0.12] backdrop-blur-md"
      style={{ background: "rgba(55,55,54,0.88)" }}
    >
      <div className="mx-auto flex h-[84px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 md:px-12">
        <a href="#top" aria-label="Šafy — úvod" className="flex items-center gap-4 text-white">
          <Image
            src="/images/logos/safy-white.svg"
            alt="šafy"
            width={120}
            height={44}
            priority
            className="h-8 w-auto md:h-11"
          />
          <span className="hidden text-[14px] font-light leading-tight sm:block">
            Brand Experience
            <br />
            <b className="font-bold">marketing</b>
          </span>
        </a>

        <nav className="flex flex-wrap items-center gap-5 md:gap-7">
          <a className="bx3-navlink hidden md:inline" href="#pilire">
            {lang === "cs" ? "Co děláme" : "What we do"}
          </a>
          <a className="bx3-navlink hidden md:inline" href="#reference">
            {lang === "cs" ? "Reference" : "Work"}
          </a>

          <div className="flex items-center text-[12.5px] uppercase tracking-[0.1em] text-white/60">
            {["cs", "en"].map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="mx-1.5 opacity-50">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`uppercase transition-colors ${
                    lang === l ? "text-brand" : "hover:text-white"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>

          <a className="bx3-btn g" href="#kontakt" style={{ minHeight: 44 }}>
            {lang === "cs" ? "Kontakt" : "Contact"}
          </a>
        </nav>
      </div>
    </header>
  );
}

/** Odkaz na podstránku se stejným vzhledem jako tlačítka v návrhu. */
export function V3Link({ href, children, className = "" }) {
  return (
    <TapeLink href={href} className={`bx3-btn ${className}`}>
      {children}
    </TapeLink>
  );
}
