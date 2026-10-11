"use client";

import { useRouter } from "next/navigation";

import { useTapeNav } from "../TapeTransition";
import useTilt from "./useTilt";

const ACCENT = "#79D97C";
const DARK = "#373736";

/** Barevné schéma karet — střídá se, aby mřížka nebyla jednotvárná. */
const FRONTS = [
  { bg: DARK, fg: "#FFFFFF", num: ACCENT },
  { bg: ACCENT, fg: DARK, num: DARK },
  { bg: "#FFFFFF", fg: DARK, num: DARK },
  { bg: "#C6C6C6", fg: DARK, num: DARK },
];
const BACKS = [
  { bg: ACCENT, fg: DARK },
  { bg: DARK, fg: "#FFFFFF" },
  { bg: DARK, fg: "#FFFFFF" },
  { bg: ACCENT, fg: DARK },
];

/**
 * „Od nápadu po šroubek" — čtyři pilíře jako otáčecí karty.
 * Žádné fotky: na líci číslo a název, na rubu text.
 */
export default function Pillars({ t, pillars = [] }) {
  return (
    <section id="pilire" className="px-5 pb-[100px] pt-[80px] md:px-12 md:pb-[140px] md:pt-[100px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <h2
            className="m-0 font-black uppercase"
            style={{ fontSize: "clamp(36px, 6vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
          >
            {t.pillarsTitle[0]}
            <br />
            {t.pillarsTitle[1]} <span className="bx3-hl">{t.pillarsTitle[2]}</span>
          </h2>
          <p className="m-0 max-w-[320px] text-[17px] font-light leading-snug md:text-[18px]">
            {t.pillarsNote[0]} <b className="font-bold">{t.pillarsNote[1]}</b>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <PillarCard key={p.slug || p.title} p={p} i={i} flipLabel={t.flip} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ p, i, flipLabel }) {
  const tilt = useTilt(18);
  const { navigate } = useTapeNav();
  const router = useRouter();
  const front = FRONTS[i % FRONTS.length];
  const back = BACKS[i % BACKS.length];
  // Podstránky pilířů zatím zůstávají v původní grafice
  const href = p.slug ? `/safy-bx/co-delame/${p.slug}` : null;
  const num = String(i + 1).padStart(2, "0");

  return (
    <div className="bx3-pwrap">
      <button
        type="button"
        className="bx3-pcard"
        aria-label={`${p.title}: ${p.text}`}
        onClick={() => href && (navigate ? navigate(href) : router.push(href))}
        {...tilt}
      >
        <span className="bx3-pinner">
          <span className="bx3-pface" style={{ background: front.bg, color: front.fg }}>
            <span className="flex items-start justify-between gap-3">
              <span
                className="font-black"
                style={{
                  fontSize: 104,
                  lineHeight: 0.8,
                  letterSpacing: "-0.05em",
                  color: front.num,
                }}
              >
                {num}
              </span>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </span>
            <span className="block">
              <span
                className="block font-black uppercase"
                style={{ fontSize: 28, lineHeight: 1.02, letterSpacing: "-0.01em" }}
              >
                {p.title}
              </span>
              <span className="bx3-mono mt-4 block text-[11px] opacity-80">{flipLabel}</span>
            </span>
          </span>

          <span
            className="bx3-pface bx3-pback"
            style={{ background: back.bg, color: back.fg }}
          >
            <span className="bx3-mono block text-[12px]">
              {num} / {p.title}
            </span>
            <span className="block text-[18px] font-normal leading-[1.5] md:text-[20px]">
              {p.text}
            </span>
            <span className="bx3-mono block text-[11px] opacity-80">We are šafy</span>
          </span>
        </span>
        <span className="bx3-glare" aria-hidden />
      </button>
    </div>
  );
}
