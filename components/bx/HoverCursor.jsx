"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kurzor, který se u karet projektů promění v zelený štítek "OTEVŘÍT →".
 * Jen na zařízeních s myší — na dotyku se nezobrazuje.
 */
export default function HoverCursor({ label = "OTEVŘÍT" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const hit = e.target.closest?.("[data-cursor]");
      setVisible(Boolean(hit));
    };

    const loop = () => {
      // plynulé dojíždění za kurzorem
      cur.current.x += (pos.current.x - cur.current.x) * 0.18;
      cur.current.y += (pos.current.y - cur.current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cur.current.x}px, ${cur.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[150] hidden md:block"
      style={{
        opacity: visible ? 1 : 0,
        scale: visible ? "1" : "0.6",
        transition: "opacity .25s ease, scale .25s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      <span className="inline-flex items-center gap-2 bg-brand text-ink text-[12px] font-medium tracking-[0.08em] px-4 py-2.5">
        {label} →
      </span>
    </div>
  );
}
