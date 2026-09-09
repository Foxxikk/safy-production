"use client";

import Image from "next/image";

import { thumb } from "@/lib/bxThumb";
import Doodle, { DOODLE_RATIO } from "../Doodle";
import { TapeLink } from "../TapeTransition";
import { ArrowSquare, Dots, ScrollHint, Steps } from "./ScrollBits";

/** Ručně kreslený prvek u každého pilíře — pořadí odpovídá pořadí pilířů. */
const MARKS = ["zakrouzkovani", "koruna", "podtrzeni-2", "hvezda"];

/** Šířku prvku dopočítáme z jeho poměru stran, ať mají všechny podobnou výšku. */
const markWidth = (ratio) => `${Math.min(38, 16 * ratio)}%`;

/**
 * Služby (pilíře) — přilepená sekce přes tolik obrazovek, kolik je pilířů.
 * Scrollem se mění fotka i text, rozvržení zůstává na místě.
 */
export default function ServicesScreens({ pillars = [], previews = {}, step = 0, hint, onNext }) {
  if (!pillars.length) return null;

  const images = pillars.map((p) => thumb(p.image || previews[p.category] || ""));
  const active = Math.min(step, pillars.length - 1);

  return (
    <section className="relative bg-ink text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Dots tone="light" />

        {/* ——— Desktop: nadpis vlevo u horní hrany fotky, text vpravo u spodní ——— */}
        <div className="relative hidden h-full items-center justify-center px-10 md:flex">
          <div className="flex items-stretch gap-8 lg:gap-14">
            <div className="flex w-[clamp(150px,19vw,290px)] flex-col justify-start pt-1">
              <Swap active={active} className="text-left">
                {pillars.map((p) => (
                  <h2
                    key={p.slug || p.title}
                    className="display-xl uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(1.3rem,2.95vw,2.8rem)]"
                  >
                    {p.title}
                  </h2>
                ))}
              </Swap>
            </div>

            <PhotoStack
              images={images}
              active={active}
              pillar={pillars[active]}
              className="w-[min(34vw,52svh)]"
            />

            <div className="flex w-[clamp(150px,19vw,290px)] flex-col justify-end pb-1">
              <Swap active={active}>
                {pillars.map((p) => (
                  <p
                    key={p.slug || p.title}
                    className="text-[clamp(12.5px,1.05vw,15px)] font-medium leading-[1.75] text-white/90"
                  >
                    {p.text}
                  </p>
                ))}
              </Swap>
            </div>
          </div>
        </div>

        {/* ——— Mobil: nadpis, fotka, text pod sebou ——— */}
        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 pb-20 pt-16 md:hidden">
          <Swap active={active} className="w-full text-left">
            {pillars.map((p) => (
              <h2
                key={p.slug || p.title}
                className="display-xl uppercase leading-[1.05] tracking-[-0.02em] text-[26px]"
              >
                {p.title}
              </h2>
            ))}
          </Swap>

          <PhotoStack
            images={images}
            active={active}
            pillar={pillars[active]}
            className="w-[min(74vw,40svh)]"
          />

          <Swap active={active} className="w-full text-left">
            {pillars.map((p) => (
              <p key={p.slug || p.title} className="text-[13.5px] leading-[1.7] text-white/85">
                {p.text}
              </p>
            ))}
          </Swap>
        </div>

        <ScrollHint tone="light" label={hint} onClick={onNext} />
      </div>

      <Steps n={pillars.length} />
    </section>
  );
}

/**
 * Fotka pilíře jako vrchní karta z balíčku.
 * Ostatní fotky vykukují nad ní, čárkovaný rámeček je odsazený ven.
 */
function PhotoStack({ images, active, pillar, className = "" }) {
  const n = images.length;
  const mark = MARKS[active % MARKS.length];
  const ratio = DOODLE_RATIO[mark] || 1;
  const href = pillar?.slug ? `/safy-bx/co-delame/${pillar.slug}` : null;

  const card = (
    <span className="relative block aspect-square w-full">
      {/* Karty v pozadí — vykukují nad vrchní fotkou */}
      {[1, 2].map((k) => (
        <span
          key={k}
          aria-hidden
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: `translateY(-${k * 7}%) scaleX(${1 - k * 0.07})`,
            opacity: 0.9 - (k - 1) * 0.35,
            zIndex: 3 - k,
          }}
        >
          {/* Z karet v pozadí je vidět jen úzký proužek, takže tady stačí
              jediná fotka — prolínat všechny by znamenalo dekódovat je navíc. */}
          <Image
            src={images[(active + k) % n]}
            alt=""
            fill
            sizes="45vw"
            className="object-cover grayscale"
          />
        </span>
      ))}

      {/* Vrchní fotka */}
      <span className="absolute inset-0 z-[5] overflow-hidden bg-white/5">
        <Layer images={images} index={active} sizes="45vw" priority />
      </span>

      {/* Čárkovaný rámeček odsazený ven */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[3.2%] z-[6] border border-dashed border-white/35"
      />

      {/* Zelený čtverec se šipkou v rohu fotky */}
      <ArrowSquare className="absolute right-[5%] top-[5%] z-[7] h-[13%] w-[13%]" />

      {/* Ručně kreslený prvek přes levý dolní roh */}
      <Doodle
        name={mark}
        className="absolute bottom-[7%] left-[-11%] z-[7] text-brand"
        style={{ width: markWidth(ratio), aspectRatio: `${ratio}` }}
      />
    </span>
  );

  return href ? (
    <TapeLink href={href} className={`group relative block shrink-0 ${className}`}>
      {card}
    </TapeLink>
  ) : (
    <div className={`relative shrink-0 ${className}`}>{card}</div>
  );
}

/** Všechny fotky leží přes sebe a prolínají se — bez bliknutí při výměně. */
function Layer({ images, index, sizes, priority = false }) {
  return (
    <>
      {images.map(
        (src, i) =>
          src && (
            <Image
              key={`${src}-${i}`}
              src={src}
              alt=""
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className={`object-cover grayscale transition-opacity duration-[650ms] ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          )
      )}
    </>
  );
}

/** Texty leží přes sebe ve stejné buňce mřížky a střídají se prolnutím. */
function Swap({ children, active, className = "" }) {
  return (
    <div className={`grid ${className}`}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{ gridArea: "1 / 1" }}
          className={`transition-all duration-500 ease-out ${
            i === active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
