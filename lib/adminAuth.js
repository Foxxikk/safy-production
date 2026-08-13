import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "bx_admin";

/**
 * Přihlášení řeší jedno sdílené heslo v proměnné ADMIN_PASSWORD.
 * V cookie není heslo, ale jeho podpis — takže se nikam neukládá v čitelné podobě.
 */
function secret() {
  return process.env.ADMIN_PASSWORD || "";
}

export function tokenFor(password) {
  return createHmac("sha256", password).update("safy-bx-admin-v1").digest("hex");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(password) {
  const s = secret();
  if (!s) return false;
  return safeEqual(password, s);
}

export async function isAuthed() {
  const s = secret();
  if (!s) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, tokenFor(s));
}

/** Je vůbec admin nakonfigurovaný? (chybějící heslo = admin vypnutý) */
export function isConfigured() {
  return Boolean(secret());
}
