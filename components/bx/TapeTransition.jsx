"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Přechod mezi stránkami ve stylu Šafy.
 * Diagonální pásky "WE ARE ŠAFY" postupně zakryjí CELOU obrazovku,
 * v zákrytu proběhne navigace a pásky odjedou pryč.
 *
 * Pásky jsou CSS background (repeat-x) místo <img> — levnější na kompozici,
 * animuje se jen transform (translate3d) => běží na GPU, bez sekání.
 */

const TapeCtx = createContext({ navigate: () => {} });
export const useTapeNav = () => useContext(TapeCtx);

const STRIPES = 7;
const STAGGER = 55; // ms mezi pásky
const MOVE = 780; // ms trvání pohybu jedné pásky
const COVER_MS = MOVE + STAGGER * (STRIPES - 1); // vše zakryto
const HOLD_MS = 220; // pauza v zákrytu (tady se mění stránka)

// Střídavě zelená / tmavá — obě nesou "WE ARE ŠAFY ✕ Creative event agency".
// (tape-black.svg a tape-green-2.svg nesou text "References" — na BX nepatří.)
const SRC = ["/images/tapes/tape-green.svg", "/images/tapes/tape-dark.svg"];

export default function TapeTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle"); // idle | covering | revealing
  const targetRef = useRef(null);
  const timers = useRef([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clear(), []);

  // Předehřát SVG, ať první přechod nezadrhne
  useEffect(() => {
    SRC.forEach((s) => {
      const img = new window.Image();
      img.src = s;
    });
  }, []);

  const navigate = useCallback(
    (href) => {
      if (!href || href === pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      targetRef.current = href;
      clear();

      // start až v dalším snímku — layer se stihne vytvořit, animace nezadrhne
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("covering")));

      // navigace až když je vše zakryté (případný lag schová páska)
      timers.current.push(
        setTimeout(() => {
          router.push(targetRef.current);
          window.scrollTo(0, 0);
        }, COVER_MS + 40)
      );
      timers.current.push(setTimeout(() => setPhase("revealing"), COVER_MS + HOLD_MS));
      timers.current.push(setTimeout(() => setPhase("idle"), COVER_MS + HOLD_MS + COVER_MS));
    },
    [router, pathname]
  );

  const active = phase !== "idle";

  return (
    <TapeCtx.Provider value={{ navigate }}>
      {children}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        {/* Otočený kontejner — pásky jsou uvnitř rovnoběžné a bez mezer */}
        <div
          className="absolute"
          style={{
            top: "-30%",
            left: "-30%",
            width: "160%",
            height: "160%",
            transform: "rotate(-7deg)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Array.from({ length: STRIPES }).map((_, i) => {
            const covering = phase === "covering";
            // zleva dovnitř, pak dál doprava ven
            const x = covering ? "0%" : phase === "revealing" ? "112%" : "-112%";
            // při odkrývání jde stagger odspodu, ať to nevypadá mechanicky
            const delay = (covering ? i : STRIPES - 1 - i) * STAGGER;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  marginTop: i === 0 ? 0 : "-1px", // pojistka proti vlasovým mezerám
                  backgroundImage: `url(${SRC[i % 2]})`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  transform: `translate3d(${x}, 0, 0)`,
                  transition: `transform ${MOVE}ms cubic-bezier(.85,0,.15,1) ${delay}ms`,
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              />
            );
          })}
        </div>
      </div>
    </TapeCtx.Provider>
  );
}

/** Odkaz, který spustí přechod s páskami. */
export function TapeLink({ href, children, className = "", ...rest }) {
  const { navigate } = useTapeNav();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
