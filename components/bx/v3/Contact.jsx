"use client";

import Image from "next/image";

import { officeSK, social } from "@/lib/bxV3";

const ACCENT = "#79D97C";

/** Patička „Pojďme něco postavit" — pásky na tečkovaném pruhu a pak tmavý blok. */
export default function Contact({ t, settings = {} }) {
  const email = settings.email || "info@safyproduction.cz";
  const tape = Array.from({ length: 14 });

  return (
    <footer id="kontakt" className="relative overflow-hidden bg-ink text-white">
      {/* Překřížené pásky na světlém pruhu, který dole přechází do tmavé */}
      <div aria-hidden className="bx3-dots relative h-[140px]">
        <div
          className="absolute -left-10 -right-10 top-[44px] overflow-hidden bg-brand py-2.5 text-ink"
          style={{ transform: "rotate(1.8deg)" }}
        >
          <div className="bx3-marq slow">
            {tape.map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-5 text-[24px] font-black uppercase"
              >
                We are šafy ×
              </span>
            ))}
          </div>
        </div>
        <div
          className="absolute -left-10 -right-10 top-[62px] overflow-hidden py-[9px] text-white"
          style={{ transform: "rotate(-2.4deg)", background: "#1F1F1E" }}
        >
          <div className="bx3-marq rev slow">
            {tape.map((_, i) => (
              <span key={i} className="whitespace-nowrap px-5 text-[18px] font-light">
                Brand experience <b className="font-black">marketing</b>{" "}
                <span style={{ color: ACCENT }}>×</span>
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[34px] bg-ink" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-16 md:px-12 md:pt-[72px]">
        <p className="bx3-mono m-0 mb-5 text-[13px]" style={{ color: ACCENT }}>
          {t.contactLabel}
        </p>

        <h2
          className="m-0 font-black uppercase"
          style={{ fontSize: "clamp(40px, 9vw, 150px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
        >
          {t.contactTitle[0]}
          <br />
          {t.contactTitle[1]}{" "}
          <span
            style={{
              background: `linear-gradient(to bottom, transparent 40%, ${ACCENT} 40%, ${ACCENT} 94%, transparent 94%)`,
              color: "#373736",
              padding: "0 0.1em",
            }}
          >
            {t.contactTitle[2]}
          </span>
        </h2>

        <a
          href={`mailto:${email}`}
          className="mt-10 inline-block font-bold text-white md:mt-11"
          style={{
            fontSize: "clamp(20px, 3vw, 40px)",
            textDecoration: "underline",
            textDecorationColor: ACCENT,
            textUnderlineOffset: 10,
            textDecorationThickness: 4,
          }}
        >
          {email}
        </a>

        <div
          className="mt-16 flex flex-wrap gap-10 border-t pt-7 text-[16px] font-light leading-relaxed md:mt-[88px] md:gap-12"
          style={{ borderColor: "#5A5A58", color: "#E6E6E6" }}
        >
          <div className="flex-1 basis-[220px]">
            <div className="bx3-mono mb-2 text-[12px]" style={{ color: "#C6C6C6" }}>
              Praha
            </div>
            {settings.company || "Šafy production s.r.o."}
            <br />
            {settings.address || "Údolní 212/1, 147 00 Praha 4"}
          </div>

          <div className="flex-1 basis-[220px]">
            <div className="bx3-mono mb-2 text-[12px]" style={{ color: "#C6C6C6" }}>
              {officeSK.city}
            </div>
            {officeSK.company}
            <br />
            {officeSK.address}
          </div>

          <div className="flex flex-1 basis-[220px] flex-col gap-1">
            <div className="bx3-mono mb-1 text-[12px]" style={{ color: "#C6C6C6" }}>
              {t.follow}
            </div>
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

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 md:mt-[88px]">
          <Image
            src="/images/logos/safy-white.svg"
            alt="šafy"
            width={720}
            height={260}
            className="block h-auto w-[min(720px,100%)]"
          />
          <span className="bx3-mono text-[12px]" style={{ color: "#C6C6C6" }}>
            © {new Date().getFullYear()} — We are šafy
          </span>
        </div>
      </div>
    </footer>
  );
}
