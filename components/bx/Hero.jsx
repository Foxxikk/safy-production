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
      {/* HERO — celoplošná fotka, obří typografie */}
      <section className="px-3 pt-3 md:px-4 md:pt-4">
        <div className="relative h-[84vh] min-h-[540px] w-full overflow-hidden rounded-[20px] md:rounded-[28px] bg-ink">
          <Image
            src="/images/bx/jagermeister-orange-grape-2025/01.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

          <div className="absolute inset-x-0 top-0 p-6 md:p-10 flex justify-between">
            <Label tone="light">Brand experience marketing</Label>
            <Label tone="light" className="hidden sm:block">
              CZ &amp; SK · od 2010
            </Label>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h1 className="display-xl text-white text-[clamp(3.6rem,13vw,11rem)] leading-[0.82] tracking-[-0.02em]">
                  ŠAFY <span className="text-brand">BX</span>
                </h1>
                <p className="max-w-[30ch] text-white/75 text-[15px] leading-relaxed pb-3">
                  {lang === "cs"
                    ? "Kreativní strategie, interaktivní instalace a vlastní fyzická výroba — zážitky pro značky v reálném prostoru."
                    : "Creative strategy, interactive installations and our own fabrication — brand experiences in real space."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ČERNÝ PÁS S LOGY */}
      <section className="mt-3 md:mt-4 px-3 md:px-4">
        <div className="overflow-hidden rounded-[20px] md:rounded-[24px] bg-dark py-7">
          <div className="flex w-max animate-marquee items-center">
            {logos.map((b, i) => (
              <div key={`${b}-${i}`} className="mx-9 shrink-0 opacity-70 brightness-0 invert">
                <Image src={`/images/brands/${b}.png`} alt={b} width={104} height={52} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATEMENT — obří text */}
      <Section className="pt-20 md:pt-28 pb-10">
        <Reveal>
          <Label>{lang === "cs" ? "Kdo jsme" : "Who we are"}</Label>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-7 text-[clamp(1.7rem,4.2vw,3.4rem)] leading-[1.14] tracking-[-0.01em] max-w-[22ch] font-medium">
            {lang === "cs" ? (
              <>
                Fyzická přítomnost značky je stejně důležitá jako{" "}
                <span className="text-ink/35">její prezentace online.</span>
              </>
            ) : (
              <>
                A brand&apos;s physical presence matters as much as{" "}
                <span className="text-ink/35">its presence online.</span>
              </>
            )}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.1}>
              <p className="text-ink/60 leading-[1.75] text-[16px]">{bxIntro[lang]}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* PILÍŘE — číslované řádky */}
      <Section className="pt-8">
        <Reveal>
          <Label>{lang === "cs" ? "Co děláme" : "What we do"}</Label>
        </Reveal>

        <div className="mt-10">
          {pillars[lang].map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="grid items-start gap-4 border-t border-black/10 py-8 md:grid-cols-12 md:gap-8">
                <span className="text-[13px] text-ink/30 md:col-span-1">
                  0{i + 1}
                </span>
                <h3 className="text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-[1.15] md:col-span-6">
                  {p.title}
                </h3>
                <p className="text-ink/55 leading-[1.7] text-[15.5px] md:col-span-5">{p.text}</p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-black/10" />
        </div>
      </Section>

      {/* ČÍSLA */}
      <Section className="pt-6">
        <Reveal>
          <Label>{t.statsTitle}</Label>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {stats[lang].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="display-xl text-[clamp(2.2rem,4.4vw,3.8rem)] leading-none whitespace-nowrap tracking-[-0.02em]">
                {s.value}
              </div>
              <p className="mt-3 text-ink/45 text-[14px] leading-snug">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
