import Link from "next/link";
import Image from "next/image";

export default function Cta() {
  return (
    <section className="py-28 text-center px-6">
      <Image
        src="/images/tapes/spark.svg"
        alt=""
        width={64}
        height={66}
        className="mx-auto mb-8"
      />
      <p className="text-2xl md:text-3xl mb-4">Start Planning Your Unforgettable Event Today!</p>
      <Link
        href="/contact"
        className="display-xl inline-block text-5xl md:text-7xl lg:text-8xl border-b-4 border-ink pb-3 hover:text-brand hover:border-brand transition-colors"
      >
        Let&apos;s try together
      </Link>
    </section>
  );
}
