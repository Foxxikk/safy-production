"use client";

import Image from "next/image";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container, Label } from "./Section";

/**
 * ÚVOD — jen velké černé logo Šafy BX, popisek a úvodní text.
 * Zelená se používá minimálně (pásky, drobné akcenty), ne v hlavní typografii.
 */
export default function Hero({ intro, pillars = {} }) {
  const { lang } = useLang();
  const bxIntro = intro || {};

  return (
    <section className="pt-12 md:pt-20 pb-8 md:pb-14">
      <Container>
        <Reveal>
          <div className="flex items-end gap-4 md:gap-6">
            <Image
              src="/images/logos/safy-logo.svg"
              alt="šafy"
              width={340}
              height={132}
              priority
              className="w-[170px] md:w-[300px] h-auto dark:invert"
            />
            <span className="display-xl text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.8] tracking-[-0.03em] text-ink dark:text-white pb-1 md:pb-2">
              BX
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-5 md:mt-7 text-[12px] md:text-[13px] uppercase tracking-[0.24em] text-ink/45 dark:text-white/45">
            Brand experience marketing
          </p>
        </Reveal>

        {/* Úvodní text bez nadpisu — sám o sobě říká, kdo jsme */}
        <Reveal delay={0.12}>
          <p className="mt-8 md:mt-12 text-[clamp(1.05rem,1.9vw,1.5rem)] leading-[1.6] text-ink/75 dark:text-white/65 max-w-[68ch]">
            {bxIntro[lang] || ""}
          </p>
        </Reveal>

        {/* Co děláme — hned pod úvodem */}
        <div className="mt-12 md:mt-20">
          <Reveal>
            <Label>{lang === "cs" ? "Co děláme" : "What we do"}</Label>
          </Reveal>

          <div className="mt-6 md:mt-9">
            {(pillars[lang] || []).map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="grid items-start gap-2 md:gap-8 border-t border-black/10 dark:border-white/15 py-6 md:py-8 md:grid-cols-12">
                  <span className="text-[12px] md:text-[13px] text-ink/30 dark:text-white/30 md:col-span-1">
                    0{i + 1}
                  </span>
                  <h3 className="text-[clamp(1.2rem,2.6vw,2rem)] font-medium leading-[1.15] md:col-span-6 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-ink/55 dark:text-white/50 leading-[1.65] text-[14.5px] md:text-[15.5px] md:col-span-5">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-black/10 dark:border-white/15" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Čísla za námi — zůstávají pod referencemi. */
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
