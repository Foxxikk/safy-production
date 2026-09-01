"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { ArrowCircle } from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";

/**
 * Úvod stránky ve dvou polovinách: vlevo mohutná typografie, vpravo vizuál.
 * Pod nimi čísla v jednom řádku a čtyři pilíře.
 */
export default function Hero({
  claim = {},
  intro = {},
  stats = {},
  pillars = {},
  previews = {},
  heroImage = null,
  caseCount = 0,
}) {
  const { lang } = useLang();
  const list = (pillars[lang] || []).filter((p) => p.published !== false);
  const c = claim[lang] || claim.cs || {};
  const numbers = stats[lang] || [];

  return (
    <Section className="pt-6 md:pt-8 pb-0">
      {/* ——— Hero: text vlevo, vizuál vpravo ——— */}
      <div className="grid gap-10 md:gap-8 md:grid-cols-12 md:items-start">
        {/* Levá polovina */}
        <div className="md:col-span-6 lg:col-span-6">
          {(c.line1 || c.line2) && (
            <Reveal>
              <h1 className="display-xl text-[clamp(2.8rem,7.5vw,5.6rem)] leading-[0.86] tracking-[-0.04em] uppercase dark:text-white">
                {c.line1}{" "}
                {/* Zvýrazněný štítek sedí přímo v textu, ne nad ním */}
                <span className="align-middle inline-block bg-brand px-2.5 py-1 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink whitespace-nowrap font-sans font-medium">
                  Brand experience
                </span>{" "}
                <span className="relative inline-block">
                  {c.line2}
                  <Doodle
                    name="podtrzeni-1"
                    className="absolute -bottom-[0.08em] left-0 w-[103%] h-[0.08em] text-brand"
                  />
                </span>
              </h1>
            </Reveal>
          )}

          {intro[lang] && (
            <Reveal delay={0.08}>
              <p className="mt-7 md:mt-9 text-[14.5px] md:text-[15.5px] leading-[1.6] text-ink/60 dark:text-white/55 max-w-[46ch]">
                {intro[lang]}
              </p>
            </Reveal>
          )}

          {/* CTA se zvýrazněným podkladem a kruhovou šipkou */}
          <Reveal delay={0.12}>
            <a href="#work" className="group mt-8 md:mt-10 inline-flex items-center gap-4">
              <span className="relative text-[13px] uppercase tracking-[0.16em] font-medium dark:text-white">
                {lang === "cs" ? "Prohlédnout reference" : "See our work"}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-[6px] bg-brand -z-10"
                />
              </span>
              <ArrowCircle />
            </a>
          </Reveal>
        </div>

        {/* Pravá polovina — vizuál s páskou a číslováním */}
        {heroImage && (
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 relative">
            <Reveal delay={0.06}>
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-ink/5 dark:bg-white/5">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
                {/* Páska přes vizuál — brandový prvek místo abstraktní grafiky */}
                <div className="pointer-events-none absolute inset-x-0 bottom-[18%] -rotate-[6deg]">
                  <Image
                    src="/images/tapes/tape-green.svg"
                    alt=""
                    aria-hidden
                    width={2400}
                    height={75}
                    className="w-[150%] max-w-none -ml-[25%]"
                  />
                </div>
              </div>
            </Reveal>

            {/* Číslování jako u referenčního webu */}
            <div className="absolute -right-2 md:-right-6 top-6 hidden lg:flex flex-col items-center gap-3">
              <span className="display-xl text-[22px] leading-none dark:text-white">01</span>
              <span className="h-14 w-px bg-black/20 dark:bg-white/25" />
              <span className="display-xl text-[22px] leading-none text-ink/25 dark:text-white/25">
                {String(caseCount || 0).padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ——— Čísla ——— */}
      {numbers.length > 0 && (
        <Reveal delay={0.14}>
          <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-black/10 dark:border-white/15">
            {numbers.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 md:py-7 md:px-6 md:first:pl-0 ${
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

      {/* ——— Co děláme ——— */}
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
