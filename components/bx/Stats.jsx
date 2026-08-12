"use client";

import Image from "next/image";
import { stats, clientLogos } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";

export function Stats() {
  const { lang, t } = useLang();
  const items = stats[lang];

  return (
    <section className="bg-dark text-white py-20 md:py-24 mt-8">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-brand mb-10">
            {t.statsTitle}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="display-xl text-4xl md:text-6xl text-brand leading-none">
                {s.value}
              </div>
              <p className="mt-3 text-white/60 text-[15px] leading-snug">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  const { t } = useLang();
  const row = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 overflow-hidden">
      <Reveal>
        <p className="mx-auto max-w-[1500px] px-6 md:px-10 text-sm uppercase tracking-[0.25em] text-ink/40 mb-8">
          {t.clientsTitle}
        </p>
      </Reveal>
      <div className="flex w-max animate-marquee items-center">
        {row.map((b, i) => (
          <div key={`${b}-${i}`} className="mx-10 shrink-0 opacity-45 grayscale">
            <Image src={`/images/brands/${b}.png`} alt={b} width={130} height={65} />
          </div>
        ))}
      </div>
    </section>
  );
}
