import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/adminAuth";
import { getSiteData, saveSiteData } from "@/lib/bxStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nepřihlášeno" }, { status: 401 });
  }
  const data = await getSiteData({ fresh: true });
  return NextResponse.json(data);
}

export async function PUT(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nepřihlášeno" }, { status: 401 });
  }
  const body = await req.json();
  const saved = await saveSiteData(body);

  // Po uložení promítnout změny na web
  revalidatePath("/safy-bx");
  revalidatePath("/safy-bx/[slug]", "page");

  return NextResponse.json({ ok: true, updatedAt: saved.updatedAt });
}
