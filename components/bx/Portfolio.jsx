"use client";

import { useState } from "react";
import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section from "./Section";
import Doodle from "./Doodle";
import Carousel from "./Carousel";
import { TapeLink } from "./TapeTransition";

export default function Portfolio({ cases = [], categories = {} }) {
  const { lang, t } = useLang();
  const [active, setActive] = useState("all");

  const cats = categories[lang];
  const used = [...new Set(cases.map((c) => c.category))];
  const shown = active === "all" ? cases : cases.filter((c) => c.category === active);

  return (
    <Section id="work" className="pt-16 md:pt-24 pb-0">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-y-4 gap-x-8">
          <h2 className="display-xl text-[clamp(1.4rem,2.8vw,2.1rem)] leading-[1.05] tracking-[-0.02em] dark:text-white">{lang === "cs" ? "Reference" : "Work"}</h2>

          {/* Filtry — jen text, bez rámečků; na mobilu se dají posouvat do strany */}
          <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-5 md:gap-6 w-max md:w-auto md:flex-wrap">
              {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`shrink-0 pb-1 text-[13px] md:text-[13.5px] border-b transition-colors ${
                    active === key
                      ? "border-ink dark:border-white text-ink dark:text-white"
                      : "border-transparent text-ink/40 dark:text-white/40 hover:text-ink dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Mobil — carousel, který se sám posouvá; jakmile do něj sáhne návštěvník, počká. */}
      <div className="sm:hidden mt-7">
        <Carousel count={shown.length}>
          {shown.map((c) => (
            <div key={c.slug} className="w-[82%] shrink-0 snap-center">
              <ProjectCard item={c} lang={lang} cats={cats} sizes="82vw" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Tablet a výš — klasická mřížka */}
      <div className="hidden sm:grid mt-9 gap-x-4 gap-y-9 md:gap-x-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 2) * 0.06}>
            <ProjectCard item={c} lang={lang} cats={cats} sizes="(max-width: 1280px) 46vw, 31vw" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Jedna reference — stejná dlaždice v mřížce i v carouselu. */
function ProjectCard({ item, lang, cats, sizes }) {
  const data = item[lang];
  return (
    <TapeLink href={`/safy-bx/${item.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">
        {/* Bez přeškálování — scale u velkých fotek působilo cukání */}
        <Image
          src={item.images?.[0] || "/images/bx/red-bull-energy-zone/01.webp"}
          alt={data.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
        <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
      </div>

      <div className="mt-3 md:mt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-ink/35 dark:text-white/35">
          {cats[item.category]}
        </p>
        <h3 className="mt-1.5 flex items-center gap-2.5 text-[16px] md:text-[18px] font-medium leading-snug group-hover:text-ink/55 dark:group-hover:text-white/60 transition-colors dark:text-white">
          {data.title}
          <Doodle
            name="sipka"
            className="w-[24px] h-[9px] shrink-0 text-ink/30 dark:text-white/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          />
        </h3>
        <p className="mt-0.5 text-ink/45 dark:text-white/40 text-[13.5px] md:text-[14px]">
          {data.subtitle}
        </p>
      </div>
    </TapeLink>
  );
}
