import "server-only";
import { head, put } from "@vercel/blob";

/** Poptávky z kontaktního formuláře — vlastní dokument, oddělený od obsahu webu. */
export const LEADS_KEY = "bx/leads.json";

const MAX_LEADS = 500;

function normalize(list) {
  return (Array.isArray(list) ? list : [])
    .map((l) => ({
      id: l.id || `lead-${Date.now()}`,
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
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getLeads() {
  try {
    const meta = await head(LEADS_KEY);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    return normalize(await res.json());
  } catch {
    return [];
  }
}

export async function saveLeads(list) {
  const payload = normalize(list).slice(0, MAX_LEADS);
  await put(LEADS_KEY, JSON.stringify(payload, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return payload;
}

/** Přidá novou poptávku na začátek seznamu. */
export async function addLead(lead) {
  const list = await getLeads();
  const item = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
  };
  await saveLeads([item, ...list]);
  return item;
}
