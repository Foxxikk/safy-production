import Link from "next/link";
import Image from "next/image";

export default function BxHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/safy-bx" aria-label="Šafy production" className="flex items-center gap-3">
          <Image
            src="/images/logos/safy-logo.svg"
            alt="šafy"
            width={88}
            height={34}
            priority
          />
          <span className="hidden sm:block border-l border-black/15 pl-3 text-[13px] leading-tight text-ink/60">
            Brand experience
            <br />
            marketing
          </span>
        </Link>
        <a
          href="mailto:info@safyproduction.cz"
          className="text-sm font-medium text-ink hover:text-brand transition-colors"
        >
          Kontakt
        </a>
      </div>
    </header>
  );
}
