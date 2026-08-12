"use client";

import { useState } from "react";
import Image from "next/image";
import { categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { Container, Label, ArrowPill } from "./Section";
import { TapeLink } from "./TapeTransition";

export default function CaseDetail({ item, prev, next }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(null);

  const data = item[lang];
  const pad = (i) => String(i).padStart(2, "0");
  const all = [];
  for (let i = 1; i <= item.images; i++) all.push(`/images/bx/${item.slug}/${pad(i)}.webp`);
  const gallery = all.slice(1);

  return (
    <>
      <Container className="pt-4 md:pt-5 pb-4">
        <TapeLink
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-[13.5px] text-ink/45 dark:text-white/45 hover:text-ink dark:hover:text-white transition-colors"
        >
          ← {t.back}
        </TapeLink>
      </Container>

      {/* Cover — kompaktní, ostré rohy */}
      <div className="px-0">
        <button
          onClick={() => setOpen(0)}
          className="relative block w-full h-[46vh] min-h-[260px] max-h-[560px] md:h-[62vh] overflow-hidden bg-ink/5 cursor-zoom-in group"
        >
          <Image
            src={all[0]}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 text-left">
            <Label tone="light">{categories[lang][item.category]}</Label>
            <h1 className="mt-2.5 display-xl text-white text-[clamp(1.9rem,6vw,4.6rem)] leading-[0.95] tracking-[-0.02em] max-w-[20ch]">
              {data.title}
            </h1>
            <p className="mt-2 text-white/65 text-[14px] md:text-lg">{data.subtitle}</p>
          </div>
        </button>
      </div>

      {/* Text — kompaktní dvousloupec */}
      <Container className="py-10 md:py-16">
        <div className="grid gap-6 md:gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <p className="text-[clamp(1.15rem,2.3vw,1.75rem)] leading-[1.32] tracking-[-0.01em] font-medium max-w-[26ch] dark:text-white">
                {data.intro}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.08}>
              <div className="space-y-4 text-ink/55 dark:text-white/50 leading-[1.7] text-[15px]">
                {data.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Galerie — na mobilu vodorovné listování, na desktopu mřížka */}
      {gallery.length > 0 && (
        <>
          <Container className="pb-3 flex items-center justify-between">
            <Label>{lang === "cs" ? "Galerie" : "Gallery"}</Label>
            <span className="text-[12px] text-ink/30 dark:text-white/30 md:hidden">
              {lang === "cs" ? "táhni →" : "swipe →"}
            </span>
          </Container>

          {/* mobil: horizontální drag */}
          <div className="md:hidden -mx-0 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            <div className="flex gap-2 px-4 w-max">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setOpen(i + 1)}
                  className="relative w-[78vw] aspect-[4/3] shrink-0 snap-center overflow-hidden bg-ink/5"
                >
                  <Image
                    src={img}
                    alt={`${data.title} — ${i + 1}`}
                    fill
                    sizes="78vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* desktop: mřížka */}
          <div className="hidden md:block px-4 md:px-10">
            <div className="grid gap-3 md:grid-cols-2">
              {gallery.map((img, i) => (
                <Reveal
                  key={img}
                  delay={(i % 2) * 0.06}
                  className={i % 3 === 0 ? "md:col-span-2" : ""}
                >
                  <button
                    onClick={() => setOpen(i + 1)}
                    data-cursor
                    className={`relative block w-full overflow-hidden bg-ink/5 cursor-zoom-in group ${
                      i % 3 === 0 ? "aspect-[21/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${data.title} — ${i + 1}`}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Prev / Next — s náhledem další reference */}
      <Container className="mt-10 md:mt-14">
        {[
          [prev, t.prev],
          [next, t.next],
        ].map(([p, lbl]) => (
          <TapeLink
            key={p.slug}
            href={`/safy-bx/${p.slug}`}
            className="group flex items-center justify-between gap-4 border-t border-black/10 dark:border-white/15 py-4 md:py-6"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="relative h-12 w-16 md:h-16 md:w-24 shrink-0 overflow-hidden bg-ink/5">
                <Image
                  src={`/images/bx/${p.slug}/01.webp`}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink/35 dark:text-white/35">[{lbl}]</span>
                <span className="block mt-0.5 text-[clamp(1rem,2.2vw,1.6rem)] font-medium truncate group-hover:text-brand transition-colors dark:text-white">
                  {p[lang].title}
                </span>
              </span>
            </div>
            <ArrowPill label={p[lang].title} />
          </TapeLink>
        ))}
        <div className="border-t border-black/10 dark:border-white/15" />
      </Container>

      <Lightbox
        images={all}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        label={data.title}
      />
    </>
  );
}
