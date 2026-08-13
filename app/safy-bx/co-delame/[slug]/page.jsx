import { notFound } from "next/navigation";
import BxHeader from "@/components/bx/BxHeader";
import PillarDetail from "@/components/bx/PillarDetail";
import ContactForm from "@/components/bx/ContactForm";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;
export const dynamicParams = true;

const visible = (data) => (data.pillars?.cs || []).filter((p) => p.slug && p.published !== false);

export async function generateStaticParams() {
  const data = await getSiteData();
  return visible(data).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getSiteData();
  const p = visible(data).find((x) => x.slug === slug);
  return {
    title: p ? `${p.title} — ŠAFY BX` : "ŠAFY BX",
    description: p ? p.lead || p.text : undefined,
  };
}

export default async function PillarPage({ params }) {
  const { slug } = await params;
  const data = await getSiteData();

  const cs = visible(data);
  const idx = cs.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  // Obě jazykové verze posíláme dolů, komponenta si vybere podle přepínače.
  const en = data.pillars?.en || [];
  const pair = (i) => (cs[i] ? { cs: cs[i], en: en[i] || cs[i] } : null);

  const related = publishedCases(data).filter((c) => c.category === cs[idx].category);

  return (
    <div className="bg-white dark:bg-dark text-ink dark:text-white min-h-screen">
      <BxHeader />
      <PillarDetail
        pillar={pair(idx)}
        index={idx}
        prev={pair((idx - 1 + cs.length) % cs.length)}
        next={pair((idx + 1) % cs.length)}
        cases={related}
        categories={data.categories}
      />
      <ContactForm settings={data.settings} />
    </div>
  );
}
