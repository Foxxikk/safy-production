"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL = 3800; // jak dlouho stojí na jedné položce
const RESUME_AFTER = 6000; // jak dlouho počkáme, než se zase rozjede

/**
 * Vodorovný carousel, který se sám posouvá.
 *
 * Jakmile do něj návštěvník sáhne (dotyk, kolečko, klávesnice), zastaví se
 * tam, kde ho nechal. Po chvíli nečinnosti se zase rozjede. Respektuje
 * i systémové nastavení „omezit pohyb“.
 */
export default function Carousel({ children, count = 0, className = "" }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef(null);
  const programmatic = useRef(false);

  /** Posun na položku — bez animace při skoku zpět na začátek. */
  const scrollTo = useCallback((i, smooth = true) => {
    const track = trackRef.current;
    const child = track?.children?.[i];
    if (!track || !child) return;
    programmatic.current = true;
    track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    setTimeout(() => {
      programmatic.current = false;
    }, 600);
  }, []);

  /** Dotek uživatele carousel zastaví a po chvíli klidu ho zase pustí. */
  const pause = useCallback(() => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER);
  }, []);

  // Automatické posouvání
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % count;
        scrollTo(next, next !== 0);
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [paused, count, scrollTo]);

  // Sledujeme, kde carousel právě stojí, ať navazujeme tam, kde ho nechal uživatel
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf;
    const onScroll = () => {
      if (!programmatic.current) pause();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = [...track.children];
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        kids.forEach((k, i) => {
          const center = k.offsetLeft - track.offsetLeft + k.clientWidth / 2;
          const d = Math.abs(center - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer.current);
    };
  }, [pause]);

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onPointerDown={pause}
        className="-mx-4 px-4 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {children}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center gap-1.5 px-1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                pause();
                setIndex(i);
                scrollTo(i);
              }}
              aria-label={`Projekt ${i + 1}`}
              className="h-4 flex-1 flex items-center"
            >
              <span
                className={`block h-[2px] w-full transition-colors ${
                  i === index ? "bg-ink dark:bg-white" : "bg-ink/15 dark:bg-white/20"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
