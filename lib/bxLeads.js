import "server-only";
import { del, list, put } from "@vercel/blob";

/**
 * Poptávky z kontaktního formuláře.
 *
 * Každá poptávka je vlastní soubor `bx/leads/<id>.json`. Kdyby přišly dvě
 * najednou, nemůže jedna přepsat druhou — na rozdíl od jednoho společného
 * seznamu, který by se musel načíst, upravit a uložit zpátky.
 */
const PREFIX = "bx/leads/";

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
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          if (!res.ok) return null;
          const data = normalize(await res.json());
          return { ...data, pathname: b.pathname };
        } catch {
          return null;
        }
      })
    );
    return items
      .filter(Boolean)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

async function writeLead(lead) {
  await put(`${PREFIX}${lead.id}.json`, JSON.stringify(lead, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
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
  await writeLead(item);
  return item;
}

/** Hromadná akce nad vybranými poptávkami. */
export async function updateLeads(ids, action) {
  const set = new Set(Array.isArray(ids) ? ids : [ids]);
  const all = await getLeads();
  const touched = all.filter((l) => set.has(l.id));

  await Promise.all(
    touched.map(async (l) => {
      if (action === "delete") {
        await del(`${PREFIX}${l.id}.json`).catch(() => {});
        return;
      }
      const next = {
        ...l,
        read: action === "read" ? true : action === "unread" ? false : l.read,
        archived:
          action === "archive" ? true : action === "unarchive" ? false : l.archived,
      };
      delete next.pathname;
      await writeLead(next);
    })
  );

  if (action === "delete") return all.filter((l) => !set.has(l.id));
  return all.map((l) =>
    set.has(l.id)
      ? {
          ...l,
          read: action === "read" ? true : action === "unread" ? false : l.read,
          archived:
            action === "archive" ? true : action === "unarchive" ? false : l.archived,
        }
      : l
  );
}
