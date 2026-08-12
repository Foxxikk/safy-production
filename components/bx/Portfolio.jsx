"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cases, categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";

export default function Portfolio() {
  const { lang, t } = useLang();
  const [active, setActive] = useState("all");

  const cats = categories[lang];
  const used = [...new Set(cases.map((c) => c.category))];
  const shown = active === "all" ? cases : cases.filter((c) => c.category === active);

  return (
    <section id="work" className="mx-auto max-w-[1500px] px-6 md:px-10 pb-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="display-xl text-4xl md:text-6xl">{t.selectedWork}</h2>
          <span className="text-ink/40 text-sm">
            {shown.length} {t.projects}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-7 gap-y-3 mb-12 border-t border-black/10 pt-6">
          {[["all", t.all], ...used.map((k) => [k, cats[k]])].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-[15px] font-medium transition-colors ${
                active === key ? "text-brand" : "text-ink/50 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {shown.map((c, i) => {
          const data = c[lang];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.08}>
              <Link href={`/safy-bx/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                  <Image
                    src={`/images/bx/${c.slug}/01.webp`}
                    alt={data.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-ink text-[11px] font-medium uppercase tracking-wider px-3 py-1.5">
                    {cats[c.category]}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-brand transition-colors">
                      {data.title}
                    </h3>
                    <p className="text-ink/50 mt-1">{data.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-2xl text-ink/30 group-hover:text-brand group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
