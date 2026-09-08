import ScrollPage from "@/components/bx/v2/ScrollPage";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;

/** Fotka na úvodní obrazovce. Až bude hotové video, nahradí ji tady. */
const HERO_IMAGE = "/images/bx/iqos-pop-up-store/01.webp";

export const metadata = {
  title: "ŠAFY BX — Brand experience marketing",
  robots: { index: false, follow: false },
};

/**
 * Návrh scrollovací verze úvodní stránky.
 * Běží vedle ostré /safy-bx, aby šly obě porovnat.
 */
export default async function BxScrollPage() {
  const data = await getSiteData();
  const cases = publishedCases(data);

  // Náhled ke každému pilíři — titulní fotka prvního projektu z jeho kategorie.
  const previews = {};
  for (const c of cases) {
    if (c.category && !previews[c.category] && c.images?.[0]) previews[c.category] = c.images[0];
  }

  return (
    <ScrollPage
      data={data}
      cases={cases}
      previews={previews}
      heroImage={data.settings?.heroImage || HERO_IMAGE}
    />
  );
}
