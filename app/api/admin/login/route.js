import { NextResponse } from "next/server";
import { checkPassword, tokenFor, isConfigured, COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Admin není nastavený — chybí proměnná ADMIN_PASSWORD." },
      { status: 503 }
    );
  }
  const { password } = await req.json().catch(() => ({}));
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hodin
  });
  return res;
}
