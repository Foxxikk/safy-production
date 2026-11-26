"use client";

import { useEffect, useRef } from "react";

/**
 * Zelené kolečko (bez textu), které plave za kurzorem s mírným zpožděním.
 * Drží se po celém webu, na všech podstránkách. Na mobilu nedává smysl
 * (není kurzor) a kdo má vypnuté animace, nedostane ho vůbec.
 */
export default function Stamp() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let mx = null;
    let my = null;
    let px = window.innerWidth * 0.84;
    let py = window.innerHeight * 0.66;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      if (mx !== null) {
        px += (mx + 80 - px) * 0.07;
        py += (my + 80 - py) * 0.07;
      }
      el.style.transform = `translate3d(${(px - 120).toFixed(1)}px, ${(py - 120).toFixed(
        1
      )}px, 0) scale(0.62)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[240px] w-[240px] will-change-transform md:block"
      style={{ transform: "translate3d(-400px,-400px,0)" }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "#79D97C", boxShadow: "6px 6px 0 #1F1F1E" }}
        />
      </div>
    </div>
  );
}
