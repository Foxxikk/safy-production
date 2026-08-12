"use client";

import Image from "next/image";
import { bxIntro, pillars, stats, clientLogos } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container, Label } from "./Section";

export default function Hero() {
  const { lang, t } = useLang();
  const logos = [...clientLogos, ...clientLogos];

  return (
    <>
      {/* HERO — celoplošná fotka, obří typografie, ostré rohy */}
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="relative h-[62vh] min-h-[380px] max-h-[720px] md:h-[78vh] w-full overflow-hidden bg-ink">
          <Image
            src="/images/bx/iqos-pop-up-store/01.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

          <div className="absolute inset-x-0 top-0 p-4 md:p-8 flex justify-between">
            <Label tone="light">Brand experience marketing</Label>
            <Label tone="light" className="hidden sm:block">
              CZ &amp; SK · od 2010
            </Label>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
                <h1 className="display-xl text-white text-[clamp(3rem,13vw,10rem)] leading-[0.84] tracking-[-0.02em]">
                  ŠAFY <span className="text-brand">BX</span>
                </h1>
                <p className="max-w-[30ch] text-white/75 text-[13.5px] md:text-[15px] leading-relaxed md:pb-3">
                  {lang === "cs"
                    ? "Kreativní strategie, interaktivní instalace a vlastní fyzická výroba — zážitky pro značky v reálném prostoru."
                    : "Creative strategy, interactive installations and our own fabrication — brand experiences in real space."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LOGA KLIENTŮ — na podkladu stránky, bez pásu; barva dle režimu */}
      <section className="py-9 md:py-12 overflow-x-clip">
        <div className="flex w-max animate-marquee items-center">
          {logos.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="mx-6 md:mx-9 shrink-0 grayscale opacity-45 dark:invert dark:opacity-55"
            >
              <Image src={`/images/brands/${b}.png`} alt={b} width={88} height={44} />
            </div>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <Section className="pt-14 md:pt-24 pb-6 md:pb-10">
        <Reveal>
          <Label>{lang === "cs" ? "Kdo jsme" : "Who we are"}</Label>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-5 md:mt-7 text-[clamp(1.45rem,4.2vw,3.2rem)] leading-[1.15] tracking-[-0.01em] max-w-[22ch] font-medium dark:text-white">
            {lang === "cs" ? (
              <>
                Fyzická přítomnost značky je stejně důležitá jako{" "}
                <span className="text-ink/35 dark:text-white/35">její prezentace online.</span>
              </>
            ) : (
              <>
                A brand&apos;s physical presence matters as much as{" "}
                <span className="text-ink/35 dark:text-white/35">its presence online.</span>
              </>
            )}
          </p>
        </Reveal>

        <div className="mt-8 md:mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.1}>
              <p className="text-ink/60 dark:text-white/55 leading-[1.7] text-[15px] md:text-[16px]">
                {bxIntro[lang]}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* PILÍŘE */}
      <Section className="pt-4 md:pt-8">
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
