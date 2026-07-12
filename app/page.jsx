import Link from "next/link";
import Image from "next/image";
import { services, references } from "../lib/data";
import LogoMarquee from "../components/LogoMarquee";
import Cta from "../components/Cta";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-28 md:pb-44">
          <div className="relative z-10 max-w-xl">
            <h1 className="display-xl text-6xl md:text-8xl uppercase">
              We are
              <br />
              Šafy
            </h1>
            <p className="mt-6 text-2xl md:text-3xl">
              Creative <strong>event agency</strong>
            </p>
            <Link
              href="/reference"
              className="mt-10 inline-block bg-ink text-white font-bold px-10 py-5 hover:bg-brand hover:text-ink transition-colors"
            >
              References
            </Link>
          </div>

          {/* Tapes */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-[45%] right-0 hidden md:block" aria-hidden>
            <Image
              src="/images/tapes/tape-dark.svg"
              alt=""
              width={900}
              height={57}
              className="tape-anim absolute top-[30%] left-[5%] w-[900px] max-w-none rotate-[-22deg] z-10"
              style={{ "--tape-from": "translateY(60px) rotate(-18deg)", "--tape-to": "rotate(-22deg)", animationDelay: "0.1s" }}
            />
            <Image
              src="/images/tapes/tape-black.svg"
              alt=""
              width={800}
              height={50}
              className="tape-anim absolute top-[5%] right-[-30%] w-[800px] max-w-none rotate-[55deg]"
              style={{ "--tape-from": "translateY(-60px) rotate(49deg)", "--tape-to": "rotate(55deg)", animationDelay: "0.3s" }}
            />
            <Image
              src="/images/tapes/tape-green.svg"
              alt=""
              width={1100}
              height={69}
              className="tape-anim absolute top-[55%] left-[-8%] w-[1100px] max-w-none rotate-[-9deg] z-20"
              style={{ "--tape-from": "translateY(80px) rotate(-5deg)", "--tape-to": "rotate(-9deg)", animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* BELIEF */}
      <section className="mx-auto max-w-5xl px-6 py-28 md:py-40">
        <h2 className="text-3xl md:text-5xl font-normal leading-snug md:text-right">
          We believe in a world where <strong>clients are more than just numbers.</strong>{" "}
          A personal approach is key to ensuring you get the most out of{" "}
          <strong>your Event experiences.</strong>
        </h2>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <h2 className="display-xl text-7xl md:text-9xl mb-8">Services</h2>
        <p className="max-w-2xl text-xl md:text-2xl mb-14">
          Experience our full spectrum of event solutions—from immersive brand
          showcases to <strong>engaging consumer contests.</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-ink"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute bottom-5 left-5 right-5 text-white font-bold text-lg leading-tight">
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* REFERENCES */}
      <section className="relative bg-ink text-white pt-32 pb-6">
        <Image
          src="/images/tapes/tape-references.svg"
          alt="šafy References"
          width={1600}
          height={100}
          className="pointer-events-none absolute -top-10 right-[-5%] w-[80%] max-w-none rotate-[-7deg]"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-6">
          <Image src="/images/logos/safy-white.svg" alt="šafy" width={150} height={72} />
          <h2 className="display-xl text-6xl md:text-8xl mt-4 mb-10">References</h2>
          <Link
            href="/reference"
            className="inline-block border border-white px-7 py-4 font-bold hover:bg-brand hover:text-ink hover:border-brand transition-colors"
          >
            All references
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3">
          {references.slice(0, 9).map((r) => (
            <Link key={r.slug} href={`/reference/${r.slug}`} className="group relative aspect-[4/3] overflow-hidden">
              <Image
                src={r.image}
                alt={r.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-5 left-5 right-5 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {r.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
