"use client";

import Image from "next/image";

import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section, { Container, Label, ArrowPill } from "./Section";
import { TapeLink } from "./TapeTransition";

/**
 * Detail jednoho pilíře „Co děláme“.
 * Pod textem ukazuje reference ze stejné kategorie, ať je vidět, že to není jen slib.
 */
export default function PillarDetail({ pillar, prev, next, cases = [], categories = {}, index }) {
  const { lang } = useLang();
  const cats = categories[lang] || {};
  // Obě jazykové verze přijdou ze serveru, vybíráme až tady podle přepínače.
  const p = pillar[lang] || pillar.cs;
  const prevP = prev?.[lang] || prev?.cs;
  const nextP = next?.[lang] || next?.cs;

  return (
    <>
      <Container className="pt-4 md:pt-6 pb-2">
        <TapeLink
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-[13.5px] text-ink/45 dark:text-white/45 hover:text-ink dark:hover:text-white transition-colors"
        >
          ← {lang === "cs" ? "Zpět na přehled" : "Back to overview"}
        </TapeLink>
      </Container>

      {/* Úvod */}
      <Section className="pt-6 md:pt-10 pb-0">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="text-[13px] text-ink/30 dark:text-white/30 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Label>{lang === "cs" ? "Co děláme" : "What we do"}</Label>
          </div>
          <h1 className="mt-4 md:mt-6 display-xl text-[clamp(2rem,5.5vw,4.2rem)] leading-[0.98] tracking-[-0.02em] dark:text-white">
            {p.title}
          </h1>
        </Reveal>

        {p.lead && (
          <Reveal delay={0.06}>
            <p className="mt-5 md:mt-7 text-[clamp(1.15rem,2.4vw,1.8rem)] leading-[1.3] tracking-[-0.01em] font-medium max-w-[30ch] dark:text-white">
              {p.lead}
            </p>
          </Reveal>
        )}
      </Section>

      {/* Text a odrážky */}
      <Section className="pt-8 md:pt-12">
        <div className="grid gap-8 md:gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <div className="space-y-5 text-ink/60 dark:text-white/55 leading-[1.75] text-[15.5px] md:text-[16.5px]">
                {(p.body || []).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {(p.bullets || []).length > 0 && (
            <div className="md:col-span-4 md:col-start-9">
              <Reveal delay={0.08}>
                <Label>{lang === "cs" ? "Konkrétně" : "In practice"}</Label>
                <ul className="mt-5">
                  {p.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="border-t border-black/10 dark:border-white/15 py-3.5 text-[14.5px] leading-snug dark:text-white/85"
                    >
                      {b}
                    </li>
                  ))}
                  <li className="border-t border-black/10 dark:border-white/15" />
                </ul>
              </Reveal>
            </div>
          )}
        </div>
      </Section>

      {/* Reference z této oblasti */}
      {cases.length > 0 && (
        <Section className="pt-0">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4">
              <Label>
                {lang === "cs" ? "Z této oblasti" : "From this area"}
                {cats[p.category] ? ` · ${cats[p.category]}` : ""}
              </Label>
              <TapeLink
                href="/safy-bx"
                className="text-[13.5px] text-ink/45 dark:text-white/45 hover:text-ink dark:hover:text-white transition-colors"
              >
                {lang === "cs" ? "Všechny projekty →" : "All projects →"}
              </TapeLink>
            </div>
          </Reveal>

          <div className="mt-6 md:mt-8 grid gap-x-4 gap-y-8 md:gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.slice(0, 3).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06}>
                <TapeLink href={`/safy-bx/${c.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">
                    {c.images?.[0] && (
                      <Image
                        src={c.images[0]}
                        alt={c[lang]?.title || ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 31vw"
                        className="object-cover"
                      />
                    )}
                    <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                  </div>
                  <h3 className="mt-3 text-[16px] md:text-[17px] font-medium leading-snug group-hover:text-ink/55 dark:group-hover:text-white/60 transition-colors dark:text-white">
                    {c[lang]?.title}
                  </h3>
                  <p className="mt-0.5 text-ink/45 dark:text-white/40 text-[13.5px]">
                    {c[lang]?.subtitle}
                  </p>
                </TapeLink>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Předchozí / další pilíř */}
      <Container className="mt-2 md:mt-6">
        {[
          [prevP, lang === "cs" ? "Předchozí" : "Previous"],
          [nextP, lang === "cs" ? "Další" : "Next"],
        ]
          .filter(([x]) => x)
          .map(([x, lbl]) => (
            <TapeLink
              key={x.slug}
              href={`/safy-bx/co-delame/${x.slug}`}
              className="group flex items-center justify-between gap-4 border-t border-black/10 dark:border-white/15 py-5 md:py-7"
            >
              <span className="min-w-0">
                <span className="block text-[11px] text-ink/35 dark:text-white/35">[{lbl}]</span>
                <span className="block mt-1 text-[clamp(1.1rem,2.4vw,1.7rem)] font-medium truncate group-hover:text-ink/55 dark:group-hover:text-white/60 transition-colors dark:text-white">
                  {x.title}
                </span>
              </span>
              <ArrowPill label={x.title} />
            </TapeLink>
          ))}
        <div className="border-t border-black/10 dark:border-white/15" />
      </Container>
    </>
  );
}
