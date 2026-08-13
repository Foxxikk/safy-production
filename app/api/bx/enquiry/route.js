import { NextResponse } from "next/server";
import { addLead } from "@/lib/bxLeads";

export const runtime = "nodejs";

const cut = (v, n) => String(v ?? "").trim().slice(0, n);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // Honeypot — vyplní ho jen robot.
  if (cut(body.website, 100)) return NextResponse.json({ ok: true });

  const name = cut(body.name, 120);
  const email = cut(body.email, 160);
  if (!name || !isEmail(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  try {
    await addLead({
      name,
      email,
      company: cut(body.company, 160),
      phone: cut(body.phone, 60),
      type: cut(body.type, 80),
      budget: cut(body.budget, 80),
      message: cut(body.message, 4000),
      lang: body.lang === "en" ? "en" : "cs",
      source: cut(body.source, 200) || "/safy-bx",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "storage" }, { status: 500 });
  }
}
