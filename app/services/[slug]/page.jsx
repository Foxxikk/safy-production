import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services } from "../../../lib/data";
import Cta from "../../../components/Cta";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s ? `${s.title} - Safyproduction` : "Service" };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <h1 className="display-xl text-5xl md:text-8xl mb-12">{service.title}</h1>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xl md:text-2xl leading-relaxed">{service.description}</p>
            <Link
              href="/contact"
              className="mt-10 inline-block bg-ink text-white font-bold px-10 py-5 hover:bg-brand hover:text-ink transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-3xl font-bold mb-8">More services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {others.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-ink">
              <Image src={s.image} alt={s.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-5 left-5 text-white font-bold text-lg">{s.title}</span>
            </Link>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
