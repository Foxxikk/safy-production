/**
 * Příprava fotek před nahráním — běží v prohlížeči.
 *
 * Klientka nahrává originály z foťáku (často 20 MB JPG). Tady je zmenšíme
 * na rozumnou velikost a převedeme na webp, takže se na server posílá
 * hotový soubor pro web a nikdo nemusí nic upravovat ručně.
 */

export const MAX_SIDE = 2560; // delší strana — pokryje i retina displeje
export const QUALITY = 0.86;

/** Formáty, které umíme zpracovat v prohlížeči. */
const PROCESSABLE = /^image\/(jpeg|png|webp|gif|bmp)$/i;

const kb = (n) => (n / 1024).toFixed(0);

/**
 * Zmenší a převede jeden soubor.
 * Když zpracování nedává smysl (SVG, neznámý formát, výsledek by byl větší),
 * vrátí původní soubor beze změny.
 */
export async function prepareImage(file, { maxSide = MAX_SIDE, quality = QUALITY } = {}) {
  const orig = { name: file.name, size: file.size, type: file.type };

  if (!PROCESSABLE.test(file.type || "")) {
    return { file, orig, changed: false, note: "formát ponechán beze změny" };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Např. HEIC z iPhonu prohlížeč neotevře — pošleme originál.
    return { file, orig, changed: false, note: "prohlížeč formát neotevřel" };
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h });

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = canvas.convertToBlob
    ? await canvas.convertToBlob({ type: "image/webp", quality })
    : await new Promise((res) => canvas.toBlob(res, "image/webp", quality));

  if (!blob) return { file, orig, changed: false, note: "převod se nezdařil" };

  // Když je originál menší i rozměrově vhodný, nemá smysl ho nahrazovat.
  if (blob.size >= file.size && scale === 1) {
    return { file, orig, changed: false, note: "originál je už dost malý" };
  }

  const base = (file.name || "fotka").replace(/\.[^.]+$/, "");
  const out = new File([blob], `${base}.webp`, { type: "image/webp" });

  return {
    file: out,
    orig,
    changed: true,
    width: w,
    height: h,
    note:
      scale < 1
        ? `${width}×${height} → ${w}×${h}, ${kb(file.size)} → ${kb(out.size)} kB`
        : `${kb(file.size)} → ${kb(out.size)} kB`,
  };
}

/** Zpracuje více souborů najednou a vrátí i souhrn úspory. */
export async function prepareImages(files, opts) {
  const results = [];
  for (const f of files) results.push(await prepareImage(f, opts));

  const before = results.reduce((s, r) => s + r.orig.size, 0);
  const after = results.reduce((s, r) => s + r.file.size, 0);

  return {
    results,
    files: results.map((r) => r.file),
    before,
    after,
    saved: before - after,
    savedPct: before ? Math.round((1 - after / before) * 100) : 0,
  };
}
