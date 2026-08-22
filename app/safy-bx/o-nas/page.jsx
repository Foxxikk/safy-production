import BxHeader from "@/components/bx/BxHeader";
import AboutPage from "@/components/bx/AboutPage";
import ContactForm from "@/components/bx/ContactForm";
import { getSiteData } from "@/lib/bxStore";

export const revalidate = 30;

export async function generateMetadata() {
  const { about, settings } = await getSiteData();
  return {
    title: `${about?.cs?.title || "O nás"} — ŠAFY BX`,
    description: about?.cs?.lead || settings?.seoDescription,
  };
}

export default async function AboutRoute() {
  const data = await getSiteData();

  return (
    <div className="bg-white dark:bg-dark text-ink dark:text-white min-h-screen">
      <BxHeader />
      <AboutPage about={data.about} stats={data.stats} settings={data.settings} />
      <ContactForm settings={data.settings} />
    </div>
  );
}
