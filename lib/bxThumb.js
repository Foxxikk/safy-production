/**
 * Menší varianta fotky pro náhledy.
 *
 * Fotky referencí leží v /public v plném rozlišení (kolem 2400 px, půl mega
 * na kus). To je správně pro detail projektu, ale carousel i karty pilířů je
 * zobrazují na pár set pixelech — prohlížeč je stejně musí celé dekódovat
 * a při scrollování to sekalo. Vedle každého souboru proto leží varianta
 * `-sm` (dlouhá strana 1000 px), kterou pro náhledy použijeme.
 *
 * Fotky nahrané v adminu míří do Blobu, ty necháváme být.
 */
export function thumb(src = "") {
  const isLocalBx = src.startsWith("/images/bx/") && src.endsWith(".webp");
  return isLocalBx && !src.endsWith("-sm.webp") ? src.replace(/\.webp$/, "-sm.webp") : src;
}
