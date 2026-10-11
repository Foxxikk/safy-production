import { notFound } from "next/navigation";

import PillarDetailV3 from "@/components/bx/v3/PillarDetailV3";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;
export const dynamicParams = true;

const visible = (data) => (data.pillars?.cs || []).filter((p) => p.slug && p.published !== false);

export async function generateStaticParams() {
  const data = await getSiteData();
  return visible(data).map((p) => ({ slug: p.slug }));
}

export const metadata = { robots: { index: false, follow: false } };

/** Detail služby v grafice z nového návrhu. */
export default async function PillarV3Page({ params }) {
  const { slug } = await params;
  const data = await getSiteData();

  const cs = visible(data);
  const idx = cs.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  // Obě jazykové verze posíláme dolů, komponenta si vybere podle přepínače.
  const en = data.pillars?.en || [];
  const pair = (i) => (cs[i] ? { cs: cs[i], en: en[i] || cs[i] } : null);

  return (
    <PillarDetailV3
      pillar={pair(idx)}
      next={pair((idx + 1) % cs.length)}
      index={idx}
      cases={publishedCases(data).filter((c) => c.category === cs[idx].category)}
      categories={data.categories?.cs || {}}
      settings={data.settings}
    />
  );
}
