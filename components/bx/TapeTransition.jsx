"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

/**
 * Přechod mezi stránkami ve stylu Šafy — tři diagonální pásky přejedou přes
 * obrazovku, uprostřed přejezdu proběhne navigace, pak pásky odjedou pryč.
 */

const TapeCtx = createContext({ navigate: () => {} });
export const useTapeNav = () => useContext(TapeCtx);

const COVER_MS = 520; // pásky zakrývají obrazovku
const HOLD_MS = 120; // krátká pauza v zákrytu
const REVEAL_MS = 620; // odjezd pásek

// Pouze pásky "WE ARE ŠAFY ✕ Creative event agency" (tape-green / tape-dark).
// Pásky tape-black a tape-green-2 nesou text "References" — na BX nepatří.
const tapes = [
  { src: "/images/tapes/tape-green.svg", top: "4%", rotate: -7, delay: 0 },
  { src: "/images/tapes/tape-dark.svg", top: "37%", rotate: 5, delay: 0.07 },
  { src: "/images/tapes/tape-green.svg", top: "70%", rotate: -4, delay: 0.14 },
];

export default function TapeTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  // "idle" | "covering" | "revealing"
  const [phase, setPhase] = useState("idle");
  const targetRef = useRef(null);
  const timers = useRef([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clear(), []);

  const navigate = useCallback(
    (href) => {
      if (!href || href === pathname) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      targetRef.current = href;
      setPhase("covering");

      timers.current.push(
        setTimeout(() => {
          router.push(targetRef.current);
          window.scrollTo({ top: 0, behavior: "instant" });
        }, COVER_MS)
      );
      timers.current.push(
        setTimeout(() => setPhase("revealing"), COVER_MS + HOLD_MS)
      );
      timers.current.push(
        setTimeout(() => setPhase("idle"), COVER_MS + HOLD_MS + REVEAL_MS)
      );
    },
    [router, pathname]
  );

  const active = phase !== "idle";

  return (
    <TapeCtx.Provider value={{ navigate }}>
      {children}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200]"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        {tapes.map((t, i) => {
          const covering = phase === "covering";
          // zleva dojede do zákrytu, pak pokračuje doprava ven
          const x = covering ? "0%" : phase === "revealing" ? "120%" : "-120%";
          return (
            <div
              key={t.src}
              className="absolute left-1/2 w-[220vw] max-w-none"
              style={{
                top: t.top,
                transform: `translateX(calc(-50% + ${x})) rotate(${t.rotate}deg)`,
                transition: `transform ${
                  covering ? COVER_MS : REVEAL_MS
                }ms cubic-bezier(.76,.02,.28,1) ${t.delay}s`,
              }}
            >
              <Image
                src={t.src}
                alt=""
                width={3200}
                height={110}
                priority
                className="w-full h-[16vh] min-h-[90px] object-cover"
              />
            </div>
          );
        })}
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
