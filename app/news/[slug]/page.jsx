import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { news } from "../../../lib/news";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = news.find((x) => x.slug === slug);
  return { title: n ? `${n.title} - Safyproduction` : "News" };
}

function formatDate(d) {
  const [y, m, day] = d.split("-");
  return `${Number(day)}. ${Number(m)}. ${y}`;
}

export default async function NewsDetail({ params }) {
  const { slug } = await params;
  const idx = news.findIndex((n) => n.slug === slug);
  if (idx === -1) notFound();
  const article = news[idx];
  const prev = news[(idx - 1 + news.length) % news.length];
  const next = news[(idx + 1) % news.length];

  const pad = (i) => String(i).padStart(2, "0");
  const gallery = [];
  for (let i = 2; i <= article.images; i++) {
    gallery.push(`/images/news/${slug}/${pad(i)}.webp`);
  }

  return (
    <div>
      <div className="mx-auto max-w-5xl px-6 pt-14 pb-20">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 border border-ink px-5 py-3 font-bold text-sm hover:bg-brand hover:text-ink hover:border-brand transition-colors"
        >
          ← Back to news
        </Link>

        {/* Hero */}
        <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-dark">
          <Image
            src={`/images/news/${slug}/01.webp`}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-8 text-sm uppercase tracking-widest text-ink/50">
          {formatDate(article.date)}
        </p>
        <h1 className="display-xl text-3xl md:text-5xl lg:text-6xl mt-2 mb-8">
          {article.title}
        </h1>

        {/* Body */}
        <div className="text-lg leading-relaxed text-ink/90 space-y-5 max-w-3xl">
          {article.body.map((b, i) => {
            if (b.t === "h2" || b.t === "h3")
              return (
                <h2 key={i} className="text-2xl font-bold mt-8">
                  {b.x}
                </h2>
              );
            if (b.t === "li")
              return (
                <li key={i} className="ml-6 list-disc">
                  {b.x}
                </li>
              );
            return <p key={i}>{b.x}</p>;
          })}
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((img, i) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden bg-dark">
                <Image
                  src={img}
                  alt={`${article.title} — foto ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Prev / Next */}
        <div className="mt-20 flex items-center justify-between gap-6">
          <Link href={`/news/${prev.slug}`} className="group flex items-center gap-4 min-w-0">
            <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block bg-dark">
              <Image src={`/images/news/${prev.slug}/01.webp`} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-widest text-ink/40">Previous</span>
              <span className="block font-bold truncate group-hover:text-brand transition-colors">‹ {prev.title}</span>
            </span>
          </Link>
          <Link href={`/news/${next.slug}`} className="group flex items-center gap-4 min-w-0 text-right justify-end">
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-widest text-ink/40">Next</span>
              <span className="block font-bold truncate group-hover:text-brand transition-colors">{next.title} ›</span>
            </span>
            <span className="relative w-20 h-14 shrink-0 overflow-hidden hidden sm:block bg-dark">
              <Image src={`/images/news/${next.slug}/01.webp`} alt="" fill sizes="80px" className="object-cover" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
