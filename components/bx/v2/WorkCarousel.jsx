"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Container } from "../Section";
import { TapeLink } from "../TapeTransition";
import { ArrowSquare, Dots, ScrollHint } from "./ScrollBits";

const INTERVAL = 5000; // jak dlouho stojí na jedné referenci

/**
 * Reference jako vodorovný carousel.
 *
 * Karty jsou stejně velké a jedou samy zprava doleva, sousedi vykukují
 * za okraji. Jakmile do pásu někdo sáhne, projíždění se zastaví a tlačítko
 * se přepne na „přehrát" — návštěvník má vždycky poslední slovo.
 */
export default function WorkCarousel({
  cases = [],
  categories = {},
  lang = "cs",
  title,
  hint,
  onNext,
}) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  /** Posun na kartu — vystředí ji v pásu. */
  const scrollTo = useCallback((n, smooth = true) => {
    const el = track.current;
    const child = el?.children?.[n];
    if (!el || !child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Komu vadí pohyb, tomu carousel nespouštíme
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // Automatické projíždění
  useEffect(() => {
    if (!playing || cases.length < 2) return;
    const id = setInterval(() => {
      setIndex((n) => {
        const next = (n + 1) % cases.length;
        // Skok z poslední na první uděláme bez animace, ať pás neproletí zpátky
        scrollTo(next, next !== 0);
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [playing, cases.length, scrollTo]);

  // Sledujeme, na které kartě pás právě stojí.
  // Projíždění nezastavujeme podle scroll událostí — ty spouští i vlastní
  // posun. Zastaví ho až doopravdy sáhnutí (níž na pásu).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        [...el.children].forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!cases.length) return null;

  return (
    <section className="bx-screen relative h-[100svh] overflow-hidden bg-[#f1f1ef] text-ink">
      <Dots />

      <div className="relative flex h-full flex-col justify-center gap-5 pb-24 pt-20 md:gap-7 md:pb-24 md:pt-24">
        <Container>
          <h2 className="display-xl uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(1.4rem,3vw,2.8rem)]">
            {title}
          </h2>
        </Container>

        {/* Výšku karty drží proměnná, ať z ní jde dopočítat i odsazení pásu */}
        <div
          ref={track}
          onPointerDown={() => setPlaying(false)}
          onWheel={() => setPlaying(false)}
          onTouchStart={() => setPlaying(false)}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto md:gap-5 [--ch:min(56svh,94vw)] md:[--ch:min(52svh,44vw)]"
          style={{ paddingInline: "calc(50% - var(--ch) * 0.375)" }}
        >
          {cases.map((c, i) => {
            const data = c[lang] || c.cs || {};
            const isActive = i === index;
            return (
              <TapeLink
                key={c.slug}
                href={`/safy-bx/${c.slug}`}
                className="group relative block shrink-0 snap-center"
                style={{ height: "var(--ch)", width: "calc(var(--ch) * 0.75)" }}
              >
                <span className="relative block h-full w-full overflow-hidden bg-ink/5">
                  <Image
                    src={c.images?.[0] || ""}
                    alt={data.title || ""}
                    fill
                    sizes="(max-width: 768px) 72vw, 30vw"
                    // Prvních pár karet načteme rovnou, ať do nich carousel
                    // nenajede dřív, než se stihnou stáhnout
                    loading={i < 4 ? "eager" : "lazy"}
                    className="object-cover"
                  />
                  {/* Karty po stranách ustupují do pozadí, střed drží pozornost */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[#f1f1ef] transition-opacity duration-500"
                    style={{ opacity: isActive ? 0 : 0.4 }}
                  />

                  <span className="absolute inset-x-[4%] bottom-[3.5%] flex items-center justify-between gap-3 bg-ink/85 py-2 pl-4 pr-2">
                    <span className="min-w-0">
                      <span className="block truncate text-[9.5px] uppercase tracking-[0.16em] text-brand">
                        {categories[c.category] || ""}
                      </span>
                      <span className="block truncate text-[14px] font-bold leading-tight text-white md:text-[17px]">
                        {data.title}
                      </span>
                    </span>
                    <ArrowSquare className="h-8 w-8 shrink-0 md:h-10 md:w-10" />
                  </span>
                </span>

                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[3%] border border-dashed border-ink/25 transition-opacity duration-500"
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </TapeLink>
            );
          })}
        </div>

        {/* Ovládání pod pásem — tečky a pauza, jako u velkých značek */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex items-center gap-2.5 rounded-full bg-ink/[0.06] px-4 py-3">
            {cases.map((c, i) => (
              <button
                key={c.slug}
                onClick={() => {
                  setPlaying(false);
                  setIndex(i);
                  scrollTo(i);
                }}
                aria-label={`${i + 1}. reference`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-ink/70" : "w-2 bg-ink/25 hover:bg-ink/45"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Pozastavit" : "Přehrát"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.06] text-ink/70 transition-colors hover:bg-ink/[0.12] hover:text-ink"
          >
            {playing ? (
              <svg width="11" height="12" viewBox="0 0 12 14" fill="currentColor">
                <rect x="1" y="0" width="3.5" height="14" rx="1" />
                <rect x="7.5" y="0" width="3.5" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="12" viewBox="0 0 12 14" fill="currentColor">
                <path d="M1 1.2v11.6c0 .9 1 1.4 1.7.9l8.2-5.8c.6-.4.6-1.3 0-1.7L2.7.3C2 -.2 1 .3 1 1.2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <ScrollHint label={hint} onClick={onNext} />
    </section>
  );
}
