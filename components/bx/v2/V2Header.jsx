"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Doodle from "../Doodle";
import { useLang } from "../LangContext";
import { TapeLink } from "../TapeTransition";

/**
 * Hlavička scrollovací verze — leží nad stránkou a podle právě zobrazené
 * obrazovky přebarvuje logo i odkazy, ať drží kontrast na světlé i tmavé sekci.
 *
 * `tone` = "light" znamená světlý obsah (bílé texty) na tmavém podkladu.
 */
export default function V2Header({ tone = "dark", hidden = false, onContact }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = tone === "light";
  const link = light
    ? "text-white/70 hover:text-white"
    : "text-ink/60 hover:text-ink";
  const strong = light ? "text-white" : "text-ink";

  const nav = [
    { href: "/safy-bx/v2", label: lang === "cs" ? "Úvod" : "Home" },
    { href: "/safy-bx/o-nas", label: lang === "cs" ? "O nás" : "About us" },
  ];

  const LangSwitch = ({ className = link }) => (
    <div className={`flex items-center text-[12.5px] uppercase tracking-[0.1em] ${className}`}>
      {["cs", "en"].map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1.5 opacity-40">/</span>}
          <button
            onClick={() => setLang(l)}
            className={`uppercase transition-colors ${lang === l ? "text-brand" : ""}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    // Na kontaktní obrazovce hlavičku schováme — přes zelenou pásku by byla
    // nečitelná a všechny odkazy jsou i v patičce pod formulářem.
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 md:px-10 md:py-6">
        <TapeLink
          href="/safy-bx/v2"
          aria-label="ŠAFY BX"
          onClick={() => setOpen(false)}
          className="pointer-events-auto relative block aspect-[227/108] h-10 shrink-0 md:h-14"
        >
          <Image
            src="/images/logos/safy-bx-dark.svg"
            alt="ŠAFY BX"
            fill
            priority
            sizes="150px"
            className={`object-contain transition-opacity duration-500 ${light ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src="/images/logos/safy-bx-white.svg"
            alt=""
            aria-hidden
            fill
            sizes="150px"
            className={`object-contain transition-opacity duration-500 ${light ? "opacity-100" : "opacity-0"}`}
          />
        </TapeLink>

        {/* ——— Desktop ——— */}
        <nav className="pointer-events-auto hidden items-center gap-7 text-[13px] uppercase tracking-[0.12em] md:flex">
          {nav.map((n) => (
            <TapeLink key={n.href} href={n.href} className={`transition-colors ${link}`}>
              {n.label}
            </TapeLink>
          ))}

          <button
            onClick={onContact}
            className={`group relative font-bold uppercase transition-colors ${strong}`}
          >
            {lang === "cs" ? "Kontakt" : "Contact"}
            {/* Poměr stran necháváme na SVG — pevná výška by podtržení zkrátila */}
            <Doodle
              name="podtrzeni-3"
              className="absolute -bottom-[8px] left-0 w-[108%] text-brand"
              style={{ aspectRatio: "91 / 14" }}
            />
          </button>

          <LangSwitch />
        </nav>

        {/* ——— Mobil ——— */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Zavřít menu" : "Menu"}
          aria-expanded={open}
          className={`pointer-events-auto flex h-10 w-10 items-center justify-center border md:hidden ${
            light ? "border-white/30 text-white" : "border-ink/20 text-ink"
          }`}
        >
          <span className="relative block h-[10px] w-[18px]">
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-300 ${
                open ? "top-[4px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-300 ${
                open ? "top-[4px] -rotate-45" : "top-[8px]"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Rozbalené menu na mobilu */}
      <div
        className={`pointer-events-auto overflow-hidden bg-ink text-white transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-5">
          {nav.map((n) => (
            <TapeLink
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/15 py-4 text-[19px] font-medium"
            >
              {n.label}
            </TapeLink>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onContact?.();
            }}
            className="block w-full border-b border-white/15 py-4 text-left text-[19px] font-medium"
          >
            {lang === "cs" ? "Kontakt" : "Contact"}
          </button>
          <div className="mt-6">
            <LangSwitch className="text-white/70" />
          </div>
        </div>
      </div>
    </header>
  );
}
