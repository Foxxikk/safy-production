import Image from "next/image";

export const metadata = {
  title: "Kariéra v ŠAFY - Safyproduction",
  description:
    "Náš mladý a příjemný kolektiv hledá dalšího člena týmu, který se bude podílet na vytváření BTL kampaní našich klientů.",
};

export default function CareersPage() {
  return (
    <>
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src="/images/careers/hero.webp"
          alt="Kariéra v Šafy"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="text-lg md:text-xl mb-3 tracking-wide">Kariéra</p>
          <h1 className="display-xl text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-tight">
            Vytvářej nezapomenutelné akce.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="display-xl text-3xl md:text-5xl mb-10">
          Přidej se k <span className="text-brand">SAFY PRODUCTION!</span>
        </h2>
        <a
          href="https://safyproduction.sinch.cz/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-ink text-white font-bold text-lg px-10 py-4 hover:bg-brand hover:text-ink transition-colors"
        >
          Registrovat se
        </a>
      </section>
    </>
  );
}
