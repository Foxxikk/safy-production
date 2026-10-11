"use client";

import { useState } from "react";
import Image from "next/image";

import { thumb } from "@/lib/bxThumb";
import { v3 } from "@/lib/bxV3";
import { useLang } from "../LangContext";
import Lightbox from "../Lightbox";
import { TapeLink } from "../TapeTransition";
import Contact from "./Contact";
import V3Header from "./V3Header";

/** Rytmus galerie — stejný jako v návrhu, dokola se opakuje. */
const GALLERY = [
  { span: 8, h: 520 },
  { span: 4, h: 520 },
  { span: 4, h: 360 },
  { span: 4, h: 360 },
  { span: 4, h: 360 },
  { span: 7, h: 440 },
  { span: 5, h: 440 },
];

/**
 * Detail reference v nové grafice: hlavička s fotkou projektu, pruh s fakty,
 * text a galerie v rámečku s plným stínem.
 */
export default function CaseDetailV3({ item, next, categories = {}, settings = {}, index = 0 }) {
  const { lang } = useLang();
  const t = v3[lang] || v3.cs;
  const d = item[lang] || item.cs || {};
  const nd = next?.[lang] || next?.cs || {};
  const facts = item.facts?.[lang]?.length ? item.facts[lang] : item.facts?.cs || [];
  const gallery = (item.images || []).slice(1);
  const [shot, setShot] = useState(null);

  const n = String(index + 1).padStart(2, "0");
  const category = categories[item.category] || "";

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
            {lang === "cs" ? "Zpět na reference" : "Back to work"}
          </TapeLink>

          <article
            className="overflow-hidden border-[3px] border-ink"
            style={{ boxShadow: "10px 10px 0 #373736" }}
          >
            {/* Hlavička — titulní fotka projektu pod tmavým přechodem */}
            <div className="relative text-white">
              {item.images?.[0] && (
                <Image
                  src={item.images[0]}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(20,20,19,0.9) 0%, rgba(20,20,19,0.45) 55%, rgba(20,20,19,0.55) 100%)",
                }}
              />
              <div className="relative p-7 md:p-[56px]">
                <div className="mb-7 flex flex-wrap gap-2.5">
                  <span className="bx3-mono bg-brand px-[11px] py-[7px] text-[12px] text-ink">
                    {n} / {d.title}
                  </span>
                  {category && (
                    <span className="bx3-mono border border-current px-2.5 py-1.5 text-[12px]">
                      {category}
                    </span>
                  )}
                </div>

                <h1
                  className="m-0 max-w-[1100px] font-black uppercase"
                  style={{
                    fontSize: "clamp(34px, 7.5vw, 120px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {d.title}
                </h1>

                {d.intro && (
                  <p
                    className="m-0 mt-7 max-w-[820px] font-light"
                    style={{ fontSize: "clamp(17px, 1.8vw, 25px)", lineHeight: 1.45 }}
                  >
                    {d.intro}
                  </p>
                )}

                {d.subtitle && (
                  <p className="bx3-mono m-0 mt-5 text-[13px] opacity-85">{d.subtitle}</p>
                )}
              </div>
            </div>

            {/* Čísla projektu */}
            {facts.length > 0 && (
              <div className="grid grid-cols-1 border-t-[3px] border-ink bg-white md:grid-cols-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="border-b border-r border-[#C6C6C6] px-5 py-7 md:px-10"
                  >
                    <div
                      className="font-black uppercase"
                      style={{
                        fontSize: "clamp(28px, 3.6vw, 52px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      <span className="bx3-hls">{f.value}</span>
                    </div>
                    <div className="mt-2.5 text-[16px] font-light leading-snug">{f.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Text o projektu */}
            {(d.body || []).length > 0 && (
              <div className="flex flex-wrap gap-8 bg-white p-7 md:gap-12 md:p-[56px]">
                <p className="bx3-mono m-0 flex-1 basis-[200px] text-[13px]">
                  {lang === "cs" ? "O projektu" : "About the project"}
                </p>
                <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
                  {d.body.map((b, i) => (
                    <p key={i} className="m-0 text-[17px] font-light leading-relaxed md:text-[19px]">
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Galerie */}
          {gallery.length > 0 && (
            <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-12">
              {gallery.map((src, i) => {
                const g = GALLERY[i % GALLERY.length];
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`${d.title} — ${lang === "cs" ? "fotka" : "photo"} ${i + 1}`}
                    className="bx3-gcell relative block overflow-hidden"
                    style={{ gridColumn: `span ${g.span}`, height: g.h }}
                  >
                    <Image
                      src={thumb(src)}
                      alt=""
                      fill
                      sizes={g.span >= 7 ? "66vw" : "33vw"}
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Další projekt */}
          <div className="mt-14 flex flex-wrap justify-between gap-4 border-t-[3px] border-ink pt-7">
            <TapeLink href="/safy-bx/v3" className="bx3-btn">
              {lang === "cs" ? "Všechny reference" : "All work"}
            </TapeLink>

            {next && (
              <TapeLink href={`/safy-bx/v3/${next.slug}`} className="block text-right no-underline">
                <span className="bx3-mono block text-[12px]">
                  {lang === "cs" ? "Další projekt" : "Next project"}
                </span>
                <span
                  className="mt-1 block font-black uppercase"
                  style={{ fontSize: "clamp(22px, 4vw, 56px)", letterSpacing: "-0.02em" }}
                >
                  <span className="bx3-hls">{nd.title}</span> →
                </span>
              </TapeLink>
            )}
          </div>
        </div>
      </main>

      <Contact t={t} settings={settings} words={t.tape} />

      <Lightbox
        images={gallery}
        index={shot}
        onClose={() => setShot(null)}
        onIndex={setShot}
        label={d.title}
      />
    </div>
  );
}
