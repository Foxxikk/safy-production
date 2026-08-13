import BxHeader from "@/components/bx/BxHeader";
import Hero, { About } from "@/components/bx/Hero";
import Portfolio from "@/components/bx/Portfolio";
import ContactForm from "@/components/bx/ContactForm";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;

export default async function BxLandingPage() {
  const data = await getSiteData();
  const cases = publishedCases(data);

  return (
    <div className="bg-white dark:bg-dark text-ink dark:text-white min-h-screen">
      <BxHeader />
      <Hero intro={data.intro} />
      <Portfolio cases={cases} categories={data.categories} />
      <About pillars={data.pillars} stats={data.stats} />
      <ContactForm />
    </div>
  );
}
