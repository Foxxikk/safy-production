"use client";

import Image from "next/image";
import { clientLogos } from "../../lib/bx";
import { useLang } from "./LangContext";
import { Container } from "./Section";
import Reveal from "./Reveal";

/** Klidný pás s logy klientů — bez rušivého marquee tempa. */
export function Clients() {
  const { t } = useLang();
  const row = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <Container>
        <div className="border-t border-black/[0.09] pt-10">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.22em] text-ink/35 mb-10">
              {t.clientsTitle}
            </p>
          </Reveal>
        </div>
      </Container>

      <div className="flex w-max animate-marquee items-center">
        {row.map((b, i) => (
          <div key={`${b}-${i}`} className="mx-9 shrink-0 opacity-35 grayscale">
            <Image src={`/images/brands/${b}.png`} alt={b} width={110} height={55} />
          </div>
        ))}
      </div>
    </section>
  );
}
