"use client";

import { useState } from "react";
import Image from "next/image";
import { cases, categories } from "../../lib/bx";
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
    <Section id="work" className="pt-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>{t.selectedWork}</Label>
            <h2 className="mt-6 display-xl text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.02em]">
              {lang === "cs" ? "Vybrané" : "Selected"}
              <br />
              <span className="text-ink/30">{lang === "cs" ? "projekty" : "work"}</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
                  active === key
                    ? "border-ink bg-ink text-white"
                    : "border-ink/15 text-ink/55 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {shown.map((c, i) => {
          const data = c[lang];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.06}>
              <TapeLink href={`/safy-bx/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-ink/5">
                  <Image
                    src={`/images/bx/${c.slug}/01.webp`}
                    alt={data.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 46vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-[12px] text-ink">
                    {cats[c.category]}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.3rem,2.1vw,1.75rem)] font-medium leading-tight group-hover:text-brand transition-colors">
                      {data.title}
                    </h3>
                    <p className="mt-1.5 text-ink/45 text-[15px]">{data.subtitle}</p>
                  </div>
                  <ArrowPill label={data.title} />
                </div>
              </TapeLink>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
