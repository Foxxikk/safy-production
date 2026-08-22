"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Label } from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";

/**
 * Úvod stránky: krátké představení divize a pod ním čtyři pilíře
 * vedle sebe jako oddělené dlaždice. Každá je proklik na vlastní stránku.
 */
export default function Hero({ intro = {}, pillars = {}, previews = {} }) {
  const { lang } = useLang();
  const list = (pillars[lang] || []).filter((p) => p.published !== false);

  return (
    <Section className="pt-8 md:pt-10 pb-2 md:pb-4">
      {/* O divizi */}
      {intro[lang] && (
        <Reveal>
          <p className="text-[12px] md:text-[13px] uppercase tracking-[0.24em] text-ink/45 dark:text-white/45">
            Brand experience marketing
          </p>
          <p className="mt-4 md:mt-5 text-[clamp(1rem,1.7vw,1.3rem)] leading-[1.5] tracking-[-0.005em] text-ink/70 dark:text-white/70 max-w-[62ch]">
            {intro[lang]}
          </p>
        </Reveal>
      )}

      {/* Co děláme — čtyři dlaždice vedle sebe */}
      <div className="mt-9 md:mt-12">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1] tracking-[-0.02em] dark:text-white">
            {lang === "cs" ? "Co děláme" : "What we do"}
          </h2>
        </Reveal>

        <div className="mt-5 md:mt-6 grid gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => {
            const src = p.image || previews[p.category];
            return (
              <Reveal key={p.slug || i} delay={i * 0.06}>
                <TapeLink
                  href={p.slug ? `/safy-bx/co-delame/${p.slug}` : "/safy-bx"}
                  className="group flex h-full flex-col bg-white dark:bg-dark p-4 md:p-5 transition-colors hover:bg-ink/[0.02] dark:hover:bg-white/[0.04]"
                >
                  {src && (
                    <span className="relative block aspect-[16/10] overflow-hidden bg-ink/5 dark:bg-white/5 mb-4">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                        className="object-cover"
                      />
                    </span>
                  )}

                  <span className="text-[11px] text-ink/30 dark:text-white/30 tabular-nums">
                    0{i + 1}
                  </span>

                  <h3 className="mt-1.5 text-[16px] md:text-[17px] font-medium leading-[1.25] dark:text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-ink/55 dark:text-white/50 leading-[1.5] text-[13.5px]">
                    {p.text}
                  </p>

                  <span className="mt-auto pt-4 inline-flex items-center gap-2.5 text-[13px] text-ink/40 dark:text-white/40 group-hover:text-ink dark:group-hover:text-white transition-colors">
                    {lang === "cs" ? "Více" : "More"}
                    <Doodle
                      name="sipka"
                      className="w-[26px] h-[10px] group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
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
