"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { Container, Label, ArrowPill } from "./Section";

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
      <Container className="pt-6 pb-7">
        <Link
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-[14px] text-ink/45 hover:text-ink transition-colors"
        >
          ← {t.back}
        </Link>
      </Container>

      {/* Cover */}
      <div className="px-3 md:px-4">
        <button
          onClick={() => setOpen(0)}
          className="relative block w-full aspect-[16/9] overflow-hidden rounded-[20px] md:rounded-[28px] bg-ink/5 cursor-zoom-in group"
        >
          <Image
            src={all[0]}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-left">
            <Label tone="light">{categories[lang][item.category]}</Label>
            <h1 className="mt-4 display-xl text-white text-[clamp(2.2rem,6.5vw,5.5rem)] leading-[0.92] tracking-[-0.02em] max-w-[18ch]">
              {data.title}
            </h1>
            <p className="mt-3 text-white/65 text-[16px] md:text-lg">{data.subtitle}</p>
          </div>
        </button>
      </div>

      {/* Text */}
      <Container className="py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <p className="text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.3] tracking-[-0.01em] font-medium max-w-[24ch]">
                {data.intro}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.08}>
              <div className="space-y-5 text-ink/55 leading-[1.75] text-[15.5px]">
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
        <div className="px-3 md:px-4">
          <div className="grid gap-3 md:gap-4 md:grid-cols-2">
            {gallery.map((img, i) => (
              <Reveal
                key={img}
                delay={(i % 2) * 0.06}
                className={i % 3 === 0 ? "md:col-span-2" : ""}
              >
                <button
                  onClick={() => setOpen(i + 1)}
                  className={`relative block w-full overflow-hidden rounded-[18px] bg-ink/5 cursor-zoom-in group ${
                    i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${data.title} — ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <Container className="mt-16 pb-4">
        {[
          [prev, t.prev],
          [next, t.next],
        ].map(([p, lbl], i) => (
          <Link
            key={p.slug}
            href={`/safy-bx/${p.slug}`}
            className="group flex items-center justify-between gap-6 border-t border-black/10 py-7"
          >
            <div className="min-w-0">
              <span className="text-[12px] text-ink/35">[{lbl}]</span>
              <p className="mt-1.5 text-[clamp(1.2rem,2.4vw,1.9rem)] font-medium truncate group-hover:text-brand transition-colors">
                {p[lang].title}
              </p>
            </div>
            <ArrowPill label={p[lang].title} />
          </Link>
        ))}
        <div className="border-t border-black/10" />
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
