import { referencesFull, servicesFull, team } from "./content";
import extra from "./extra.json";

export const references = referencesFull.map((r) => ({
  ...r,
  subtitle: extra.subs[`ref:${r.slug}`] || "",
  categories: extra.cats[r.slug] || [],
}));

export const services = servicesFull.map((s) => ({
  ...s,
  subtitle: extra.subs[`svc:${s.slug}`] || "",
  excerpt: extra.excerpts[s.title] || "",
}));

export const refCategories = [
  ...new Set(references.flatMap((r) => r.categories)),
].sort();

export { team };
