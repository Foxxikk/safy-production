"use client";

import Image from "next/image";

import { officeSK, social } from "@/lib/bxV3";
import Tapes from "./Tapes";

const ACCENT = "#79D97C";
const INK = "#373736";

/**
 * Patička „Pojďme něco postavit".
 *
 * Oproti návrhu je sevřenější a plní celou šířku — claim a e-mail vedle
 * adres, logo jako pás přes celý blok. Původně zbývalo vpravo i dole hodně
 * prázdna a patička působila nedodělaně.
 */
export default function Contact({ t, settings = {}, words = [] }) {
  const email = settings.email || "info@safyproduction.cz";

  const columns = [
    {
      label: "Praha",
      lines: [
        settings.company || "Šafy production s.r.o.",
        settings.address || "Údolní 212/1, 147 00 Praha 4",
      ],
    },
    { label: officeSK.city, lines: [officeSK.company, officeSK.address] },
  ];

  return (
    <footer id="kontakt" className="relative overflow-hidden bg-ink text-white">
      <Tapes words={words} top={INK} bottom={INK} brand />

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-4 md:px-12">
        <p className="bx3-mono m-0 mb-5 text-[13px]" style={{ color: ACCENT }}>
          {t.contactLabel}
        </p>

        <h2
          className="m-0 font-black uppercase"
          style={{ fontSize: "clamp(40px, 9vw, 150px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
        >
          {t.contactTitle[0]}
          <br />
          {t.contactTitle[1]} <span className="bx3-hl">{t.contactTitle[2]}</span>
        </h2>

        {/* E-mail vlevo, adresy vpravo — jinak zůstávala polovina šířky prázdná */}
        <div className="mt-12 grid gap-10 border-t border-[#5A5A58] pt-10 md:mt-16 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-4 font-bold text-white"
              style={{ fontSize: "clamp(20px, 2.6vw, 38px)" }}
            >
              <span
                style={{
                  textDecoration: "underline",
                  textDecorationColor: ACCENT,
                  textUnderlineOffset: 10,
                  textDecorationThickness: 4,
                }}
              >
                {email}
              </span>
              <span
                aria-hidden
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-ink transition-transform duration-300 group-hover:translate-x-1"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>

          <div className="grid gap-8 text-[16px] font-light leading-relaxed text-[#E6E6E6] sm:grid-cols-3 md:col-span-7">
            {columns.map((c) => (
              <div key={c.label}>
                <div className="bx3-mono mb-2 text-[12px] text-[#C6C6C6]">{c.label}</div>
                {c.lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <div className="bx3-mono mb-1 text-[12px] text-[#C6C6C6]">{t.follow}</div>
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Logo jako pás přes celou šířku, copyright na stejné lince */}
        <div className="mt-14 border-t border-[#5A5A58] pt-10 md:mt-20">
          <Image
            src="/images/logos/safy-white.svg"
            alt="šafy"
            width={1440}
            height={520}
            className="block h-auto w-full"
          />
          <p className="bx3-mono mt-6 text-right text-[12px] text-[#C6C6C6]">
            © {new Date().getFullYear()} — We are šafy
          </p>
        </div>
      </div>
    </footer>
  );
}
