"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Přechod mezi stránkami ve stylu Šafy.
 * Diagonální pásky "WE ARE ŠAFY" zakryjí celou obrazovku, v zákrytu proběhne
 * navigace a pásky odjedou dál stejným směrem.
 *
 * Směr se řídí navigací: hlouběji (na detail) = zleva doprava,
 * zpět na přehled = zprava doleva. Uživatel tak podvědomě cítí, kam jde.
 *
 * Animuje se jen transform (translate3d) => běží na GPU, bez sekání.
 */

// ——— Ladicí parametry na jednom místě ———
export const TAPE_CONFIG = {
  stripes: 8, // počet pásek
  stagger: 34, // ms mezi nástupem jednotlivých pásek
  move: 520, // ms pohybu jedné pásky
  hold: 140, // ms pauzy v plném zákrytu (tady se mění stránka)
  rotate: -7, // náklon pásek ve stupních
  easing: "cubic-bezier(.83,0,.17,1)",
};

const { stripes: STRIPES, stagger: STAGGER, move: MOVE, hold: HOLD, rotate: ROT, easing: EASE } =
  TAPE_CONFIG;

const COVER_MS = MOVE + STAGGER * (STRIPES - 1);

// Obě pásky nesou "WE ARE ŠAFY ✕ Creative event agency".
// (tape-black.svg a tape-green-2.svg nesou text "References" — na BX nepatří.)
const SRC = ["/images/tapes/tape-green.svg", "/images/tapes/tape-dark.svg"];

/** Kam v hierarchii odkaz vede — hlouběji, nebo zpět. */
function directionFor(from, to) {
  const depth = (p) => p.split("/").filter(Boolean).length;
  return depth(to) >= depth(from) ? 1 : -1; // 1 = doprava, -1 = doleva
}

const TapeCtx = createContext({ navigate: () => {} });
export const useTapeNav = () => useContext(TapeCtx);

export default function TapeTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle"); // idle | covering | revealing
  const [dir, setDir] = useState(1);
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
      setDir(directionFor(pathname, href));
      clear();

      // start až v dalším snímku — GPU vrstva se stihne vytvořit
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("covering")));

      // navigace až v plném zákrytu (případný lag schová páska)
      timers.current.push(
        setTimeout(() => {
          router.push(targetRef.current);
          window.scrollTo(0, 0);
        }, COVER_MS + 30)
      );
      timers.current.push(setTimeout(() => setPhase("revealing"), COVER_MS + HOLD));
      timers.current.push(setTimeout(() => setPhase("idle"), COVER_MS + HOLD + COVER_MS));
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
        {/* Otočený kontejner — pásky uvnitř jsou rovnoběžné a bez mezer */}
        <div
          className="absolute"
          style={{
            top: "-30%",
            left: "-30%",
            width: "160%",
            height: "160%",
            transform: `rotate(${ROT}deg)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Array.from({ length: STRIPES }).map((_, i) => {
            const covering = phase === "covering";
            const off = 112 * dir; // odkud přiletí / kam odletí
            const x = covering ? "0%" : phase === "revealing" ? `${off}%` : `${-off}%`;
            // při odkrývání jde vlna opačně, ať to nepůsobí mechanicky
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
                  transition: `transform ${MOVE}ms ${EASE} ${delay}ms`,
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
