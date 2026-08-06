import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BxHeader from "../../../components/BxHeader";
import BxFooter from "../../../components/BxFooter";
import { cases } from "../../../lib/bx";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  return { title: c ? `${c.title} — ŠAFY BX` : "ŠAFY BX" };
}

export default async function BxCaseDetail({ params }) {
  const { slug } = await params;
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const item = cases[idx];
  const prev = cases[(idx - 1 + cases.length) % cases.length];
  const next = cases[(idx + 1) % cases.length];

  const pad = (i) => String(i).padStart(2, "0");
  const gallery = [];
  for (let i = 2; i <= item.images; i++) gallery.push(`/images/bx/${slug}/${pad(i)}.webp`);

  return (
    <div className="bg-white text-ink min-h-screen">
      <BxHeader />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 pt-8">
        <Link
          href="/safy-bx"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-brand transition-colors"
        >
          ← Zpět na přehled
        </Link>
      </div>

      {/* Cover */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-6">
        <div className="relative aspect-[16/9] overflow-hidden bg-ink/5">
          <Image
            src={`/images/bx/${slug}/01.webp`}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Popisná karta — text ve vrchní části */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="relative -mt-16 md:-mt-24 bg-white md:max-w-3xl p-8 md:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
          <p className="text-sm uppercase tracking-[0.2em] text-brand mb-4">
            Brand experience
          </p>
          <h1 className="display-xl text-3xl md:text-5xl leading-tight">{item.title}</h1>
          <p className="text-ink/50 text-lg mt-2">{item.subtitle}</p>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">{item.intro}</p>
          <div className="mt-5 space-y-4 text-ink/70 leading-relaxed">
            {item.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Galerie */}
      {gallery.length > 0 && (
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-16">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {gallery.map((img, i) => (
              <div
                key={img}
                className={`relative overflow-hidden bg-ink/5 ${
                  i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img}
                  alt={`${item.title} — ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 mt-20 flex items-center justify-between gap-6 border-t border-black/10 pt-10">
        <Link href={`/safy-bx/${prev.slug}`} className="group min-w-0">
          <span className="block text-[11px] uppercase tracking-widest text-ink/40">
            Předchozí
          </span>
          <span className="block font-bold truncate group-hover:text-brand transition-colors">
            ‹ {prev.title}
          </span>
        </Link>
        <Link href={`/safy-bx/${next.slug}`} className="group min-w-0 text-right">
          <span className="block text-[11px] uppercase tracking-widest text-ink/40">
            Další
          </span>
          <span className="block font-bold truncate group-hover:text-brand transition-colors">
            {next.title} ›
          </span>
        </Link>
      </div>

      <BxFooter />
    </div>
  );
}
