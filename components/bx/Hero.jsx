"use client";

import { useState } from "react";
import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Label } from "./Section";
import { TapeLink } from "./TapeTransition";

/**
 * Stránka začíná tím, co děláme. Každý pilíř je proklik na vlastní stránku
 * a při najetí ukáže náhled fotky z projektů dané oblasti.
 */
export default function Hero({ pillars = {}, previews = {} }) {
  const { lang } = useLang();
  const [hover, setHover] = useState(null);

  const list = (pillars[lang] || []).filter((p) => p.published !== false);

  return (
    <Section className="pt-10 md:pt-16 pb-4 md:pb-8">
      <Reveal>
        <p className="text-[12px] md:text-[13px] uppercase tracking-[0.24em] text-ink/45 dark:text-white/45">
          Brand experience marketing
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="mt-4 md:mt-6 display-xl text-[clamp(2rem,5.5vw,4.2rem)] leading-[0.98] tracking-[-0.02em] dark:text-white">
          {lang === "cs" ? "Co děláme" : "What we do"}
        </h1>
      </Reveal>

      {/* Náhled fotky se drží v pravém sloupci a mění se podle najetí */}
      <div className="relative mt-8 md:mt-12">
        <div className="pointer-events-none absolute right-0 top-0 hidden lg:block w-[27%] max-w-[380px] aspect-[4/3] overflow-hidden">
          {list.map((p, i) => {
            const src = p.image || previews[p.category];
            if (!src) return null;
            return (
              <span
                key={p.slug || i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  hover === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image src={src} alt="" fill sizes="380px" className="object-cover" />
              </span>
            );
          })}
        </div>

        {list.map((p, i) => (
          <Reveal key={p.slug || i} delay={i * 0.05}>
            <TapeLink
              href={p.slug ? `/safy-bx/co-delame/${p.slug}` : "/safy-bx"}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group grid items-start gap-2 md:gap-8 border-t border-black/10 dark:border-white/15 py-6 md:py-8 md:grid-cols-12 transition-colors"
            >
              <span className="text-[12px] md:text-[13px] text-ink/30 dark:text-white/30 md:col-span-1 tabular-nums">
                0{i + 1}
              </span>

              <h2 className="flex items-center gap-3 text-[clamp(1.2rem,2.6vw,2rem)] font-medium leading-[1.15] md:col-span-6 dark:text-white">
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {p.title}
                </span>
                <span
                  aria-hidden
                  className="text-ink/25 dark:text-white/25 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                >
                  →
                </span>
              </h2>

              <p className="text-ink/55 dark:text-white/50 leading-[1.65] text-[14.5px] md:text-[15.5px] md:col-span-5 lg:col-span-4">
                {p.text}
              </p>
            </TapeLink>
          </Reveal>
        ))}
        <div className="border-t border-black/10 dark:border-white/15" />
      </div>
    </Section>
  );
}

/** Čísla za námi — pod referencemi. */
export function About({ stats = {} }) {
  const { lang, t } = useLang();

  return (
    <Section className="pt-2 md:pt-6">
      <Reveal>
        <Label>{t.statsTitle}</Label>
      </Reveal>
      <div className="mt-7 md:mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
        {(stats[lang] || []).map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="display-xl text-[clamp(1.9rem,4.4vw,3.6rem)] leading-none whitespace-nowrap tracking-[-0.02em] dark:text-white">
              {s.value}
            </div>
            <p className="mt-2 md:mt-3 text-ink/45 dark:text-white/40 text-[13px] md:text-[14px] leading-snug">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
