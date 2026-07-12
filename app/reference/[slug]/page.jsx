import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { references } from "../../../lib/data";
import Cta from "../../../components/Cta";

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
  const next = references[(idx + 1) % references.length];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <p className="font-bold text-brand uppercase tracking-wide mb-4">Reference</p>
        <h1 className="display-xl text-5xl md:text-8xl mb-12">{reference.title}</h1>
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={reference.image} alt={reference.title} fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <Link href="/reference" className="font-bold underline underline-offset-4 hover:text-brand transition-colors">
            ← All references
          </Link>
          <Link href={`/reference/${next.slug}`} className="font-bold underline underline-offset-4 hover:text-brand transition-colors">
            Next: {next.title} →
          </Link>
        </div>
      </section>
      <Cta />
    </>
  );
}
