import { notFound } from "next/navigation";
import BxHeader from "@/components/bx/BxHeader";
import CaseDetail from "@/components/bx/CaseDetail";
import ContactForm from "@/components/bx/ContactForm";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const data = await getSiteData();
  return publishedCases(data).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getSiteData();
  const c = publishedCases(data).find((x) => x.slug === slug);
  return {
    title: c ? `${c.cs.title} — ŠAFY BX` : "ŠAFY BX",
    description: c ? (c.cs.intro || "").slice(0, 160) : undefined,
  };
}

export default async function BxCasePage({ params }) {
  const { slug } = await params;
  const data = await getSiteData();
  const cases = publishedCases(data);
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();

  const item = cases[idx];
  const prev = cases[(idx - 1 + cases.length) % cases.length];
  const next = cases[(idx + 1) % cases.length];

  return (
    <div className="bg-white dark:bg-dark text-ink dark:text-white min-h-screen">
      <BxHeader />
      <CaseDetail item={item} prev={prev} next={next} categories={data.categories} />
      <ContactForm />
    </div>
  );
}
