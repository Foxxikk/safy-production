"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const ACCENT = "#79D97C";

/** Z úvodního textu bereme první dvě věty — zbytek o divizi patří jinam. */
function lead(text = "", max = 2) {
  return (text.match(/[^.!?]+[.!?]*/g) || [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max)
    .join(" ");
}

/**
 * Úvodní obrazovka: fotka nebo video přes celou plochu, claim s rotujícím
 * slovem a razítko plovoucí za kurzorem.
 */
export default function Hero({ t, intro = "", image, video }) {
  const [wi, setWi] = useState(0);

  // Slovo v claimu se mění samo; kdo má vypnuté animace, uvidí první z nich
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWi((n) => (n + 1) % t.words.length), 2200);
    return () => clearInterval(id);
  }, [t.words.length]);

  const text = lead(intro);
  const at = t.introAccent ? text.indexOf(t.introAccent) : -1;

  return (
    <section
      className="relative flex items-end overflow-hidden text-white"
      style={{ minHeight: "max(720px, calc(100svh - 84px))" }}
    >
      {/* Místo pro showreel — dokud není, drží kompozici fotka */}
      <div className="absolute inset-0 bg-[#2A2A29]">
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          image && (
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(31,31,30,0.88) 0%, rgba(31,31,30,0.62) 48%, rgba(31,31,30,0.25) 100%), linear-gradient(0deg, rgba(31,31,30,0.7) 0%, rgba(31,31,30,0) 45%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-28 pt-24 md:px-12 md:pb-[120px]">
        <p className="bx3-mono m-0 mb-7 text-[12px] md:text-[13px]">
          {t.eyebrow.map((e, i) => (
            <span key={e}>
              {i > 0 && <span style={{ color: ACCENT }}> / </span>}
              {e}
            </span>
          ))}
        </p>

        <h1
          className="m-0 font-black uppercase"
          style={{
            fontSize: "clamp(42px, 10.5vw, 168px)",
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="block">{t.lead}</span>

          {/* Okénko na jeden řádek, uvnitř se posouvá seznam slov.
              Zelená plocha kryje celé slovo i s přesahem — pruh přes část
              řádku se na fotce ztrácel a písmena z něj koukala ven. */}
          <span className="block overflow-hidden" style={{ height: "1.14em" }}>
            <span
              className="block"
              style={{
                transform: `translateY(-${wi * 1.14}em)`,
                transition: "transform .7s cubic-bezier(.7,0,.2,1)",
              }}
            >
              {t.words.map((w) => (
                <span key={w} className="block" style={{ height: "1.14em" }}>
                  <span
                    className="inline-block"
                    style={{
                      padding: "0.08em 0.1em 0.12em",
                      lineHeight: 0.9,
                      color: "#373736",
                      background: ACCENT,
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </span>

          <span className="relative inline-block">
            {t.tail}
            <svg
              aria-hidden
              viewBox="0 0 600 40"
              preserveAspectRatio="none"
              className="absolute overflow-visible"
              style={{ left: "-2%", bottom: "-0.16em", width: "104%", height: "0.24em" }}
            >
              <path
                d="M4 26 C 120 14, 260 10, 400 14 S 560 22, 596 12"
                fill="none"
                stroke={ACCENT}
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M30 34 C 160 24, 320 22, 470 24 S 570 28, 590 22"
                fill="none"
                stroke={ACCENT}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8 md:mt-14">
          <p
            className="m-0 max-w-[580px] font-light"
            style={{ fontSize: "clamp(17px, 1.7vw, 24px)", lineHeight: 1.45, color: "#F0F0EF" }}
          >
            {at >= 0 ? (
              <>
                {text.slice(0, at)}
                <span className="relative whitespace-nowrap font-bold text-white">
                  {t.introAccent}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                    className="absolute overflow-visible"
                    style={{
                      left: -10,
                      top: -9,
                      width: "calc(100% + 20px)",
                      height: "calc(100% + 18px)",
                    }}
                  >
                    <path
                      d="M12 34 C 6 14, 70 4, 120 6 S 198 18, 194 34 S 120 58, 70 55 S 4 46, 18 26"
                      fill="none"
                      stroke={ACCENT}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                {text.slice(at + t.introAccent.length)}
              </>
            ) : (
              text
            )}
          </p>

          <a className="bx3-btn g" href="#reference">
            {t.seeRefs}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>

      <a
        href="#pilire"
        className="bx3-mono absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2.5 text-white no-underline"
      >
        <span
          className="bx3-bob flex h-[30px] w-[30px] items-center justify-center rounded-full"
          style={{ border: `1.5px dashed ${ACCENT}` }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={ACCENT}
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
        <span className="text-[11px]">{t.scroll}</span>
      </a>
    </section>
  );
}
