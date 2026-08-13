"use client";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Label } from "./Section";

/**
 * Stránka začíná rovnou tím, co děláme.
 * Logo je v hlavičce, popisný text divize se přesunul do patičky.
 */
export default function Hero({ pillars = {} }) {
  const { lang } = useLang();

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

      <div className="mt-8 md:mt-12">
        {(pillars[lang] || []).map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="grid items-start gap-2 md:gap-8 border-t border-black/10 dark:border-white/15 py-6 md:py-8 md:grid-cols-12">
              <span className="text-[12px] md:text-[13px] text-ink/30 dark:text-white/30 md:col-span-1">
                0{i + 1}
              </span>
              <h2 className="text-[clamp(1.2rem,2.6vw,2rem)] font-medium leading-[1.15] md:col-span-6 dark:text-white">
                {p.title}
              </h2>
              <p className="text-ink/55 dark:text-white/50 leading-[1.65] text-[14.5px] md:text-[15.5px] md:col-span-5">
                {p.text}
              </p>
            </div>
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
