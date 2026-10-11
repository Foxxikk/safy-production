"use client";

import { useCallback, useMemo } from "react";

/**
 * Naklonění prvku za kurzorem.
 *
 * Píšeme rovnou CSS proměnné na element, ne do Reactu — při pohybu myší
 * by přepisování stavu znamenalo překreslení v každém snímku.
 */
export default function useTilt(amp = 18) {
  const onMouseMove = useCallback(
    (e) => {
      const el = e.currentTarget;
      const b = el.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width;
      const y = (e.clientY - b.top) / b.height;
      el.style.setProperty("--ry", `${((x - 0.5) * amp).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * amp).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    },
    [amp]
  );

  const onMouseLeave = useCallback((e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  }, []);

  return useMemo(() => ({ onMouseMove, onMouseLeave }), [onMouseMove, onMouseLeave]);
}
