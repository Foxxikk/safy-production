import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { servicesFull } from "../../../lib/content";
import Cta from "../../../components/Cta";

export function generateStaticParams() {
  return servicesFull.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = servicesFull.find((x) => x.slug === slug);
  return { title: s ? `${s.title} - Safyproduction` : "Service" };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = servicesFull.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = servicesFull.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <h1 className="display-xl text-5xl md:text-8xl mb-12">{service.title}</h1>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={service.images[0]} alt={service.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
          <div>
            <div
              className="wp-content text-lg leading-relaxed [&_p]:mb-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1 [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: service.contentHtml }}
            />
            <Link
              href="/contact"
              className="mt-8 inline-block bg-ink text-white font-bold px-10 py-5 hover:bg-brand hover:text-ink transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {service.images.length > 1 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
            {service.images.slice(1).map((img, i) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden bg-ink">
                <Image src={img} alt={`${service.title} — photo ${i + 2}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-3xl font-bold mb-8">More services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {others.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-ink">
              <Image src={s.images[0]} alt={s.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
