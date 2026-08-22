"use client";

import Image from "next/image";
import Link from "next/link";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container } from "./Section";
import { clientLogos } from "@/lib/bx";
import { TapeLink } from "./TapeTransition";

/** Stránka „O nás“ — kdo jsme, jak pracujeme a co si na tom zakládáme. */
export default function AboutPage({ about = {}, stats = {}, settings = {} }) {
  const { lang, t } = useLang();
  const a = about[lang] || about.cs || {};
  const numbers = stats[lang] || [];

  return (
    <>
      <Container className="pt-4 md:pt-6 pb-2">
        <TapeLink
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-[13.5px] text-ink/45 dark:text-white/45 hover:text-ink dark:hover:text-white transition-colors"
        >
          ← {lang === "cs" ? "Zpět na úvod" : "Back to home"}
        </TapeLink>
      </Container>

      {/* Úvod */}
      <Section className="pt-6 md:pt-10 pb-0">
        <Reveal>
          <h1 className="display-xl text-[clamp(2rem,5.5vw,4.2rem)] leading-[0.98] tracking-[-0.02em] dark:text-white">
            {a.title}
          </h1>
        </Reveal>
        {a.lead && (
          <Reveal delay={0.06}>
            <p className="mt-5 md:mt-7 text-[clamp(1.15rem,2.4vw,1.8rem)] leading-[1.32] tracking-[-0.01em] font-medium max-w-[34ch] dark:text-white">
              {a.lead}
            </p>
          </Reveal>
        )}
      </Section>

      {/* Text */}
      <Section className="pt-10 md:pt-14 pb-0">
        <Reveal>
          <div className="grid gap-x-12 gap-y-5 md:grid-cols-2 text-ink/60 dark:text-white/55 leading-[1.75] text-[15.5px] md:text-[16.5px]">
            {(a.body || []).map((p, i) => (
              <p key={i} className={i === 0 ? "md:col-span-2 md:max-w-[60ch]" : ""}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Hodnoty */}
      {(a.values || []).length > 0 && (
        <Section className="pt-16 md:pt-24 pb-0">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.4rem,2.8vw,2.1rem)] leading-[1.05] tracking-[-0.02em] dark:text-white">
              {a.valuesTitle}
            </h2>
          </Reveal>
          <div className="mt-7 md:mt-9 grid gap-x-5 gap-y-8 grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="border-t border-black/10 dark:border-white/15 pt-4">
                  <span className="text-[11px] text-ink/30 dark:text-white/30 tabular-nums">
                    0{i + 1}
                  </span>
                  <h3 className="mt-1.5 text-[16px] md:text-[18px] font-medium dark:text-white">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-ink/50 dark:text-white/45 leading-[1.55] text-[13.5px] md:text-[14px]">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Čísla */}
      {numbers.length > 0 && (
        <Section className="pt-16 md:pt-24 pb-0">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.4rem,2.8vw,2.1rem)] leading-[1.05] tracking-[-0.02em] dark:text-white">
              {t.statsTitle}
            </h2>
          </Reveal>
          <div className="mt-7 md:mt-9 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
            {numbers.map((s, i) => (
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
      )}

      {/* Značky, pro které stavíme */}
      <Section className="pt-16 md:pt-24 pb-0">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.4rem,2.8vw,2.1rem)] leading-[1.05] tracking-[-0.02em] dark:text-white">
            {t.clientsTitle}
          </h2>
        </Reveal>

        {/* Bez rámečků — poslední řádek není plný a mřížka s linkami by působila useknutě.
            Loga jsou v souborech světle šedá (kolem 46 % jasu), takže by se sama o sobě
            ztrácela. Ztmavíme je filtrem; v tmavém režimu je po ztmavení ještě obrátíme. */}
        <div className="mt-8 md:mt-12 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14 items-center">
          {clientLogos.map((b, i) => (
            <Reveal key={b} delay={(i % 6) * 0.04}>
              <div className="flex items-center justify-center">
                <Image
                  src={`/images/brands/${b}.png`}
                  alt={b.replace(/[-_]/g, " ")}
                  width={110}
                  height={55}
                  className="max-h-9 md:max-h-11 w-auto object-contain [filter:brightness(0.28)] dark:[filter:brightness(0.3)_invert(1)] opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Odkaz na hlavní web */}
      <Section className="pt-12 md:pt-16 pb-0">
        <Reveal>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border-t border-black/10 dark:border-white/15 pt-6 w-full text-[clamp(1rem,2.2vw,1.4rem)] font-medium dark:text-white"
          >
            {lang === "cs"
              ? `Kompletní portfolio na webu ${settings.company || "Šafy production"}`
              : `Full portfolio on the ${settings.company || "Šafy production"} website`}
            <span
              aria-hidden
              className="text-ink/30 dark:text-white/30 group-hover:translate-x-1 transition-transform duration-300"
            >
              →
            </span>
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
