import Link from "next/link";
import Image from "next/image";
import { news } from "../../lib/news";
import Tape from "../../components/Tape";

export const metadata = {
  title: "News - Safyproduction",
  description: "Latest News",
};

function formatDate(d) {
  const [y, m, day] = d.split("-");
  return `${Number(day)}. ${Number(m)}. ${y}`;
}

export default function NewsPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-20 pb-10">
        <Tape
          src="/images/tapes/tape-green.svg"
          width={1100}
          height={69}
          className="absolute top-16 right-[-45%] w-[80%] hidden md:block"
          from="translateX(120px) rotate(-4deg)"
          to="rotate(-9deg)"
        />
        <div className="mx-auto max-w-7xl px-6 relative">
          <h1 className="display-xl text-6xl md:text-9xl">News</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {news.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-dark">
                <Image
                  src={`/images/news/${n.slug}/01.webp`}
                  alt={n.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-sm text-ink/50">{formatDate(n.date)}</p>
              <h2 className="mt-1 text-xl font-bold leading-tight group-hover:text-brand transition-colors">
                {n.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
