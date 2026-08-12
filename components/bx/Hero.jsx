"use client";

import Image from "next/image";
import { bxIntro, pillars, stats } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container } from "./Section";

export default function Hero() {
  const { lang, t } = useLang();

  return (
    <>
      {/* Hero — celoplošná fotka s titulem */}
      <section className="relative h-[72vh] min-h-[480px] max-h-[760px] w-full overflow-hidden bg-ink">
        <Image
          src="/images/bx/jagermeister-orange-grape-2025/01.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="absolute inset-x-0 bottom-0">
          <Container className="pb-12 md:pb-16">
            <Reveal>
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/60 mb-4">
                {t.heroLead}
              </p>
              <h1 className="display-xl text-white text-[clamp(3.2rem,9vw,8rem)] leading-[0.9]">
                ŠAFY <span className="text-brand">BX</span>
              </h1>
              <p className="mt-4 text-white/80 text-lg md:text-xl font-light">{t.tagline}</p>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* Úvod */}
      <Section label="01 — ŠAFY BX" divider={false} className="pt-16 md:pt-24 pb-4 md:pb-6">
        <Reveal>
          <p className="text-[clamp(1.25rem,2.1vw,1.7rem)] leading-[1.55] text-ink/85 max-w-[62ch]">
            {bxIntro[lang]}
          </p>
        </Reveal>
      </Section>

      {/* Pilíře */}
      <Section
        label="02 — Co děláme"
        title={lang === "cs" ? "Čtyři pilíře" : "Four pillars"}
        className="pt-10 md:pt-14"
      >
        <div className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {pillars[lang].map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <div className="border-t border-black/[0.09] pt-6 h-full">
                <span className="block text-[13px] font-mono text-brand mb-3">0{i + 1}</span>
                <h3 className="text-[22px] font-bold mb-3 leading-snug">{p.title}</h3>
                <p className="text-ink/65 leading-[1.7] text-[16px] max-w-[46ch]">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Čísla — na bílé, bez cizího černého pásu */}
      <Section label="03 — Čísla" title={t.statsTitle}>
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
          {stats[lang].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="border-t border-black/[0.09] pt-6">
                <div className="display-xl text-[clamp(2.2rem,4vw,3.4rem)] leading-none">
                  {s.value}
                </div>
                <p className="mt-3 text-ink/50 text-[15px] leading-snug">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
