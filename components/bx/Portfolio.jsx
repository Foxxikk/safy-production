"use client";

import { useState } from "react";
import Image from "next/image";
import { cases, categories } from "@/lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Label, ArrowPill } from "./Section";
import { TapeLink } from "./TapeTransition";

export default function Portfolio() {
  const { lang, t } = useLang();
  const [active, setActive] = useState("all");

  const cats = categories[lang];
  const used = [...new Set(cases.map((c) => c.category))];
  const shown = active === "all" ? cases : cases.filter((c) => c.category === active);

  return (
    <Section id="work" className="pt-6 md:pt-10">
      <Reveal>
        <Label>{t.selectedWork}</Label>
        <h2 className="mt-4 md:mt-6 display-xl text-[clamp(2.2rem,7vw,5rem)] leading-[0.92] tracking-[-0.02em] dark:text-white">
          {lang === "cs" ? "Vybrané" : "Selected"}{" "}
          <span className="text-ink/30 dark:text-white/30">
            {lang === "cs" ? "projekty" : "work"}
          </span>
        </h2>

        {/* Filtry — vodorovný scroll na mobilu, ostré hrany */}
        <div className="mt-6 md:mt-8 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
            {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`shrink-0 border px-3.5 py-2 text-[13px] md:text-[13.5px] transition-colors ${
                  active === key
                    ? "border-ink dark:border-brand bg-ink dark:bg-brand text-white dark:text-ink"
                    : "border-ink/15 dark:border-white/20 text-ink/55 dark:text-white/50 hover:border-ink/40 dark:hover:border-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 md:mt-12 grid gap-x-5 gap-y-9 md:gap-y-12 sm:grid-cols-2">
        {shown.map((c, i) => {
          const data = c[lang];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.06}>
              <TapeLink href={`/safy-bx/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">
                  {/* Bez přeškálování — scale u velkých fotek působilo cukání */}
                  <Image
                    src={`/images/bx/${c.slug}/01.webp`}
                    alt={data.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 46vw"
                    className="object-cover"
                  />
                  {/* Jemné ztmavení místo plovoucího tlačítka u kurzoru */}
                  <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                  <span className="absolute left-0 top-0 bg-white dark:bg-ink text-ink dark:text-white px-3 py-1.5 text-[11px] md:text-[12px]">
                    {cats[c.category]}
                  </span>
                </div>

                <div className="mt-3.5 md:mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.15rem,2.1vw,1.7rem)] font-medium leading-tight group-hover:text-brand transition-colors dark:text-white">
                      {data.title}
                    </h3>
                    <p className="mt-1 text-ink/45 dark:text-white/40 text-[13.5px] md:text-[15px]">
                      {data.subtitle}
                    </p>
                  </div>
                  <ArrowPill label={data.title} className="hidden sm:inline-flex" />
                </div>
              </TapeLink>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
