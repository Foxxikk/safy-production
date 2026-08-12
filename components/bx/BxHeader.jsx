"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangContext";

export default function BxHeader() {
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 h-[72px] flex items-center justify-between">
        <Link href="/safy-bx" aria-label="Šafy production" className="flex items-center gap-3">
          <Image src="/images/logos/safy-logo.svg" alt="šafy" width={82} height={32} priority />
          <span className="hidden sm:block text-[12px] text-ink/45">[BX]</span>
        </Link>

        <div className="flex items-center gap-5">
          <div className="flex items-center text-[13px]">
            {["cs", "en"].map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="mx-1.5 text-ink/20">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`uppercase transition-colors ${
                    lang === l ? "text-ink" : "text-ink/35 hover:text-ink"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-ink text-white pl-5 pr-1.5 py-1.5 text-[14px] hover:bg-brand hover:text-ink transition-colors"
          >
            {lang === "cs" ? "Poptávka" : "Enquiry"}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink group-hover:bg-ink group-hover:text-white transition-colors">
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
