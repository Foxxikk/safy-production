import Link from "next/link";
import Image from "next/image";
import BxHeader from "../../components/BxHeader";
import BxFooter from "../../components/BxFooter";
import { bxIntro, pillars, cases } from "../../lib/bx";

export const metadata = {
  title: "ŠAFY BX — Brand experience marketing",
  description:
    "Specializovaná divize Šafy pro Brand Experience marketing: kreativní strategie, interaktivní instalace a vlastní fyzická výroba.",
};

export default function BxLandingPage() {
  return (
    <div className="bg-white text-ink min-h-screen">
      <BxHeader />

      {/* Hero */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pt-20 md:pt-28 pb-16">
        <p className="text-sm uppercase tracking-[0.25em] text-ink/40 mb-6">
          Brand experience marketing
        </p>
        <h1 className="display-xl text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
          ŠAFY <span className="text-brand">BX</span>
        </h1>
        <p className="mt-10 max-w-3xl text-xl md:text-2xl leading-relaxed text-ink/80">
          {bxIntro}
        </p>
      </section>

      {/* Pilíře */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-4 border-t border-black/10 pt-12">
          {pillars.map((p, i) => (
            <div key={p.title}>
              <span className="block text-sm font-mono text-brand mb-4">
                0{i + 1}
              </span>
              <h3 className="text-xl font-bold mb-3 leading-snug">{p.title}</h3>
              <p className="text-ink/65 leading-relaxed text-[15px]">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reference / portfolio */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-10">
        <div className="flex items-end justify-between mb-10">
          <h2 className="display-xl text-4xl md:text-6xl">Selected work</h2>
          <span className="text-ink/40 text-sm hidden sm:block">
            {cases.length} projektů
          </span>
        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {cases.map((c) => (
            <Link key={c.slug} href={`/safy-bx/${c.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                <Image
                  src={`/images/bx/${c.slug}/01.webp`}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-brand transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-ink/50 mt-1">{c.subtitle}</p>
                </div>
                <span className="shrink-0 text-2xl text-ink/30 group-hover:text-brand group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BxFooter />
    </div>
  );
}
