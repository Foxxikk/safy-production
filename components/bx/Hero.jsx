"use client";

import Image from "next/image";
import Tape from "../Tape";
import { bxIntro, pillars } from "../../lib/bx";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";

export default function Hero() {
  const { lang, t } = useLang();

  return (
    <>
      {/* Hero s fotkou */}
      <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-ink">
        <Image
          src="/images/bx/jagermeister-orange-grape-2025/01.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1500px] w-full px-6 md:px-10 pb-14 md:pb-20">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.25em] text-white/70 mb-5">
                {t.heroLead}
              </p>
              <h1 className="display-xl text-white text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
                ŠAFY <span className="text-brand">BX</span>
              </h1>
              <p className="mt-5 text-white/85 text-xl md:text-2xl font-light">{t.tagline}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Úvodní text */}
      <section className="relative mx-auto max-w-[1500px] px-6 md:px-10 pt-20 md:pt-24 pb-16 overflow-hidden">
        <Tape
          src="/images/tapes/tape-green-2.svg"
          width={1200}
          height={75}
          className="absolute top-10 right-[-28%] w-[62%] hidden lg:block"
          from="translateX(120px) rotate(-3deg)"
          to="rotate(-7deg)"
        />
        <Reveal>
          <p className="max-w-4xl text-xl md:text-[26px] leading-relaxed text-ink/85">
            {bxIntro[lang]}
          </p>
        </Reveal>
      </section>

      {/* Pilíře */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-4 border-t border-black/10 pt-12">
          {pillars[lang].map((p, i) => (
            <Reveal key={p.title} delay={i * 0.09}>
              <span className="block text-sm font-mono text-brand mb-4">0{i + 1}</span>
              <h3 className="text-xl font-bold mb-3 leading-snug">{p.title}</h3>
              <p className="text-ink/65 leading-relaxed text-[15px]">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
