"use client";

import Image from "next/image";

import { thumb } from "@/lib/bxThumb";
import { cellFor } from "@/lib/bxV3";
import { TapeLink } from "../TapeTransition";
import useTilt from "./useTilt";

/**
 * Reference jako nepravidelná mřížka dlaždic.
 * Každá nese velké číslo z faktů projektu, štítek kategorie a šipku,
 * která se na najetí rozjede doprava a zezelená.
 */
export default function RefGrid({ t, cases = [], categories = {}, lang = "cs" }) {
  if (!cases.length) return null;

  return (
    <section id="reference" className="bg-ink px-5 py-[90px] text-white md:px-12 md:py-[150px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <h2
            className="m-0 font-black uppercase"
            style={{ fontSize: "clamp(44px, 10vw, 168px)", lineHeight: 0.88, letterSpacing: "-0.04em" }}
          >
            <span className="bx3-hl">{t.refsTitle}</span>
          </h2>
          <p className="m-0 text-[17px] font-light md:text-[18px]" style={{ color: "#F0F0EF" }}>
            {t.refsNote[0]}{" "}
            <b className="font-bold">
              {t.refsNote[1]} {cases.length}.
            </b>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-7">
          {cases.map((c, i) => (
            <RefCard
              key={c.slug}
              c={c}
              i={i}
              lang={lang}
              category={categories[c.category] || ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RefCard({ c, i, lang, category }) {
  const tilt = useTilt(7);
  const data = c[lang] || c.cs || {};
  const { span, h } = cellFor(i);
  const stat = c.facts?.[lang]?.[0]?.value || c.facts?.cs?.[0]?.value || "";
  const n = String(i + 1).padStart(2, "0");

  // Čím širší dlaždice, tím větší číslo — aby drželo poměr k ploše
  const statSize =
    span === 12 ? "clamp(52px, 11vw, 176px)" : span >= 7 ? "clamp(44px, 8vw, 136px)" : "clamp(38px, 5.6vw, 92px)";

  return (
    <TapeLink
      href={`/safy-bx/${c.slug}`}
      className="bx3-ref"
      aria-label={`${data.title} — ${data.subtitle || ""}`}
      style={{ gridColumn: `span ${span}`, height: h, background: "#1F1F1E" }}
      {...tilt}
    >
      <span className="bx3-cv absolute inset-0 block">
        {c.images?.[0] && (
          <Image
            src={thumb(c.images[0])}
            alt=""
            fill
            sizes={span >= 7 ? "60vw" : "33vw"}
            className="object-cover"
          />
        )}
      </span>

      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(20,20,19,0.82) 0%, rgba(20,20,19,0.1) 55%, rgba(20,20,19,0.25) 100%)",
        }}
      />

      <span className="absolute inset-0 flex flex-col justify-between p-5 md:p-[26px]">
        <span className="flex items-start justify-between gap-3">
          <span className="bx3-mono bg-brand px-[11px] py-[7px] text-[11px] text-ink md:text-[12px]">
            {n} — {category}
          </span>
        </span>

        <span className="block">
          {stat && (
            <span
              className="block font-black uppercase text-white"
              style={{ fontSize: statSize, lineHeight: 0.88, letterSpacing: "-0.035em" }}
            >
              {stat}
            </span>
          )}
          <span className="mt-4 flex items-end justify-between gap-4">
            {/* Názvy našich projektů jsou delší než v návrhu — necháme je
                zalomit na dva řádky, ať se neuseknou v půlce slova. */}
            <span className="block min-w-0">
              <span className="block text-[18px] font-black uppercase leading-[1.1] md:text-[22px]">
                {data.title}
              </span>
              <span className="mt-0.5 block truncate text-[14px] font-light md:text-[16px]">
                {data.subtitle}
              </span>
            </span>
            <span
              className="bx3-go flex h-11 w-11 flex-none items-center justify-center bg-white text-ink md:h-[52px] md:w-[52px]"
              style={{ boxShadow: "3px 3px 0 #1F1F1E" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </span>
        </span>
      </span>

      <span className="bx3-glare" aria-hidden />
    </TapeLink>
  );
}
