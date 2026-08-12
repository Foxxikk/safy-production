"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cases, categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Portfolio() {
  const { lang, t } = useLang();
  const [active, setActive] = useState("all");

  const cats = categories[lang];
  const used = [...new Set(cases.map((c) => c.category))];
  const shown = active === "all" ? cases : cases.filter((c) => c.category === active);

  const filters = (
    <div className="flex flex-col gap-2.5">
      {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
        <button
          key={key}
          onClick={() => setActive(key)}
          className={`text-left text-[15px] transition-colors ${
            active === key ? "text-brand font-medium" : "text-ink/45 hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
      <p className="mt-3 text-[13px] text-ink/30">
        {shown.length} {t.projects}
      </p>
    </div>
  );

  return (
    <Section id="work" label="04 — Reference" title={t.selectedWork} aside={filters}>
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {shown.map((c, i) => {
          const data = c[lang];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.07}>
              <Link href={`/safy-bx/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                  <Image
                    src={`/images/bx/${c.slug}/01.webp`}
                    alt={data.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-ink/35">
                  {cats[c.category]}
                </p>
                <h3 className="mt-1.5 text-[22px] md:text-[26px] font-bold leading-tight">
                  <span className="group-hover:text-brand transition-colors">{data.title}</span>
                  <span className="inline-block ml-2 text-ink/25 group-hover:text-brand group-hover:translate-x-1 transition-all align-middle text-[20px]">
                    →
                  </span>
                </h3>
                <p className="mt-1 text-ink/50 text-[15px]">{data.subtitle}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
