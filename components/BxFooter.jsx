import Image from "next/image";
import Tape from "./Tape";

export default function BxFooter() {
  return (
    <footer className="relative bg-dark text-white overflow-hidden mt-24">
      <Tape
        src="/images/tapes/tape-green.svg"
        width={1200}
        height={75}
        className="absolute -top-4 right-[-20%] w-[70%] hidden md:block"
        from="translateX(120px) rotate(-4deg)"
        to="rotate(-6deg)"
      />
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-brand mb-4">ŠAFY BX</p>
        <h2 className="display-xl text-4xl md:text-6xl max-w-3xl leading-tight">
          Máte značku, která si zaslouží emoční stopu?
        </h2>
        <a
          href="mailto:info@safyproduction.cz"
          className="inline-block mt-8 bg-white text-ink font-bold px-8 py-4 hover:bg-brand transition-colors"
        >
          Napište nám
        </a>

        <div className="mt-16 grid gap-8 md:grid-cols-3 text-white/60 text-[15px] border-t border-white/10 pt-10">
          <div>
            <Image src="/images/logos/safy-white.svg" alt="šafy" width={90} height={35} />
          </div>
          <div>
            <p className="text-white mb-2">Šafy production s.r.o.</p>
            <p>Údolní 212/1, 147 00, Praha 4</p>
            <p>IČO: 24769444, DIČ: CZ24769444</p>
          </div>
          <div>
            <a href="mailto:info@safyproduction.cz" className="block hover:text-brand transition-colors">
              info@safyproduction.cz
            </a>
            <a href="mailto:casting@safyproduction.cz" className="block hover:text-brand transition-colors">
              casting@safyproduction.cz
            </a>
          </div>
        </div>

        <p className="mt-10 text-white/40 text-sm">
          © {new Date().getFullYear()} Šafy production s.r.o. — WE ARE ŠAFY
        </p>
      </div>
    </footer>
  );
}
