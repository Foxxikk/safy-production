"use client";

import Image from "next/image";
import Link from "next/link";
import Tape from "../Tape";
import { useLang } from "./LangContext";

export default function BxFooter() {
  const { lang } = useLang();

  return (
    <footer className="relative bg-dark text-white overflow-hidden">
      <Tape
        src="/images/tapes/tape-green.svg"
        width={1200}
        height={75}
        className="absolute -top-5 right-[-20%] w-[70%] hidden md:block"
        from="translateX(120px) rotate(-4deg)"
        to="rotate(-6deg)"
      />
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 py-16">
        <div className="grid gap-8 md:grid-cols-3 text-white/60 text-[15px]">
          <div>
            <Image src="/images/logos/safy-white.svg" alt="šafy" width={90} height={35} />
            <p className="mt-4 text-white/40 text-[13px] uppercase tracking-[0.2em]">ŠAFY BX</p>
          </div>
          <div>
            <p className="text-white mb-2">Šafy production s.r.o.</p>
            <p>Údolní 212/1, 147 00, Praha 4</p>
            <p>IČO: 24769444, DIČ: CZ24769444</p>
          </div>
          <div>
            <a
              href="mailto:info@safyproduction.cz"
              className="block hover:text-brand transition-colors"
            >
              info@safyproduction.cz
            </a>
            <Link href="/" className="block mt-3 hover:text-brand transition-colors">
              {lang === "cs" ? "Hlavní web Šafy →" : "Main Šafy website →"}
            </Link>
          </div>
        </div>

        <p className="mt-12 text-white/40 text-sm border-t border-white/10 pt-8">
          © {new Date().getFullYear()} Šafy production s.r.o. — WE ARE ŠAFY
        </p>
      </div>
    </footer>
  );
}
