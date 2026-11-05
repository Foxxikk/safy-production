import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del, head, list, put } from "@vercel/blob";

/**
 * Úložiště obsahu webu — soubory na disku, nebo Vercel Blob.
 *
 * Během stěhování běží web na dvou místech najednou: na Vercelu, kde
 * zůstává Blob, a na Hostingeru, kde se zapisuje na disk. Backend se volí
 * podle prostředí, takže obě verze jedou ze stejného kódu a nemusí se nic
 * přepínat ručně:
 *
 *   DATA_DIR nastavené            → soubory (Hostinger)
 *   jen BLOB_READ_WRITE_TOKEN     → Blob (Vercel)
 *   ani jedno                     → soubory do .data (vývoj)
 *
 * Data NESMÍ ležet v adresáři, kam se nasazuje kód — každé nasazení ho
 * přepíše. Proto v produkci míří DATA_DIR mimo aplikaci.
 */
const USE_FILES = Boolean(process.env.DATA_DIR) || !process.env.BLOB_READ_WRITE_TOKEN;

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), ".data");

export const MEDIA_DIR = path.join(DATA_DIR, "media");

const full = (rel) => path.join(DATA_DIR, rel);
const ensureDir = (dir) => fs.mkdir(dir, { recursive: true });

const blobPut = (key, body, contentType) =>
  put(key, body, {
    access: "public",
    ...(contentType ? { contentType } : {}),
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });

/** Načte JSON; když tam nic není, vrátí náhradní hodnotu. */
export async function readJson(rel, fallback = null) {
  if (USE_FILES) {
    try {
      return JSON.parse(await fs.readFile(full(rel), "utf8"));
    } catch {
      return fallback;
    }
  }
  try {
    const meta = await head(rel);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch {
    return fallback;
  }
}

/**
 * Zapíše JSON. Na disk atomicky — nejdřív do dočasného souboru, pak
 * přejmenuje. Kdyby zápis spadl v půlce, zůstane celá předchozí verze
 * místo oříznutého nesmyslu.
 */
export async function writeJson(rel, value) {
  if (!USE_FILES) {
    await blobPut(rel, JSON.stringify(value, null, 2), "application/json");
    return value;
  }
  const target = full(rel);
  await ensureDir(path.dirname(target));
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, target);
  return value;
}

/** Načte všechny JSON soubory z adresáře. */
export async function readJsonDir(relDir) {
  if (!USE_FILES) {
    try {
      const { blobs } = await list({ prefix: `${relDir}/`, limit: 1000 });
      const items = await Promise.all(
        blobs.map(async (b) => {
          try {
            const res = await fetch(b.url, { cache: "no-store" });
            return res.ok ? await res.json() : null;
          } catch {
            return null;
          }
        })
      );
      return items.filter(Boolean);
    } catch {
      return [];
    }
  }

  let names = [];
  try {
    names = await fs.readdir(full(relDir));
  } catch {
    return [];
  }
  const items = await Promise.all(
    names
      .filter((n) => n.endsWith(".json"))
      .map(async (n) => {
        try {
          return JSON.parse(await fs.readFile(path.join(full(relDir), n), "utf8"));
        } catch {
          return null;
        }
      })
  );
  return items.filter(Boolean);
}

export async function removeFile(rel) {
  if (!USE_FILES) {
    await del(rel).catch(() => {});
    return;
  }
  try {
    await fs.unlink(full(rel));
  } catch {
    /* soubor už není — nevadí */
  }
}

/** Uloží nahraný soubor a vrátí adresu, pod kterou ho web servíruje. */
export async function saveMedia(relName, buffer) {
  if (!USE_FILES) {
    const blob = await blobPut(`bx/${relName}`, buffer);
    return blob.url;
  }
  const target = path.join(MEDIA_DIR, relName);
  // Pojistka proti ../ v názvu — soubor nesmí uniknout z media adresáře
  if (!target.startsWith(MEDIA_DIR + path.sep)) throw new Error("Neplatná cesta.");
  await ensureDir(path.dirname(target));
  await fs.writeFile(target, buffer);
  return `/media/${relName.split(path.sep).join("/")}`;
}

/** Bezpečně přeloží veřejnou cestu na soubor v media adresáři. */
export function mediaPath(parts) {
  const target = path.join(MEDIA_DIR, ...parts);
  if (target !== MEDIA_DIR && !target.startsWith(MEDIA_DIR + path.sep)) return null;
  return target;
}
