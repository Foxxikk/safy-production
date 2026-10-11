"use client";

/**
 * Dvě překřížené jedoucí pásky na předělu mezi sekcemi.
 *
 * Pásky mají dělit sekce, ne se mezi nimi jen tak vznášet — proto je pruh
 * vysoký, pásky silné a mají mezi sebou odstup. V návrhu byly jen 18 px od
 * sebe, takže se po většině šířky překrývaly a texty si lezly do sebe;
 * teď se kříží jen u krajů, což vypadá zamýšleně.
 */
export default function Tapes({ words = [], className = "", brand = false }) {
  // Před patičkou nese tmavá páska jen jméno divize, ať se obory neopakují
  const line = brand
    ? Array.from({ length: 12 }, () => "Brand experience marketing")
    : [...words, ...words];
  const safy = Array.from({ length: 12 });

  return (
    <div aria-hidden className={`relative h-[230px] overflow-hidden md:h-[260px] ${className}`}>
      {/* Tmavá páska s obory */}
      <div
        className="absolute -left-12 -right-12 top-[38px] z-[2] overflow-hidden bg-ink py-4 text-white md:py-5"
        style={{ transform: "rotate(-2.2deg)" }}
      >
        <div className="bx3-marq">
          {line.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap px-6 text-[24px] font-black uppercase tracking-[0.02em] md:text-[30px]"
            >
              {t} <span className="pl-6 text-brand">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Zelená páska se jménem divize */}
      <div
        className="absolute -left-12 -right-12 top-[132px] z-[1] overflow-hidden bg-brand py-3.5 text-ink md:top-[150px] md:py-4"
        style={{ transform: "rotate(2.6deg)" }}
      >
        <div className="bx3-marq rev">
          {safy.map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-6 text-[22px] font-black uppercase md:text-[27px]"
            >
              We are šafy{" "}
              <span className="font-light normal-case">| Brand experience</span>{" "}
              <b className="font-bold normal-case">marketing</b> ×
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
