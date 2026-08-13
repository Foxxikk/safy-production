"use client";

import Image from "next/image";
import { bxIntro, pillars, stats } from "@/lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container, Label } from "./Section";

export default function Hero() {
  const { lang, t } = useLang();

  return (
    <>
      {/* ÚVOD — čistá bílá plocha, černé logo Šafy. Žádná fotka, žádná lišta. */}
      <section className="pt-14 md:pt-24 pb-10 md:pb-16">
        <Container>
          <Reveal>
            <div className="flex items-end gap-4 md:gap-6">
              <Image
                src="/images/logos/safy-logo.svg"
                alt="šafy"
                width={340}
                height={132}
                priority
                className="w-[150px] md:w-[260px] h-auto dark:invert"
              />
              <span className="display-xl text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.8] tracking-[-0.03em] text-brand pb-1 md:pb-2">
                BX
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-6 md:mt-8 text-[12px] md:text-[13px] uppercase tracking-[0.24em] text-ink/45 dark:text-white/45">
              Brand experience marketing
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="mt-10 md:mt-16 text-[clamp(1.7rem,5vw,4rem)] leading-[1.08] tracking-[-0.02em] font-medium max-w-[20ch] dark:text-white">
              {lang === "cs" ? (
                <>
                  Značka, kterou si lidé osahají,{" "}
                  <span className="text-ink/30 dark:text-white/30">se pamatuje jinak.</span>
                </>
              ) : (
                <>
                  A brand people can touch{" "}
                  <span className="text-ink/30 dark:text-white/30">is remembered differently.</span>
                </>
              )}
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* KDO JSME */}
      <Section className="pt-2 md:pt-6 pb-6 md:pb-10">
        <div className="grid gap-6 md:gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <Label>{lang === "cs" ? "Kdo jsme" : "Who we are"}</Label>
            </Reveal>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal delay={0.06}>
              <p className="text-ink/65 dark:text-white/55 leading-[1.75] text-[15.5px] md:text-[17px] max-w-[62ch]">
                {bxIntro[lang]}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* PILÍŘE */}
      <Section className="pt-6 md:pt-10">
        <Reveal>
          <Label>{lang === "cs" ? "Co děláme" : "What we do"}</Label>
        </Reveal>

        <div className="mt-7 md:mt-10">
          {pillars[lang].map((p, i) => (
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
      </Section>

      {/* ČÍSLA */}
      <Section className="pt-2 md:pt-6">
        <Reveal>
          <Label>{t.statsTitle}</Label>
        </Reveal>
        <div className="mt-7 md:mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
          {stats[lang].map((s, i) => (
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
    </>
  );
}
