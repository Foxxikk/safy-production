import Link from "next/link";
import Image from "next/image";
import { references } from "../../lib/data";
import Cta from "../../components/Cta";

export const metadata = { title: "References - Safyproduction" };

export default function ReferencesPage() {
  return (
    <>
      <section className="relative bg-ink text-white pt-28 pb-20 overflow-hidden">
        <Image
          src="/images/tapes/tape-references.svg"
          alt=""
          width={1600}
          height={100}
          className="pointer-events-none absolute top-6 right-[-10%] w-[90%] max-w-none rotate-[-7deg] opacity-80"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-6 relative">
          <Image src="/images/logos/safy-white.svg" alt="šafy" width={150} height={72} />
          <h1 className="display-xl text-6xl md:text-9xl mt-4">References</h1>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3">
        {references.map((r) => (
          <Link key={r.slug} href={`/reference/${r.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-ink">
            <Image
              src={r.image}
              alt={r.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-5 left-5 right-5 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {r.title}
            </span>
          </Link>
        ))}
      </section>
      <Cta />
    </>
  );
}
