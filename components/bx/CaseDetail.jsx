"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { Container } from "./Section";

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
      <Container className="pt-8 pb-6">
        <Link
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-[14px] text-ink/50 hover:text-brand transition-colors"
        >
          ← {t.back}
        </Link>
      </Container>

      {/* Titulek nad fotkou — jasná hierarchie */}
      <Container className="pb-8">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-ink/35">
            {categories[lang][item.category]}
          </p>
          <h1 className="display-xl mt-3 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] max-w-[20ch]">
            {data.title}
          </h1>
          <p className="mt-3 text-ink/50 text-lg md:text-xl">{data.subtitle}</p>
        </Reveal>
      </Container>

      {/* Cover */}
      <Container>
        <Reveal>
          <button
            onClick={() => setOpen(0)}
            className="relative block w-full aspect-[16/9] overflow-hidden bg-ink/5 cursor-zoom-in group"
          >
            <Image
              src={all[0]}
              alt={data.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.02]"
              priority
            />
          </button>
        </Reveal>
      </Container>

      {/* Text */}
      <Container className="py-16 md:py-20">
        <div className="grid gap-y-6 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Reveal>
              <p className="text-[12px] uppercase tracking-[0.22em] text-ink/35">
                {t.brandExperience}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <Reveal>
              <p className="text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.6] text-ink/85 max-w-[62ch]">
                {data.intro}
              </p>
              <div className="mt-6 space-y-5 text-ink/65 leading-[1.75] text-[16.5px] max-w-[62ch]">
                {data.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Galerie */}
      {gallery.length > 0 && (
        <Container>
          <div className="grid gap-5 md:gap-6 md:grid-cols-2">
            {gallery.map((img, i) => (
              <Reveal
                key={img}
                delay={(i % 2) * 0.06}
                className={i % 3 === 0 ? "md:col-span-2" : ""}
              >
                <button
                  onClick={() => setOpen(i + 1)}
                  className={`relative block w-full overflow-hidden bg-ink/5 cursor-zoom-in group ${
                    i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${data.title} — ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </Container>
      )}

      {/* Prev / Next */}
      <Container className="mt-20 pb-24">
        <div className="flex items-center justify-between gap-6 border-t border-black/[0.09] pt-10">
          <Link href={`/safy-bx/${prev.slug}`} className="group min-w-0">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-ink/35">
              {t.prev}
            </span>
            <span className="block mt-1 font-medium truncate group-hover:text-brand transition-colors">
              ‹ {prev[lang].title}
            </span>
          </Link>
          <Link href={`/safy-bx/${next.slug}`} className="group min-w-0 text-right">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-ink/35">
              {t.next}
            </span>
            <span className="block mt-1 font-medium truncate group-hover:text-brand transition-colors">
              {next[lang].title} ›
            </span>
          </Link>
        </div>
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
