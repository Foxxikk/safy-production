import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { referencesFull } from "../../../lib/content";
import Cta from "../../../components/Cta";

export function generateStaticParams() {
  return referencesFull.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = referencesFull.find((x) => x.slug === slug);
  return { title: r ? `${r.title} - Safyproduction` : "Reference" };
}

export default async function ReferenceDetail({ params }) {
  const { slug } = await params;
  const idx = referencesFull.findIndex((r) => r.slug === slug);
  if (idx === -1) notFound();
  const reference = referencesFull[idx];
  const prev = referencesFull[(idx - 1 + referencesFull.length) % referencesFull.length];
  const next = referencesFull[(idx + 1) % referencesFull.length];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <Link href="/reference" className="inline-block mb-10 font-bold underline underline-offset-4 hover:text-brand transition-colors">
          ← Back to references
        </Link>
        <h1 className="display-xl text-5xl md:text-8xl mb-12">{reference.title}</h1>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={reference.gallery[0]} alt={reference.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
          <div
            className="wp-content text-lg leading-relaxed [&_p]:mb-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: reference.contentHtml }}
          />
        </div>

        {reference.gallery.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {reference.gallery.slice(1).map((img, i) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden bg-ink">
                <Image src={img} alt={`${reference.title} — photo ${i + 2}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <Link href={`/reference/${prev.slug}`} className="font-bold underline underline-offset-4 hover:text-brand transition-colors">
            ← {prev.title}
          </Link>
          <Link href={`/reference/${next.slug}`} className="font-bold underline underline-offset-4 hover:text-brand transition-colors">
            {next.title} →
          </Link>
        </div>
      </section>
      <Cta />
    </>
  );
}
