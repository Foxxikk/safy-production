"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "./LangContext";
import { Container } from "./Section";

export default function BxFooter() {
  const { lang } = useLang();

  return (
    <footer className="bg-dark text-white">
      {/* Páska Šafy — záměrný celoplošný pás, ne useknutý prvek v prázdnu */}
      <div className="relative h-16 md:h-20 overflow-hidden bg-white">
        <Image
          src="/images/tapes/tape-green.svg"
          alt=""
          aria-hidden
          width={2400}
          height={75}
          className="absolute left-1/2 top-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-2"
        />
      </div>

      <Container className="py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3 text-white/55 text-[15px] leading-relaxed">
          <div>
            <Image src="/images/logos/safy-white.svg" alt="šafy" width={92} height={36} />
            <p className="mt-4 text-[12px] uppercase tracking-[0.22em] text-white/40">ŠAFY BX</p>
          </div>
          <div>
            <p className="text-white mb-2">Šafy production s.r.o.</p>
            <p>Údolní 212/1, 147 00, Praha 4</p>
            <p>IČO: 24769444, DIČ: CZ24769444</p>
          </div>
          <div>
            <a
              href="mailto:info@safyproduction.cz"
              className="block hover:text-white transition-colors"
            >
              info@safyproduction.cz
            </a>
            <Link href="/" className="block mt-3 hover:text-white transition-colors">
              {lang === "cs" ? "Hlavní web Šafy →" : "Main Šafy website →"}
            </Link>
          </div>
        </div>

        <p className="mt-14 border-t border-white/10 pt-8 text-white/35 text-[13px]">
          © {new Date().getFullYear()} Šafy production s.r.o. — WE ARE ŠAFY
        </p>
      </Container>
    </footer>
  );
}
