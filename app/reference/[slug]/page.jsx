import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { references } from "../../../lib/site";

export function generateStaticParams() {
  return references.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = references.find((x) => x.slug === slug);
  return { title: r ? `${r.title} - Safyproduction` : "Reference" };
}

export default async function ReferenceDetail({ params }) {
  const { slug } = await params;
  const idx = references.findIndex((r) => r.slug === slug);
  if (idx === -1) notFound();
  const reference = references[idx];
  const prev = references[(idx - 1 + references.length) % references.length];
  const next = references[(idx + 1) % references.length];

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-20">
        <Link
          href="/reference"
          className="inline-flex items-center gap-2 border border-white px-5 py-3 font-bold text-sm hover:bg-brand hover:text-ink hover:border-brand transition-colors"
        >
          ← Back to references
        </Link>

        {/* Hero */}
        <div className="relative mt-10">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              src={reference.gallery[0]}
              alt={reference.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          <h1 className="display-xl text-4xl md:text-6xl lg:text-7xl relative -mt-16 md:-mt-24 px-6 md:px-12">
            {reference.title}
          </h1>
        </div>

        {/* Subtitle + text */}
        <div className="px-6 md:px-12 mt-8 max-w-5xl">
          {reference.subtitle && (
            <h2 className="text-xl md:text-2xl font-bold mb-6">{reference.subtitle}</h2>
          )}
          <div
            className="text-white/90 text-lg leading-relaxed [&_p]:mb-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1 [&_strong]:font-bold [&_strong]:text-white [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: reference.contentHtml }}
          />
        </div>

        {/* Gallery */}
        {reference.gallery.length > 1 && (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
            {reference.gallery.map((img, i) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden bg-dark">
                <Image
                  src={img}
                  alt={`${reference.title} — photo ${i + 1}`}
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
          <Link href={`/reference/${prev.slug}`} className="group flex items-center gap-4 min-w-0">
            <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block">
              <Image src={prev.gallery[0]} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-widest text-white/50">Previous</span>
              <span className="block font-bold truncate group-hover:text-brand transition-colors">‹ {prev.title}</span>
            </span>
          </Link>
          <Link href={`/reference/${next.slug}`} className="group flex items-center gap-4 min-w-0 text-right justify-end">
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-widest text-white/50">Next</span>
              <span className="block font-bold truncate group-hover:text-brand transition-colors">{next.title} ›</span>
            </span>
            <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block">
              <Image src={next.gallery[0]} alt="" fill sizes="80px" className="object-cover" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
