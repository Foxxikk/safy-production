"use client";

import Image from "next/image";

import Doodle from "../Doodle";
import { ScrollHint } from "./ScrollBits";

/**
 * První obrazovka — fotka přes celou plochu a claim přes ni.
 *
 * Do stejného místa přijde později sestříhané video; obrázek se pak jen
 * vymění za <video>, zbytek rozvržení zůstane.
 */
export default function HeroScreen({ image, words = [], hint, onNext }) {
  const [first, accent, last] = words;

  return (
    <section className="bx-screen relative h-[100svh] w-full overflow-hidden bg-ink">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/* Ztmavení, aby text držel kontrast na jakékoli fotce */}
      <span aria-hidden className="absolute inset-0 bg-ink/45" />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55"
      />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <h1 className="display-xl text-center uppercase text-white text-[clamp(2.3rem,10.5vw,9rem)] leading-[0.92] tracking-[-0.035em]">
          <span className="block">{first}</span>
          <span className="block text-brand">{accent}</span>
          <span className="relative inline-block">
            {last}
            <Doodle
              name="podtrzeni-1"
              className="absolute -bottom-[0.05em] left-0 w-[103%] h-[0.075em] text-brand"
            />
          </span>
        </h1>
      </div>

      <ScrollHint tone="light" label={hint} onClick={onNext} />
    </section>
  );
}
