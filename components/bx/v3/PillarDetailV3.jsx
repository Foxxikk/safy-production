"use client";

import Image from "next/image";

import { thumb } from "@/lib/bxThumb";
import { v3 } from "@/lib/bxV3";
import { useLang } from "../LangContext";
import { TapeLink } from "../TapeTransition";
import Contact from "./Contact";
import V3Header from "./V3Header";

/** Stejná paleta jako u karet na úvodu — detail navazuje na dlaždici, ze které se přišlo. */
const SKINS = [
  { bg: "#373736", fg: "#FFFFFF", num: "#79D97C" },
  { bg: "#79D97C", fg: "#373736", num: "#373736" },
  { bg: "#FFFFFF", fg: "#373736", num: "#373736" },
  { bg: "#C6C6C6", fg: "#373736", num: "#373736" },
];

/**
 * Detail jedné služby ve stejné grafice jako detail reference:
 * rámeček s plným stínem, barevná hlavička, pruh s odrážkami, text
 * a pod tím reference ze stejné kategorie.
 */
export default function PillarDetailV3({
  pillar,
  next,
  index = 0,
  cases = [],
  categories = {},
  settings = {},
}) {
  const { lang } = useLang();
  const t = v3[lang] || v3.cs;
  const p = pillar[lang] || pillar.cs;
  const np = next?.[lang] || next?.cs;

  const skin = SKINS[index % SKINS.length];
  const n = String(index + 1).padStart(2, "0");
  const bullets = p.bullets || [];

  return (
    <div className="min-h-screen bg-ink">
      <V3Header />

      <main className="bx3-dots px-5 pb-24 pt-8 md:px-12 md:pb-[120px] md:pt-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <TapeLink href="/safy-bx/v3" className="bx3-btn mb-8">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden
            >
              <path d="M19 12H5M11 19l-7-7 7-7" />
            </svg>
            {lang === "cs" ? "Zpět na úvod" : "Back to home"}
          </TapeLink>

          <article
            className="overflow-hidden border-[3px] border-ink"
            style={{ boxShadow: "10px 10px 0 #373736" }}
          >
            {/* Hlavička v barvě karty, ze které se sem prokliklo */}
            <div className="p-7 md:p-[56px]" style={{ background: skin.bg, color: skin.fg }}>
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span
                  className="font-black"
                  style={{ fontSize: 72, lineHeight: 0.8, letterSpacing: "-0.05em", color: skin.num }}
                >
                  {n}
                </span>
                <span className="bx3-mono border border-current px-2.5 py-1.5 text-[12px]">
                  {lang === "cs" ? "Co děláme" : "What we do"}
                </span>
              </div>

              <h1
                className="m-0 max-w-[1100px] font-black uppercase"
                style={{
                  fontSize: "clamp(34px, 7.5vw, 120px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.035em",
                }}
              >
                {p.title}
              </h1>

              {(p.lead || p.text) && (
                <p
                  className="m-0 mt-7 max-w-[820px] font-light"
                  style={{ fontSize: "clamp(17px, 1.8vw, 25px)", lineHeight: 1.45 }}
                >
                  {p.lead || p.text}
                </p>
              )}
            </div>

            {/* Odrážky „Konkrétně" v pruhu pod hlavičkou */}
            {bullets.length > 0 && (
              <div className="grid grid-cols-1 border-t-[3px] border-ink bg-white md:grid-cols-3">
                {bullets.map((b, i) => (
                  <div
                    key={b}
                    className="border-b border-r border-[#C6C6C6] px-5 py-7 md:px-10"
                  >
                    <div
                      className="font-black uppercase"
                      style={{ fontSize: 28, lineHeight: 0.95, letterSpacing: "-0.02em" }}
                    >
                      <span className="bx3-hls">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-2.5 text-[16px] font-light leading-snug">{b}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Text o službě */}
            {(p.body || []).length > 0 && (
              <div className="flex flex-wrap gap-8 bg-white p-7 md:gap-12 md:p-[56px]">
                <p className="bx3-mono m-0 flex-1 basis-[200px] text-[13px]">
                  {lang === "cs" ? "Jak to děláme" : "How we do it"}
                </p>
                <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
                  {p.body.map((b, i) => (
                    <p key={i} className="m-0 text-[17px] font-light leading-relaxed md:text-[19px]">
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Reference ze stejné kategorie — důkaz, že to není jen slib */}
          {cases.length > 0 && (
            <>
              <h2
                className="mb-6 mt-14 font-black uppercase"
                style={{ fontSize: "clamp(26px, 4vw, 56px)", letterSpacing: "-0.03em" }}
              >
                {lang === "cs" ? "Kde to vidíte" : "Where to see it"}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => {
                  const d = c[lang] || c.cs || {};
                  return (
                    <TapeLink
                      key={c.slug}
                      href={`/safy-bx/v3/${c.slug}`}
                      className="group relative block h-[300px] overflow-hidden bg-ink"
                    >
                      {c.images?.[0] && (
                        <Image
                          src={thumb(c.images[0])}
                          alt=""
                          fill
                          sizes="33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(0deg, rgba(20,20,19,0.85) 0%, rgba(20,20,19,0.15) 60%)",
                        }}
                      />
                      <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <span className="bx3-mono block text-[11px] text-brand">
                          {categories[c.category] || ""}
                        </span>
                        <span className="mt-1 block text-[19px] font-black uppercase leading-tight">
                          {d.title}
                        </span>
                      </span>
                    </TapeLink>
                  );
                })}
              </div>
            </>
          )}

          {/* Další služba */}
          <div className="mt-14 flex flex-wrap justify-between gap-4 border-t-[3px] border-ink pt-7">
            <TapeLink href="/safy-bx/v3" className="bx3-btn">
              {lang === "cs" ? "Zpět na úvod" : "Back to home"}
            </TapeLink>

            {np && (
              <TapeLink
                href={`/safy-bx/v3/co-delame/${next.cs.slug}`}
                className="block text-right no-underline"
              >
                <span className="bx3-mono block text-[12px]">
                  {lang === "cs" ? "Další služba" : "Next service"}
                </span>
                <span
                  className="mt-1 block font-black uppercase"
                  style={{ fontSize: "clamp(22px, 4vw, 56px)", letterSpacing: "-0.02em" }}
                >
                  <span className="bx3-hls">{np.title}</span> →
                </span>
              </TapeLink>
            )}
          </div>
        </div>
      </main>

      <Contact t={t} settings={settings} words={t.tape} />
    </div>
  );
}
