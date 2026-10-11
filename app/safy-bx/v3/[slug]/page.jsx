import { notFound } from "next/navigation";

import CaseDetailV3 from "@/components/bx/v3/CaseDetailV3";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const data = await getSiteData();
  return publishedCases(data).map((c) => ({ slug: c.slug }));
}

export const metadata = { robots: { index: false, follow: false } };

/** Detail reference v grafice z nového návrhu. */
export default async function BxV3CasePage({ params }) {
  const { slug } = await params;
  const data = await getSiteData();
  const cases = publishedCases(data);
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();

  return (
    <CaseDetailV3
      item={cases[idx]}
      next={cases[(idx + 1) % cases.length]}
      index={idx}
      categories={data.categories?.cs || {}}
      settings={data.settings}
    />
  );
}
