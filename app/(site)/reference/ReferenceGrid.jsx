"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ReferenceGrid({ references, categories }) {
  const [active, setActive] = useState("All");
  const shown =
    active === "All" ? references : references.filter((r) => r.categories.includes(active));

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="flex flex-wrap gap-x-7 gap-y-2 mb-10">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`font-medium transition-colors ${
              active === c ? "text-brand" : "text-white hover:text-brand"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((r) => (
          <Link key={r.slug} href={`/reference/${r.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-dark">
              <Image
                src={r.gallery[0]}
                alt={r.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 font-bold text-lg leading-tight">
                {r.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
