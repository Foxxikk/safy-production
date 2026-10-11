"use client";

/**
 * Předěl mezi dvěma sekcemi: dvě překřížené jedoucí pásky na švu.
 *
 * Pruh je plný — nahoře barva sekce nad ním, dole barva sekce pod ním.
 * Když se mezi páskami prosvítalo pozadí stránky, působily jako prvek
 * vznášející se uprostřed; takhle je z toho skutečné rozdělení.
 */
export default function Tapes({ words = [], top = "#373736", bottom = "#F0F0EF", brand = false }) {
  // Na druhém a třetím předělu už obory nemá cenu opakovat — pásky tam
  // nesou jméno značky, každá jinou půlku, ať se text nezdvojuje.
  const line = brand ? Array.from({ length: 12 }, () => "We are šafy") : [...words, ...words];
  const safy = Array.from({ length: 12 });

  return (
    <div aria-hidden className="relative h-[300px] overflow-hidden md:h-[400px]">
      {/* Plocha sekce nad švem a pod ním */}
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: top }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: bottom }} />

      {/* Tmavá páska s obory */}
      <div
        className="absolute -left-16 -right-16 top-[34px] z-[2] overflow-hidden bg-ink py-6 text-white md:top-[46px] md:py-8"
        style={{ transform: "rotate(-2.2deg)" }}
      >
        <div className="bx3-marq">
          {line.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap px-8 text-[32px] font-black uppercase tracking-[0.02em] md:text-[52px]"
            >
              {t} <span className="pl-8 text-brand">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Zelená páska se jménem divize */}
      <div
        className="absolute -left-16 -right-16 top-[166px] z-[1] overflow-hidden bg-brand py-5 text-ink md:top-[214px] md:py-7"
        style={{ transform: "rotate(2.6deg)" }}
      >
        <div className="bx3-marq rev">
          {safy.map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-8 text-[28px] font-black uppercase md:text-[46px]"
            >
              {brand ? (
                <>
                  <span className="font-light normal-case">Brand experience</span>{" "}
                  <b className="font-bold normal-case">marketing</b> ×
                </>
              ) : (
                <>
                  We are šafy{" "}
                  <span className="font-light normal-case">| Brand experience</span>{" "}
                  <b className="font-bold normal-case">marketing</b> ×
                </>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
