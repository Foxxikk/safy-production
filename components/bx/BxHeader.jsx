"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "./LangContext";
import { useTheme } from "./ThemeContext";
import { TapeLink } from "./TapeTransition";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function BxHeader() {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Otevřené menu na mobilu překrývá stránku — pod ním se nemá scrollovat.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const nav = [
    { href: "/safy-bx", label: lang === "cs" ? "Úvod" : "Home" },
    { href: "/safy-bx/o-nas", label: lang === "cs" ? "O nás" : "About us" },
  ];

  const langSwitch = (
    <div className="flex items-center text-[13px]">
      {["cs", "en"].map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1.5 text-ink/20 dark:text-white/20">/</span>}
          <button
            onClick={() => setLang(l)}
            className={`uppercase transition-colors ${
              lang === l
                ? "text-ink dark:text-white"
                : "text-ink/35 dark:text-white/35 hover:text-ink dark:hover:text-white"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-dark/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        {/* Logo ŠAFY BX — obě varianty leží přes sebe a přepínají se průhledností.
            Přepínání přes hidden/block se s naší dark variantou nechovalo spolehlivě. */}
        <TapeLink
          href="/safy-bx"
          aria-label="ŠAFY BX"
          onClick={() => setMenuOpen(false)}
          className="relative block h-9 md:h-11 aspect-[227/108] shrink-0"
        >
          <Image
            src="/images/logos/safy-bx-dark.svg"
            alt="ŠAFY BX"
            fill
            priority
            sizes="120px"
            className="object-contain opacity-100 dark:opacity-0 transition-opacity"
          />
          <Image
            src="/images/logos/safy-bx-white.svg"
            alt=""
            aria-hidden
            fill
            sizes="120px"
            className="object-contain opacity-0 dark:opacity-100 transition-opacity"
          />
        </TapeLink>

        {/* ——— Desktop ——— */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center gap-6 text-[14px]">
            {nav.map((n) => (
              <TapeLink
                key={n.href}
                href={n.href}
                className="text-ink/55 dark:text-white/55 hover:text-ink dark:hover:text-white transition-colors"
              >
                {n.label}
              </TapeLink>
            ))}
          </nav>

          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Světlý režim" : "Tmavý režim"}
            className="flex h-8 w-8 items-center justify-center border border-ink/15 dark:border-white/20 text-ink/60 dark:text-white/60 hover:border-ink/50 dark:hover:border-white/60 transition-colors"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {langSwitch}

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-ink dark:bg-white text-white dark:text-ink pl-5 pr-1.5 py-1.5 text-[14px] hover:bg-ink/80 dark:hover:bg-white/80 transition-colors"
          >
            {lang === "cs" ? "Poptávka" : "Enquiry"}
            <span className="inline-flex h-7 w-7 items-center justify-center bg-white dark:bg-ink text-ink dark:text-white group-hover:bg-ink group-hover:text-white dark:group-hover:bg-ink transition-colors">
              →
            </span>
          </a>
        </div>

        {/* ——— Mobil: vše schované pod jedno tlačítko ——— */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Zavřít menu" : "Menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex h-10 w-10 items-center justify-center border border-ink/15 dark:border-white/20 text-ink dark:text-white"
        >
          <span className="relative block h-[10px] w-[18px]">
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-[4px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-[4px] -rotate-45" : "top-[8px]"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Rozbalené menu na mobilu */}
      <div
        className={`md:hidden overflow-hidden border-t border-black/10 dark:border-white/15 bg-white dark:bg-dark transition-[max-height,opacity] duration-300 ${
          menuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-5">
          <nav className="flex flex-col">
            {nav.map((n) => (
              <TapeLink
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-black/10 dark:border-white/15 py-4 text-[19px] font-medium dark:text-white"
              >
                {n.label}
              </TapeLink>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="border-b border-black/10 dark:border-white/15 py-4 text-[19px] font-medium dark:text-white"
            >
              {lang === "cs" ? "Poptávka" : "Enquiry"}
            </a>
          </nav>

          <div className="mt-6 flex items-center justify-between">
            {langSwitch}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Světlý režim" : "Tmavý režim"}
              className="flex items-center gap-2 text-[13px] text-ink/55 dark:text-white/55"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              {theme === "dark"
                ? lang === "cs"
                  ? "Světlý režim"
                  : "Light mode"
                : lang === "cs"
                ? "Tmavý režim"
                : "Dark mode"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
