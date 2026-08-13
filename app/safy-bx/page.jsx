import BxHeader from "@/components/bx/BxHeader";
import Hero, { About } from "@/components/bx/Hero";
import Portfolio from "@/components/bx/Portfolio";
import ContactForm from "@/components/bx/ContactForm";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;

export async function generateMetadata() {
  const { settings } = await getSiteData();
  return {
    title: settings?.seoTitle || "ŠAFY BX — Brand experience marketing",
    description: settings?.seoDescription,
  };
}

export default async function BxLandingPage() {
  const data = await getSiteData();
  const all = publishedCases(data);
  const limit = Number(data.settings?.perPage) || 0;
  const cases = limit > 0 ? all.slice(0, limit) : all;

  // Náhled ke každému pilíři — titulní fotka prvního projektu z jeho kategorie.
  const previews = {};
  for (const c of all) {
    if (c.category && !previews[c.category] && c.images?.[0]) previews[c.category] = c.images[0];
  }

  return (
    <div className="bg-white dark:bg-dark text-ink dark:text-white min-h-screen">
      <BxHeader />
      <Hero pillars={data.pillars} previews={previews} />
      <Portfolio cases={cases} categories={data.categories} />
      {data.settings?.showStats !== false && <About stats={data.stats} />}
      <ContactForm intro={data.intro} settings={data.settings} />
    </div>
  );
}
