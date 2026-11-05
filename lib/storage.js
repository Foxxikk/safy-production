import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Úložiště obsahu na disku serveru.
 *
 * Data NESMÍ ležet v adresáři, kam se nasazuje kód — každé nasazení ten
 * adresář přepíše a obsah by zmizel. Proto se cesta bere z proměnné
 * DATA_DIR a v produkci míří mimo aplikaci (typicky do domovského
 * adresáře). Když proměnná chybí, použije se `.data` vedle projektu,
 * což stačí pro vývoj.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), ".data");

export const MEDIA_DIR = path.join(DATA_DIR, "media");

const full = (rel) => path.join(DATA_DIR, rel);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/** Načte JSON; když soubor není, vrátí náhradní hodnotu. */
export async function readJson(rel, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(full(rel), "utf8"));
  } catch {
    return fallback;
  }
}

/**
 * Zapíše JSON atomicky — nejdřív do dočasného souboru, pak přejmenuje.
 * Kdyby zápis spadl v půlce, zůstane na disku celá předchozí verze
 * místo oříznutého nesmyslu.
 */
export async function writeJson(rel, value) {
  const target = full(rel);
  await ensureDir(path.dirname(target));
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, target);
  return value;
}

/** Načte všechny JSON soubory z adresáře. */
export async function readJsonDir(relDir) {
  const dir = full(relDir);
  let names = [];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const items = await Promise.all(
    names
      .filter((n) => n.endsWith(".json"))
      .map(async (n) => {
        try {
          return JSON.parse(await fs.readFile(path.join(dir, n), "utf8"));
        } catch {
          return null;
        }
      })
  );
  return items.filter(Boolean);
}

export async function removeFile(rel) {
  try {
    await fs.unlink(full(rel));
  } catch {
    /* soubor už není — nevadí */
  }
}

/** Uloží nahraný soubor do media a vrátí cestu, pod kterou ho web servíruje. */
export async function saveMedia(relName, buffer) {
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
