"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { ArrowCircle } from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";


/**
 * Úvod stránky: mohutný claim, zvýrazněný nadtitulek, čísla v řádku pod ním
 * a čtyři pilíře. Typografie nese hlavní váhu, barva funguje jako akcent.
 */
export default function Hero({ claim = {}, intro = {}, stats = {}, pillars = {}, previews = {} }) {
  const { lang } = useLang();
  const list = (pillars[lang] || []).filter((p) => p.published !== false);
  const c = claim[lang] || claim.cs || {};
  const numbers = stats[lang] || [];

  return (
    <Section className="pt-6 md:pt-10 pb-0">
      {/* Claim */}
      {(c.line1 || c.line2) && (
        <div className="relative">
          <Reveal>
            {/* Zvýrazněný nadtitulek — barva jako podklad textu, ne jako plocha */}
            <span className="inline-block bg-brand px-3 py-1 text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-ink">
              Brand experience marketing
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-5 md:mt-7 flex items-end gap-6 md:gap-10">
              <h1 className="display-xl text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.86] tracking-[-0.035em] uppercase dark:text-white">
                <span className="block">{c.line1}</span>
                <span className="relative inline-block">
                  {c.line2}
                  <Doodle
                    name="podtrzeni-1"
                    className="absolute -bottom-[0.1em] left-0 w-[104%] h-[0.09em] text-brand"
                  />
                </span>
              </h1>

              {/* Proklik na reference — kruhový detail podle referenčního webu */}
              <a href="#work" className="group hidden md:block pb-3">
                <ArrowCircle size="lg" />
              </a>
            </div>
          </Reveal>
        </div>
      )}

      {/* Text o divizi vpravo, vedle prázdného pole vlevo */}
      {intro[lang] && (
        <Reveal delay={0.1}>
          <div className="mt-8 md:mt-12 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 lg:col-span-4 md:col-start-7 lg:col-start-8">
              <p className="text-[15px] md:text-[16px] leading-[1.65] text-ink/60 dark:text-white/55">
                {intro[lang]}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Čísla hned pod claimem, oddělená svislými linkami */}
      {numbers.length > 0 && (
        <Reveal delay={0.14}>
          <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 border-t border-black/10 dark:border-white/15">
            {numbers.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 md:py-7 md:px-6 first:md:pl-0 ${
                  i % 2 === 1 ? "pl-5 border-l border-black/10 dark:border-white/15" : ""
                } md:border-l md:first:border-l-0 md:border-black/10 md:dark:border-white/15`}
              >
                <div className="display-xl text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none tracking-[-0.03em] dark:text-white">
                  {s.value}
                </div>
                <p className="mt-2 text-[12px] md:text-[12.5px] uppercase tracking-[0.12em] text-ink/40 dark:text-white/40 leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
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
            <span className="ml-1 h-2 w-2 rounded-full bg-brand" aria-hidden />
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
                      <span className="absolute left-0 top-0 bg-brand px-2 py-1 text-[11px] tabular-nums text-ink">
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
