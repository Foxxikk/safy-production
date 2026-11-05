import "server-only";
import { readJsonDir, removeFile, writeJson } from "./storage";

/**
 * Poptávky z kontaktního formuláře.
 *
 * Každá poptávka je vlastní soubor `bx/leads/<id>.json`. Kdyby přišly dvě
 * najednou, nemůže jedna přepsat druhou — na rozdíl od jednoho společného
 * seznamu, který by se musel načíst, upravit a uložit zpátky.
 */
const DIR = "bx/leads";
const file = (id) => `${DIR}/${id}.json`;

function normalize(l) {
  return {
    id: l.id,
    createdAt: l.createdAt || new Date().toISOString(),
    read: !!l.read,
    archived: !!l.archived,
    name: l.name || "",
    company: l.company || "",
    email: l.email || "",
    phone: l.phone || "",
    type: l.type || "",
    budget: l.budget || "",
    message: l.message || "",
    lang: l.lang || "cs",
    source: l.source || "/safy-bx",
  };
}

/** Načte všechny poptávky, nejnovější první. */
export async function getLeads() {
  const items = await readJsonDir(DIR);
  return items
    .map(normalize)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Uloží novou poptávku. */
export async function addLead(lead) {
  const item = normalize({
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
  });
  await writeJson(file(item.id), item);
  return item;
}

/** Hromadná akce nad vybranými poptávkami. */
export async function updateLeads(ids, action) {
  const set = new Set(Array.isArray(ids) ? ids : [ids]);
  const all = await getLeads();
  const touched = all.filter((l) => set.has(l.id));

  const apply = (l) => ({
    ...l,
    read: action === "read" ? true : action === "unread" ? false : l.read,
    archived:
      action === "archive" ? true : action === "unarchive" ? false : l.archived,
  });

  await Promise.all(
    touched.map((l) =>
      action === "delete" ? removeFile(file(l.id)) : writeJson(file(l.id), apply(l))
    )
  );

  if (action === "delete") return all.filter((l) => !set.has(l.id));
  return all.map((l) => (set.has(l.id) ? apply(l) : l));
}
