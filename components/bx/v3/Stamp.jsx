"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kulaté razítko, které plave za kurzorem s mírným zpožděním.
 *
 * Na mobilu nedává smysl (není kurzor) a kdo má vypnuté animace, nedostane ho
 * vůbec. Schováváme ho taky, jakmile návštěvník opustí úvodní obrazovku —
 * přes reference a texty by jen zavazelo.
 */
export default function Stamp({ text, heroRef }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

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

  // Razítko patří k úvodní obrazovce — níž už se jen plete do cesty
  useEffect(() => {
    const hero = heroRef?.current;
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroRef]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[240px] w-[240px] will-change-transform md:block"
      style={{ transform: "translate3d(-400px,-400px,0)" }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "#79D97C", boxShadow: "6px 6px 0 #1F1F1E" }}
        />
        <svg className="bx3-spin absolute inset-0 h-full w-full" viewBox="0 0 240 240">
          <defs>
            <path
              id="bx3-stamp-circle"
              d="M120,120 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0"
            />
          </defs>
          <text
            style={{
              font: "700 16px Roboto, sans-serif",
              letterSpacing: "3px",
              fill: "#373736",
              textTransform: "uppercase",
            }}
          >
            <textPath href="#bx3-stamp-circle">{text}</textPath>
          </text>
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-black"
          style={{ color: "#373736", fontSize: 64, letterSpacing: "-0.04em" }}
        >
          Š
        </div>
      </div>
    </div>
  );
}
