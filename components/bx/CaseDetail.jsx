"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";

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
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 pt-8">
        <Link
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-brand transition-colors"
        >
          ← {t.back}
        </Link>
      </div>

      {/* Cover */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-6">
        <button
          onClick={() => setOpen(0)}
          className="relative block w-full aspect-[16/9] overflow-hidden bg-ink/5 cursor-zoom-in group"
        >
          <Image
            src={all[0]}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
        </button>
      </div>

      {/* Popisná karta */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <div className="relative -mt-16 md:-mt-24 bg-white md:max-w-3xl p-8 md:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
            <p className="text-sm uppercase tracking-[0.2em] text-brand mb-4">
              {categories[lang][item.category]}
            </p>
            <h1 className="display-xl text-3xl md:text-5xl leading-tight">{data.title}</h1>
            <p className="text-ink/50 text-lg mt-2">{data.subtitle}</p>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">{data.intro}</p>
            <div className="mt-5 space-y-4 text-ink/70 leading-relaxed">
              {data.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Galerie */}
      {gallery.length > 0 && (
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-16">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {gallery.map((img, i) => (
              <Reveal
                key={img}
                delay={(i % 2) * 0.07}
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
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-20 flex items-center justify-between gap-6 border-t border-black/10 pt-10 pb-20">
        <Link href={`/safy-bx/${prev.slug}`} className="group min-w-0">
          <span className="block text-[11px] uppercase tracking-widest text-ink/40">{t.prev}</span>
          <span className="block font-bold truncate group-hover:text-brand transition-colors">
            ‹ {prev[lang].title}
          </span>
        </Link>
        <Link href={`/safy-bx/${next.slug}`} className="group min-w-0 text-right">
          <span className="block text-[11px] uppercase tracking-widest text-ink/40">{t.next}</span>
          <span className="block font-bold truncate group-hover:text-brand transition-colors">
            {next[lang].title} ›
          </span>
        </Link>
      </div>

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
