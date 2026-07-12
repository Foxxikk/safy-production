import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services } from "../../../lib/site";

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
  const idx = services.findIndex((s) => s.slug === slug);
  if (idx === -1) notFound();
  const service = services[idx];
  const prev = services[(idx - 1 + services.length) % services.length];
  const next = services[(idx + 1) % services.length];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-14 pb-24">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 border border-ink px-5 py-3 font-bold text-sm hover:bg-ink hover:text-white transition-colors"
      >
        ← Back to services
      </Link>

      {/* Hero: image left, title right */}
      <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="display-xl text-5xl md:text-7xl">{service.title}</h1>
          {service.subtitle && (
            <h2 className="text-xl md:text-2xl font-bold mt-6">{service.subtitle}</h2>
          )}
        </div>
      </div>

      {/* Text */}
      <div
        className="mx-auto max-w-4xl mt-16 text-lg leading-relaxed [&_p]:mb-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1 [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: service.contentHtml }}
      />

      {/* Gallery */}
      {service.images.length > 1 && (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {service.images.slice(1).map((img, i) => (
            <div key={img} className="relative aspect-[4/3] overflow-hidden bg-ink/5">
              <Image
                src={img}
                alt={`${service.title} — photo ${i + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Prev / Next */}
      <div className="mt-20 flex items-center justify-between gap-6">
        <Link href={`/services/${prev.slug}`} className="group flex items-center gap-4 min-w-0">
          <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block">
            <Image src={prev.images[0]} alt="" fill sizes="80px" className="object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-widest text-ink/50">Previous</span>
            <span className="block font-bold truncate group-hover:text-brand transition-colors">‹ {prev.title}</span>
          </span>
        </Link>
        <Link href={`/services/${next.slug}`} className="group flex items-center gap-4 min-w-0 text-right justify-end">
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-widest text-ink/50">Next</span>
            <span className="block font-bold truncate group-hover:text-brand transition-colors">{next.title} ›</span>
          </span>
          <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block">
            <Image src={next.images[0]} alt="" fill sizes="80px" className="object-cover" />
          </span>
        </Link>
      </div>
    </div>
  );
}
