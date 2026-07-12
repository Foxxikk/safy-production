import { referencesFull, servicesFull } from "./content";

export const services = servicesFull.map((s) => ({
  slug: s.slug,
  title: s.title,
  image: s.images[0],
}));

export const references = referencesFull.map((r) => ({
  slug: r.slug,
  title: r.title,
  image: r.gallery[0],
}));

export const brands = [
  "red-bull", "sailor", "phlllip_morris", "ostravar", "metaxa", "jagermeister",
  "hendricks", "hoegaarden", "dior", "corona", "dame_jidlo", "cointreau",
  "aperol", "wai_moment", "tullamore", "uber", "the_botanist", "stella",
  "t-mobile", "staropramen", "squat", "spak",
];

export const company = {
  cz: {
    name: "Šafy production s.r.o.",
    address: "Údolní 212/1, 147 00, Praha 4",
    ico: "IČO: 24769444",
    dic: "DIČ: CZ24769444",
    emails: ["info@safyproduction.cz", "casting@safyproduction.cz"],
  },
  sk: {
    name: "Šafy production SK s.r.o.",
    address: "Panónská Cesta 34, 85104, Bratislava",
    ico: "IČO: 46031685",
    dic: "IČ DPH: SK2023207494",
    emails: ["info@safyproduction.cz", "castingSK@safyproduction.cz"],
  },
};
