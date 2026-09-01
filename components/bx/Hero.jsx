"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";

/**
 * Úvod stránky: mohutný claim, pod ním představení divize a čtyři pilíře.
 * Typografie nese hlavní váhu, grafika ji jen doplňuje.
 */
export default function Hero({ claim = {}, intro = {}, pillars = {}, previews = {} }) {
  const { lang } = useLang();
  const list = (pillars[lang] || []).filter((p) => p.published !== false);
  const c = claim[lang] || claim.cs || {};

  return (
    <Section className="pt-6 md:pt-10 pb-0">
      {/* Claim — hlavní vizuální prvek stránky */}
      {(c.line1 || c.line2) && (
        <div className="relative">
          <Reveal>
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.24em] text-ink/40 dark:text-white/40">
              Brand experience marketing
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 md:mt-7 display-xl text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.035em] uppercase dark:text-white">
              <span className="block">{c.line1}</span>
              <span className="relative inline-block">
                {c.line2}
                {/* Páska podtrhává druhý řádek a přesahuje mimo mřížku */}
                <Doodle
                  name="podtrzeni-1"
                  className="absolute -bottom-[0.12em] left-0 w-[104%] h-[0.1em] text-brand"
                />
              </span>
            </h1>
          </Reveal>
        </div>
      )}

      {/* O divizi — vedle claimu, ne pod ním */}
      {intro[lang] && (
        <Reveal delay={0.1}>
          <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 lg:col-span-4 md:col-start-7 lg:col-start-8">
              <p className="text-[15px] md:text-[16px] leading-[1.65] text-ink/60 dark:text-white/55">
                {intro[lang]}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Co děláme */}
      <div className="mt-16 md:mt-24">
        <Reveal>
          <div className="flex items-baseline gap-4 border-t border-black/10 dark:border-white/15 pt-5">
            <span className="text-[12px] text-ink/30 dark:text-white/30 tabular-nums">01</span>
            <h2 className="display-xl text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] tracking-[-0.02em] uppercase dark:text-white">
              {lang === "cs" ? "Co děláme" : "What we do"}
            </h2>
          </div>
        </Reveal>

        <div className="mt-7 md:mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-10 lg:grid-cols-4">
          {list.map((p, i) => {
            const src = p.image || previews[p.category];
            return (
              <Reveal key={p.slug || i} delay={i * 0.06}>
                <TapeLink
                  href={p.slug ? `/safy-bx/co-delame/${p.slug}` : "/safy-bx"}
                  className="group block"
                >
                  {src && (
                    <span className="relative block aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 24vw"
                        className="object-cover"
                      />
                      <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                      <span className="absolute left-0 top-0 bg-white dark:bg-dark px-2 py-1 text-[11px] tabular-nums text-ink/50 dark:text-white/50">
                        0{i + 1}
                      </span>
                    </span>
                  )}

                  <h3 className="mt-3 flex items-center gap-2 text-[14.5px] md:text-[17px] font-medium leading-[1.25] group-hover:text-ink/55 dark:group-hover:text-white/60 transition-colors dark:text-white">
                    {p.title}
                    <Doodle
                      name="sipka"
                      className="w-[24px] h-[9px] shrink-0 text-ink/30 dark:text-white/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </h3>

                  <p className="mt-1.5 text-ink/45 dark:text-white/40 leading-[1.5] text-[12.5px] md:text-[13.5px]">
                    {p.text}
                  </p>
                </TapeLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/** Čísla za námi — pod referencemi. */
export function About({ stats = {} }) {
  const { lang, t } = useLang();

  return (
    <Section className="pt-16 md:pt-24 pb-4 md:pb-8">
      <Reveal>
        <div className="flex items-baseline gap-4 border-t border-black/10 dark:border-white/15 pt-5">
          <span className="text-[12px] text-ink/30 dark:text-white/30 tabular-nums">03</span>
          <h2 className="display-xl text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] tracking-[-0.02em] uppercase dark:text-white">
            {t.statsTitle}
          </h2>
        </div>
      </Reveal>
      <div className="mt-8 md:mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
        {(stats[lang] || []).map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="display-xl text-[clamp(2.4rem,6vw,4.6rem)] leading-none whitespace-nowrap tracking-[-0.03em] dark:text-white">
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
