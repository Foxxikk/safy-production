"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { TapeLink } from "../TapeTransition";
import { ArrowSquare, Dots, ScrollHint, Steps } from "./ScrollBits";

const RATIO = 0.75; // šířka ku výšce karty (na výšku, 3:4)
const EASE = "cubic-bezier(.22,.61,.36,1)";
const MOVE = "0.75s";

/** Rozměry karet dopočítáváme z okna, ať velká karta vždy sedí do výšky. */
function measure() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 768;

  const bigW = Math.max(140, Math.min(vh * 0.68 * RATIO, vw * (mobile ? 0.6 : 0.3)));
  const smW = bigW * (mobile ? 0.38 : 0.44);
  return { bigW, bigH: bigW / RATIO, smW, smH: smW / RATIO, gap: bigW * 0.06 };
}

/** Vodorovná poloha karty vůči středu obrazovky. */
function offsetFor(i, active, d) {
  if (i === active) return 0;
  const dist = Math.abs(i - active);
  const x = d.bigW / 2 + d.gap + d.smW / 2 + (dist - 1) * (d.smW + d.gap);
  return i > active ? x : -x;
}

/**
 * Reference jako pás, který scrollem putuje zprava doleva.
 * Uprostřed je vždy jedna velká, sousední zůstávají menší po stranách.
 */
export default function WorkScreens({
  cases = [],
  categories = {},
  lang = "cs",
  title,
  step = 0,
  hint,
  onNext,
}) {
  const [d, setD] = useState({ bigW: 360, bigH: 480, smW: 158, smH: 211, gap: 22 });

  useEffect(() => {
    const calc = () => setD(measure());
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
    };
  }, []);

  if (!cases.length) return null;
  const active = Math.min(step, cases.length - 1);

  return (
    <section className="relative bg-[#f1f1ef] text-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Dots />

        {/* Nadpis ustoupí, jakmile pás zaplní šířku — stejně jako v návrhu */}
        <h2
          className={`pointer-events-none absolute left-4 top-[7%] z-20 max-w-[8ch] display-xl uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(1.25rem,3vw,2.8rem)] transition-opacity duration-500 md:left-10 md:top-[20%] ${
            active === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          {title}
        </h2>

        <div className="relative h-full">
          {cases.map((c, i) => {
            const isActive = i === active;
            const dist = Math.abs(i - active);
            const data = c[lang] || c.cs || {};
            return (
              <TapeLink
                key={c.slug}
                href={`/safy-bx/${c.slug}`}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                className="group absolute left-1/2 top-1/2 block"
                style={{
                  width: isActive ? d.bigW : d.smW,
                  height: isActive ? d.bigH : d.smH,
                  transform: `translate(calc(-50% + ${offsetFor(i, active, d)}px), -50%)`,
                  opacity: dist > 4 ? 0 : 1,
                  zIndex: isActive ? 10 : 5 - Math.min(dist, 4),
                  transition: `transform ${MOVE} ${EASE}, width ${MOVE} ${EASE}, height ${MOVE} ${EASE}, opacity .45s ease`,
                }}
              >
                <span className="relative block h-full w-full overflow-hidden bg-ink/5">
                  <Image
                    src={c.images?.[0] || ""}
                    alt={data.title || ""}
                    fill
                    sizes={isActive ? "34vw" : "16vw"}
                    className="object-cover"
                  />
                  {/* Neaktivní karty jsou lehce zesvětlené, ať střed drží pozornost */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[#f1f1ef] transition-opacity duration-500"
                    style={{ opacity: isActive ? 0 : 0.32 }}
                  />

                  <span
                    className={`absolute inset-x-[4%] bottom-[3.5%] flex items-center justify-between gap-3 bg-ink/85 py-2 pl-4 pr-2 transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[9.5px] uppercase tracking-[0.16em] text-brand">
                        {categories[c.category] || ""}
                      </span>
                      <span className="block truncate text-[15px] font-bold leading-tight text-white md:text-[19px]">
                        {data.title}
                      </span>
                    </span>
                    <ArrowSquare className="h-9 w-9 shrink-0 md:h-11 md:w-11" />
                  </span>
                </span>

                {/* Čárkovaný rámeček jen kolem té velké */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[3%] border border-dashed border-ink/25 transition-opacity duration-500"
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </TapeLink>
            );
          })}
        </div>

        <ScrollHint label={hint} onClick={onNext} />
      </div>

      <Steps n={cases.length} />
    </section>
  );
}
