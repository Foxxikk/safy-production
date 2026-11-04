import V3Page from "@/components/bx/v3/V3Page";
import { getSiteData, publishedCases } from "@/lib/bxStore";

export const revalidate = 30;

/** Úvodní fotka slouží i jako poster, než se načte smyčka. */
const HERO_IMAGE = "/images/bx/iqos-pop-up-store/01.webp";

/** Showreel na pozadí hera — překódovaný na 1600 px bez zvuku. */
const HERO_VIDEO = "/videos/hero.mp4";

export const metadata = {
  title: "ŠAFY BX — Brand experience marketing",
  robots: { index: false, follow: false },
};

/** Návrh klientky převedený do našeho webu. Běží vedle ostré verze. */
export default async function BxV3Page() {
  const data = await getSiteData();
  const cases = publishedCases(data);

  return (
    <V3Page
      data={data}
      cases={cases}
      heroImage={data.settings?.heroImage || HERO_IMAGE}
      heroVideo={data.settings?.heroVideo || HERO_VIDEO}
    />
  );
}
