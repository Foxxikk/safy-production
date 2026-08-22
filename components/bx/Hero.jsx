"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Label } from "./Section";
import Doodle from "./Doodle";
import { TapeLink } from "./TapeTransition";

/**
 * Úvod stránky: stručné představení divize a čtyři pilíře.
 * Držíme se vzdušného výrazu — žádné rámečky ani boxy, jen fotky a prostor.
 */
export default function Hero({ intro = {}, pillars = {}, previews = {} }) {
  const { lang } = useLang();
  const list = (pillars[lang] || []).filter((p) => p.published !== false);

  return (
    <Section className="pt-8 md:pt-10 pb-2 md:pb-4">
      {/* O divizi */}
      {intro[lang] && (
        <Reveal>
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.24em] text-ink/40 dark:text-white/40">
            Brand experience marketing
          </p>
          <p className="mt-4 text-[15px] md:text-[16px] leading-[1.65] text-ink/60 dark:text-white/55 max-w-[68ch]">
            {intro[lang]}
          </p>
        </Reveal>
      )}

      {/* Co děláme */}
      <div className="mt-12 md:mt-16">
        <Reveal>
          <Label>{lang === "cs" ? "Co děláme" : "What we do"}</Label>
        </Reveal>

        <div className="mt-6 md:mt-8 grid gap-x-4 gap-y-9 md:gap-x-5 sm:grid-cols-2 lg:grid-cols-4">
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                        className="object-cover"
                      />
                      <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                    </span>
                  )}

                  <h3 className="mt-3.5 flex items-center gap-2.5 text-[16px] md:text-[17px] font-medium leading-[1.25] group-hover:text-ink/55 dark:group-hover:text-white/60 transition-colors dark:text-white">
                    {p.title}
                    <Doodle
                      name="sipka"
                      className="w-[24px] h-[9px] shrink-0 text-ink/30 dark:text-white/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </h3>

                  <p className="mt-1.5 text-ink/45 dark:text-white/40 leading-[1.5] text-[13.5px]">
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
