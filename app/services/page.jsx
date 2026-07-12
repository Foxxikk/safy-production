import Link from "next/link";
import Image from "next/image";
import { services } from "../../lib/data";
import Cta from "../../components/Cta";

export const metadata = { title: "Services - Safyproduction" };

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-28">
        <h1 className="display-xl text-7xl md:text-9xl mb-8">Services</h1>
        <p className="max-w-2xl text-xl md:text-2xl mb-14">
          Experience our full spectrum of event solutions—from immersive brand
          showcases to <strong>engaging consumer contests.</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group relative aspect-[4/3] overflow-hidden bg-ink"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute bottom-5 left-5 right-5 text-white font-bold text-xl">
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
