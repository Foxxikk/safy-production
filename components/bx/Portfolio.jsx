"use client";

import { useState } from "react";
import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";

export default function Portfolio({ cases = [], categories = {} }) {
  const { lang, t } = useLang();
  const [active, setActive] = useState("all");

  const cats = categories[lang];
  const used = [...new Set(cases.map((c) => c.category))];
  const shown = active === "all" ? cases : cases.filter((c) => c.category === active);

  return (
    <Section id="work" className="pt-2 md:pt-4">
      <Reveal>
        <h2 className="display-xl text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.02em] dark:text-white">
          {lang === "cs" ? "Vybrané" : "Selected"}{" "}
          <span className="text-ink/30 dark:text-white/30">
            {lang === "cs" ? "projekty" : "work"}
          </span>
        </h2>

        {/* Filtry — vodorovný scroll na mobilu, ostré hrany */}
        <div className="mt-5 md:mt-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
            {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`shrink-0 border px-3.5 py-2 text-[13px] md:text-[13.5px] transition-colors ${
                  active === key
                    ? "border-ink dark:border-white bg-ink dark:bg-white text-white dark:text-ink"
                    : "border-ink/15 dark:border-white/20 text-ink/55 dark:text-white/50 hover:border-ink/40 dark:hover:border-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 md:mt-8 grid gap-x-4 gap-y-7 md:gap-x-5 md:gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c, i) => {
          const data = c[lang];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.06}>
              <TapeLink href={`/safy-bx/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">
                  {/* Bez přeškálování — scale u velkých fotek působilo cukání */}
                  <Image
                    src={c.images?.[0] || "/images/bx/red-bull-energy-zone/01.webp"}
                    alt={data.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 46vw, 31vw"
                    className="object-cover"
                  />
                  {/* Jemné ztmavení — žádné štítky ani tlačítka přes fotku */}
                  <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                </div>

                <div className="mt-3 md:mt-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-ink/35 dark:text-white/35">
                    {cats[c.category]}
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
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
