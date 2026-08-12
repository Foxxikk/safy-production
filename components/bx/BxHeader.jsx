"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangContext";

export default function BxHeader() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/safy-bx" aria-label="Šafy production" className="flex items-center gap-3">
          <Image src="/images/logos/safy-logo.svg" alt="šafy" width={88} height={34} priority />
          <span className="hidden sm:block border-l border-black/15 pl-3 text-[13px] leading-tight text-ink/60">
            Brand experience
            <br />
            marketing
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center text-sm">
            {["cs", "en"].map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="mx-1.5 text-ink/20">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`uppercase font-medium transition-colors ${
                    lang === l ? "text-brand" : "text-ink/40 hover:text-ink"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>
          <a
            href="#contact"
            className="bg-ink text-white text-sm font-medium px-5 py-2.5 hover:bg-brand hover:text-ink transition-colors"
          >
            {lang === "cs" ? "Poptávka" : "Enquiry"}
          </a>
        </div>
      </div>
    </header>
  );
}
