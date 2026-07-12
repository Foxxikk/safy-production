import Link from "next/link";
import Image from "next/image";
import { services } from "../../lib/site";

export const metadata = { title: "Services - Safyproduction" };

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-24 pb-10">
        <Image
          src="/images/tapes/tape-green.svg"
          alt=""
          width={1200}
          height={75}
          className="pointer-events-none absolute top-10 right-[-30%] w-[75%] max-w-none rotate-[-8deg]"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-6 relative">
          <h1 className="display-xl text-7xl md:text-9xl">Services</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [&>*]:break-inside-avoid">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group block mb-12">
              <div className={`relative overflow-hidden border border-ink/15 ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image
                  src={s.images[0]}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="font-bold text-xl mt-4 group-hover:text-brand transition-colors">{s.title}</h2>
              <p className="text-ink/70 text-[15px] mt-1 leading-relaxed">{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
